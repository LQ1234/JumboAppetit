# app/vision.py
# Author: Larry Qiu
# Date: 2/25/2023
# Purpose: Vision implementation for JumboAppetit

import base64
from openai import AsyncOpenAI
import os
import requests
from PIL import Image
from io import BytesIO
import pandas as pd
import numpy as np
from database import db
from schema import *
import menu_management
import ijson
from typing import Iterator
import json
from fuzzywuzzy import fuzz
import asyncio
client = AsyncOpenAI()

menu_item_embeddings = db["menu-item-embeddings"]
embeddings = None
# Menu item embeddings


async def generate_embeddings():
    global embeddings
    embeddings = {}
    for name, hashes in menu_management.food_versions.items():
        embedding_db = menu_item_embeddings.find_one({"name": name})
        if embedding_db is None:
            response = await client.embeddings.create(
                model="text-embedding-3-small",
                input=name
            )
            embedding = response.data[0].embedding
            menu_item_embeddings.insert_one({"name": name, "embedding": embedding})

            print(f"Generated embedding for {name}", flush=True)
        else:
            embedding = embedding_db["embedding"]
        embeddings[name] = embedding
    
    print("Embeddings loaded", flush=True)

    embeddings = pd.DataFrame(embeddings).T

# loop = asyncio.get_event_loop()
# loop.run_until_complete(generate_embeddings())
asyncio.create_task(generate_embeddings())


async def closest_menu_items(name: str) -> list[str]:
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=name
    )
    embedding = response.data[0].embedding
    distances = embeddings.apply(lambda x: np.linalg.norm(x - embedding), axis=1)
    return list(distances.sort_values().index[:3])


def load_image(image_path: str, max_width:int=1024, max_height:int=1024) -> str:
    image = Image.open(image_path)
    image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    url = f"data:image/jpeg;base64,{b64}"
    return url

def load_image_bytes(image_bytes: bytes, max_width:int=1024, max_height:int=1024) -> str:
    image = Image.open(BytesIO(image_bytes))
    image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    url = f"data:image/jpeg;base64,{b64}"
    return url

async def item_str_to_item(name: str, amount: str) -> tuple[MenuItem, int]:
    SYSTEM_PROMPT = """
    You are responsible for matching a dish name to the closest item in a menu and estimating the number of servings. \
    You will be given a list of menu items and serving sizes. If none of the potential items are in any way related, repond with null. \
    Respond in raw JSON (no ```) with the following format:
    {"name": "Sausage Pizza", "servings": 1}
    """

    USER_PROMPT = "Dish to match: " + name + "\n"
    USER_PROMPT += "Dish size: " + amount + "\n"
    USER_PROMPT += "Potential menu items:\n" 
    
    menu_items = []

    for potential_name in await closest_menu_items(name):
        menu_item = menu_management.get_menu_item(menu_management.food_versions[potential_name][0])
        menu_items.append(menu_item)

        USER_PROMPT += f"- {menu_item.name}, serving size: {menu_item.serving_size.amount}{menu_item.serving_size.unit}\n"
    
    response = await client.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": USER_PROMPT
                    }
                ],
            }
        ],
        max_tokens=500
    )

    print(name, flush=True)
    response_json = json.loads(response.choices[0].message.content)
    
    if response_json is None:
        return None, None

    if response_json["name"] is None or response_json["servings"] is None:
        return None, None

    best_score = 0
    best_menu_item = None

    for menu_item in menu_items:
        score = fuzz.ratio(menu_item.name, response_json["name"])
        if score > best_score:
            best_score = score
            best_menu_item = menu_item

    return (best_menu_item, response_json["servings"])




async def find_items(image_url: str) -> Iterator[str]:
    SYSTEM_PROMPT = """
    You are responsible for annotating meal photos. First, creatively describe the meal. \
    Then, identify EVERY menu item in the image \
    and estimate the amount of each with approximate units. Respond in raw JSON (no ```) with the following format:
    {"summary": "A heap of ...", "menu_items": [{"name": "Sausage Pizza", "amount": "One slice"}, ...] \
    If the photo is not of a meal, respond with {"summary": null}.
    """

    response = await client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url,
                            "detail": "high"
                        },
                    }
                ],
            }
        ],
        max_tokens=500,
        stream=True
    )

    summary_events = ijson.sendable_list()
    menu_items_events = ijson.sendable_list()
    summary_coro = ijson.items_coro(summary_events, 'summary')
    menu_items_coro = ijson.items_coro(menu_items_events, 'menu_items.item')
    async for chunk in response:
        res = chunk.choices[0].delta.content
        if res == None:
            continue

        summary_coro.send(res.encode("utf-8"))
        menu_items_coro.send(res.encode("utf-8"))

        for event in summary_events:
            yield "data: " + json.dumps({"summary": event}) + "\n\n"

        for event in menu_items_events:
            menu_item, servings = await item_str_to_item(event["name"], event["amount"])
            if menu_item is None:
                continue
            yield "data: " + json.dumps({"menu_item": menu_item.model_dump(mode='json'), "servings": servings}) + "\n\n"
       

        del summary_events[:]
        del menu_items_events[:]
    yield "data: " + json.dumps({"status": "stop"}) + "\n\n"

    summary_coro.close()
    menu_items_coro.close()

async def analyze_image(image):
    yield "data: " + json.dumps({"status": "start"}) + "\n\n"
    print("Analyzing image", flush=True)
    image_url = load_image_bytes(image)
    print("Image loaded", flush=True)

    async for item in find_items(image_url):
        yield item


# read all images in ./demo_images
# image_dir = "./demo_images"
# image_paths = [os.path.join(image_dir, f) for f in os.listdir(image_dir)]
# image_names = [os.path.basename(f) for f in image_paths]
# images = [load_image(image_path) for image_path in image_paths]


# for i in range(7):
#     print(image_names[i], flush=True)
#     for item in find_items(images[i]):
#         print(item, flush=True)

# for i in range(7):
#     image_name_parts = image_names[i].split("_")
#     print(image_name_parts)
#     menu = menu_management.get_menu(f"{int(image_name_parts[2]):04}-{int(image_name_parts[0]):02}-{int(image_name_parts[1]):02}", image_name_parts[3], image_name_parts[4])

#     print(menu_to_prompt(menu))

#     response = client.chat.completions.create(
#         model="gpt-4-vision-preview",
#         messages=[
#             {
#                 "role": "system",
#                 "content": SYSTEM_PROMPT
#             },
#             {
#                 "role": "user",
#                 "content": [
#                     {
#                         "type": "text",
#                         "text": menu_to_prompt(menu)
#                     },
#                     {
#                         "type": "image_url",
#                         "image_url": {
#                             "url": images[i],
#                             "detail": "high"
#                         },
#                     }
#                 ],
#             }
#         ],
#         max_tokens=500,
#         stream=True
#     )

#     for chunk in response:
#         res = chunk.choices[0].delta.content
#         if res == None:
#             continue
#         print(res, flush=True, end="")