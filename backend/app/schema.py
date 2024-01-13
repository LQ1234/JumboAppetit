from pydantic import BaseModel, Field
from typing import Optional, Annotated
from datetime import datetime
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
    name: str = Field(..., example="Contains Egg")
    displayed: bool = Field(..., example=True)

class ServingSize(BaseModel):
    amount: str = Field(..., example="1")
    unit: str = Field(..., example="each")

class MenuItem(BaseModel):
    name: str = Field(..., example="Egg & Cheese Muffin")
    food_properties: list[str] = Field(..., example=["egg"])
    nutrition_information: list[dict[str, str]] = Field(..., example=[{"slug": "calories", "amount": "238"}])
    ingredients: str = Field(..., example="English Muffin (enriched flour, water, yeast, high fructose corn syrup, yellow corn meal, soybean oil, calcium priopionate and/or potassium sorbate, baking soda, fumaric acid, salt, calcium sulfate, ammonium sulfate), Grade AA Medium Eggs, White American Cheese (cultured milk and skim milk, water, cream, sodium citrate, salt, sodium phosphate, sorbic acid, citric acid, acetic acid, enzymes, soy lecithin, artificial color)")
    serving_size: ServingSize = Field(...)
    hash: MenuItemHash = Field(...)

class DatedMenuItem(BaseModel):
    class LatestVersion(BaseModel):
        date: Date = Field(...)
        hash: MenuItemHash = Field(...)

    menu_item: MenuItem = Field(...)
    date: Date = Field(...)
    latest_version: Optional[LatestVersion] = Field(...)

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


class LoginLog(BaseModel):
    date: datetime = Field(...)
    email: str = Field(...)
    secret: str = Field(...)
    identifier: str = Field(...)
    authorized: bool = Field(...)