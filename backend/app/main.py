from fastapi import FastAPI, APIRouter, Depends
from fastapi.responses import RedirectResponse, HTMLResponse
import os
from datetime import datetime
from typing import Optional
import json

from schema import *
import mail
import auth
import menu_management

DOMAIN = os.environ.get("DOMAIN")

tags_metadata = [
    {
        "name": "menu",
        "description": "Operations on the menu",
    },
    {
        "name": "feed",
        "description": "Operations on the feed",
    },
    {
        "name": "user",
        "description": "Operations on a user",
    },
    {
        "name": "admin",
        "description": "Admin operations",
    }
]

app = FastAPI(openapi_tags=tags_metadata, openapi_url="/api/openapi.json", docs_url="/api/docs")
api = APIRouter(prefix="/api")

# Menu Related Routes

@api.get("/menu/locations", tags=["menu"])
def get_locations() -> list[Location]:
    return list(menu_management.locations.values())

@api.get("/menu/food-properties", tags=["menu"])
def get_food_properties() -> list[FoodProperty]:
    return list(menu_management.food_properties.values())

@api.get("/menu/monthly-view/{location-slug}/{menu-type-slug}/{year}/{month}", tags=["menu"])
def get_monthly_view(location_slug: str, menu_type_slug: str, year: int, month: int) -> list[MonthlyViewDay]:
    return None

@api.get("/menu/daily-menu/{location-slug}/{menu-type-slug}/{year}/{month}/{day}", tags=["menu"])
def get_daily_menu(location_slug: str, menu_type_slug: str, year: int, month: int, day: int) -> Optional[Menu]:
    date = f"{year:04}-{month:02}-{day:02}"
    menu = menu_management.get_menu(date, location_slug, menu_type_slug)
    return menu

@api.get("/menu/latest-item-version/{hash}", tags=["menu"])
def get_latest_item_version(hash: MenuItemHash) -> Optional[DatedMenuItem]:
    return menu_management.find_latest_item_version(hash)

# Feed Related Routes

# User Related Routes

@api.post("/user/login", tags=["user"], description="Send login code to email")
def login(email: str) -> Token:
    return auth.login_attempt(email, f"https://{DOMAIN}/api/user/authorize-login?code={{secret}}")

@api.get("/user/authorize-login", tags=["user"], description="Login redirect url")
def authorize_login(code: str):
    auth.authorize_login(code)
    return HTMLResponse("Authorized!")

@api.post("/user/login-authorized", tags=["user"], description="Login redirect url")
def login_authorized(login_token: Token) -> Token:
    return auth.login_authorized(login_token)

@api.get("/user/notifications", tags=["user"])
def get_notifications() -> list[DatedMenuItem]:
    return None

@api.post("/user/register-notification", tags=["user"])
def register_notification(menu_item_hash: str, registered: bool):
    return None

# Admin Related Routes

@api.get("/admin/login", tags=["admin"], description="Reauthorize gmail account")
def authorize():
    auth_url = mail.get_authorization_url(f"https://{DOMAIN}/api/admin/authorize")
    return RedirectResponse(auth_url, status_code=303)

@api.get("/admin/authorize", tags=["admin"], description="Gmail redirect url")
def authorize(code: str):
    mail.save_refresh_token(code)
    return HTMLResponse("<h1>Authorized!</h1>")
    
@api.get("/admin/send-test-email", tags=["admin"], description="Send test email")
def send_test_email():
    test_email_addr = os.environ.get("EMAIL")
    dt = datetime.now()
    id = mail.send_mail(test_email_addr, "Test Email", f"Test email sent at {dt}")
    if id is None:
        return HTMLResponse("<h1>Failed to send email</h1>")
    return HTMLResponse(f"<h1>Sent email with id {id}</h1>")


app.include_router(api)