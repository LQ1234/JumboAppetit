# app/schema.py
# Author: Larry Qiu
# Date: 1/22/2023
# Purpose: Define the schema for the API

from pydantic import BaseModel, Field
from typing import Optional, Annotated, Any
from datetime import datetime
import hashlib
Date = Annotated[str, Field(example="2023-12-31")]

# Menu Related Models

MenuItemHash = Annotated[str, Field(...)]

class MenuType(BaseModel):
    slug: str = Field(..., example="breakfast")
    name: str = Field(..., example="Breakfast")
    displayed: bool = Field(..., example=True)

class Location(BaseModel):
    slug: str = Field(..., example="dewick-dining")
    name: str = Field(..., example="Dewick-MacPhie Dining Center")
    menu_types: list[MenuType] = Field(...)
    displayed: bool = Field(..., example=True)

class FoodProperty(BaseModel):
    slug: str = Field(..., example="egg")
    name: str = Field(..., example="Egg")
    description: str = Field(..., example="Contains egg")
    displayed: bool = Field(..., example=True)

class ServingSize(BaseModel):
    amount: str = Field(..., example="1")
    unit: str = Field(..., example="each")

class MenuItem(BaseModel):
    name: str = Field(..., example="Egg & Cheese Muffin")
    food_properties: list[str] = Field(..., example=["egg"])
    nutrition_information: Optional[list[dict[str, Optional[str]]]] = Field(..., example=[{"slug": "calories", "amount": "238"}])
    ingredients: str = Field(..., example="English Muffin (enriched flour, water, yeast, high fructose corn syrup, yellow corn meal, soybean oil, calcium priopionate and/or potassium sorbate, baking soda, fumaric acid, salt, calcium sulfate, ammonium sulfate), Grade AA Medium Eggs, White American Cheese (cultured milk and skim milk, water, cream, sodium citrate, salt, sodium phosphate, sorbic acid, citric acid, acetic acid, enzymes, soy lecithin, artificial color)")
    serving_size: ServingSize = Field(...)
    hash: MenuItemHash = Field(...)

class DatedMenuItem(BaseModel):
    menu_item: MenuItem = Field(...)
    date: Date = Field(...)
    latest_version: Optional["DatedMenuItem"] = Field(...)

class NotifiedItem(BaseModel):
    latest_version: DatedMenuItem = Field(...)
    hashes: list[MenuItemHash] = Field(...)

class Menu(BaseModel):
    class Section(BaseModel):
        name: str = Field(..., example="Breakfast Grill")
        menu_items: list[DatedMenuItem] = Field(...)

    date: Date = Field(...)
    sections: list[Section] = Field(...)

class MonthlyViewDay(BaseModel):
    day: Date = Field(...)
    has_menu_items: bool = Field(..., example=True)

# Feed Related Models
    
# User Related Models
    
class UserInformation(BaseModel):
    name: str = Field(..., example="John Doe")
    email: str = Field(..., example="john.doe@tufts.edu")
    instagram: Optional[str] = Field(None, example="johndoe")

Token = Annotated[str, Field(..., description="JWT Token")]

class TokenData(BaseModel):
    identifier: Optional[str] = None
    token_type: str = Field(..., description="login or bearer")

class User(BaseModel):
    user_information: UserInformation = Field(...)
    identifier: str = Field(...)
    notified_items: list[MenuItemHash] = Field(..., default_factory=list)
    notification_token: Optional[str] = Field(None, description="Expo Push Token")


class LoginLog(BaseModel):
    date: datetime = Field(...)
    email: str = Field(...)
    secret: str = Field(...)
    identifier: str = Field(...)
    authorized: bool = Field(...)


def scrape_to_menu_item(item: dict[str, Any]) -> Optional[MenuItem]:
    h = hashlib.md5(usedforsecurity=False)
    food = item["food"]
    if food is None:
        return None

    if food["rounded_nutrition_info"] is not None:
        nutrition_information = []
        for key, val in sorted(food["rounded_nutrition_info"].items(), key=lambda x: x[0]):
            nutrition_information.append({"slug": key, "amount": str(val) if val is not None else None})

            h.update(key.encode("utf-8"))
            h.update(str(val).encode("utf-8"))
    else:
        nutrition_information = None

    food_properties = []
    for icon in sorted(food["icons"]["food_icons"], key=lambda x: x["slug"]):
        food_properties.append(icon["slug"])

        h.update(icon["slug"].encode("utf-8"))

    h.update(food["name"].encode("utf-8"))
    h.update(food["ingredients"].encode("utf-8"))
    h.update(str(food["serving_size_info"]["serving_size_amount"]).encode("utf-8"))
    h.update(str(food["serving_size_info"]["serving_size_unit"]).encode("utf-8"))

    menu_item = MenuItem(
        name=food["name"],
        food_properties=food_properties,
        nutrition_information=nutrition_information,
        ingredients=food["ingredients"],
        serving_size=ServingSize(
            amount=food["serving_size_info"]["serving_size_amount"],
            unit=str(food["serving_size_info"]["serving_size_unit"])
        ),
        hash=h.hexdigest()
    )

    return menu_item
