from fastapi import FastAPI, APIRouter
from fastapi.responses import RedirectResponse, HTMLResponse
import os
from datetime import datetime
from typing import Optional
import json

from schema import *
import mail
import auth

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

@api.get("/menu/locations", response_model=list[Location], tags=["menu"])
def get_locations():
    return None

@api.get("/menu/food-properties", response_model=list[FoodProperty], tags=["menu"])
def get_food_properties():
    return None

@api.get("/menu/monthly-view/{location-slug}/{menu-type-slug}/{year}/{month}", 
         response_model=list[MonthlyViewDay], tags=["menu"])
def get_monthly_view(location_slug: str, menu_type_slug: str, year: int, month: int):
    return None

@api.get("/menu/daily-menu/{location-slug}/{menu-type-slug}/{year}/{month}/{day}",
        response_model=Menu, tags=["menu"])
def get_daily_menu(location_slug: str, menu_type_slug: str, year: int, month: int, day: int):
    return None

@api.get("/menu/latest-item-version/{hash}", response_model=DatedMenuItem, tags=["menu"])
def get_latest_item_version(hash: str):
    return None

# Feed Related Routes

# User Related Routes

@api.post("/user/login", tags=["user"], description="Send login code to email")
def login(email: str) -> Token:
    return auth.login_attempt(email, f"https://{DOMAIN}/api/user/authorize-login?code={{secret}}")

@api.get("/user/authorize-login", tags=["user"], description="Login redirect url")
def authorize_login(code: str):
    return auth.authorize_login(code)

@api.get("/user/login-authorized", tags=["user"], description="Login redirect url")
def login_authorized(login_token: Token):
    return auth.login_authorized(login_token)

@api.get("/user/notifications", response_model=list[DatedMenuItem], tags=["user"])
def get_notifications():
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
