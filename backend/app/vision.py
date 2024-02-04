import base64
from openai import OpenAI
import os
import requests
from PIL import Image
from io import BytesIO

from schema import *
import menu_management

client = OpenAI()

def load_image(image_path, max_width=1024, max_height=1024):
    image = Image.open(image_path)
    image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    url = f"data:image/jpeg;base64,{b64}"
    return url


# read all images in ./demo_images
image_dir = "./demo_images"
image_paths = [os.path.join(image_dir, f) for f in os.listdir(image_dir)]
image_names = [os.path.basename(f) for f in image_paths]
images = [load_image(image_path) for image_path in image_paths]

print("???", flush=True)

SYSTEM_PROMPT = """
You are responsible for annotating meal photos. First, creatively describe the meal. \
Then, identify EVERY menu item in the image using the provided menu \
and estimate the number of servings of each. Respond in raw JSON with the following format:
{"summary": "A heap of ...", "menu_items": [{"comment":"Specifically sausage pizza.", "index": 1, "name": "Pizza", "servings": 1}, ...]
"""

def menu_to_prompt(menu: Menu):
    index = 1
    user_prompt = "Menu:\n"
    for section in menu.sections:
        user_prompt += f"{section.name}:\n"
        for item in section.menu_items:
            user_prompt += f"  {index}: {item.menu_item.name} (serving size: {item.menu_item.serving_size.amount} {item.menu_item.serving_size.unit})\n"
            index += 1
    return user_prompt

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