from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status, Request
from datetime import datetime, timedelta
import os
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Annotated
import random
import string
import uuid

from schema import *
import mail
from database import db

login_log = db["login-log"]
users = db["users"]
expiry = int(os.environ.get("LOGIN_EXPIRY_MINUTES"))
interval = int(os.environ.get("LOGIN_INTERVAL_SECONDS"))
login_log.create_index("date", expireAfterSeconds=60 * expiry)

JWT_SECRET = os.environ.get("JWT_SECRET")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM")

# Login Logic
def email_to_name(email: str) -> str:
    return email.split("@")[0].replace(".", " ").title()

def validate_email(email: str) -> bool:
    return email.endswith("@tufts.edu") 

def new_user_from_email(email: str) -> Optional[User]:
    if not validate_email(email):
        return None
    
    user = User(
        user_information=UserInformation(
            name=email_to_name(email), 
            email=email
        ), 
        identifier=email
    )
    return user


LOGIN_EMAIL_FORMAT = """Your JumboAppetit login code is {secret}."""

LOGIN_EMAIL_HTML_FORMAT = """
<html>
    <head>
        <title>JumboAppetit Login</title>
    </head>
    <body>
        <p>Hi {name},</p>
        <br>
        <p>Open this <a href="{url}">link</a> or enter the code {secret} to login to JumboAppetit.</p>
        <p>This link will expire in {expiry} minutes.</p>
        <p>If you did not request this login, please ignore this email.</p>
        <br>
        <p>Thanks,</p>
        <p>JumboAppetit</p>
    </body>
</html>
"""

def login_attempt(email: str, login_url: str) -> Token:
    if not validate_email(email):
        raise HTTPException(status_code=400, detail="Invalid email")
    
    if login_log.find_one({"date": {"$gt": datetime.now() - timedelta(seconds=interval)}, "email": email}): 
        raise HTTPException(status_code=429, detail="Too many login attempts")   
    
    secret = "".join([random.choice(string.ascii_uppercase) for _ in range(6)])
    identifier = uuid.uuid4().hex

    login_log.insert_one({
        "date": datetime.now(), 
        "email": email, 
        "secret": secret,
        "identifier": identifier,
        "authorized": False,
    })
    
    login_token = jwt.encode({
        "identifier": identifier, "token_type": "login"
    }, JWT_SECRET, algorithm=JWT_ALGORITHM)

    login_email = LOGIN_EMAIL_FORMAT.format(
        secret=secret
    )
    
    login_email_html = LOGIN_EMAIL_HTML_FORMAT.format(
        name=email_to_name(email), 
        url=login_url.format(secret=secret), 
        secret=secret, 
        expiry=expiry
    )

    emailid = mail.send_mail(email, "JumboAppetit Login", login_email, html=login_email_html)

    if emailid is None:
        raise HTTPException(status_code=500, detail="Failed to send email")
    
    return login_token

def authorize_login(secret: str) -> None:
    secret = secret.upper()

    login = login_log.find_one({"secret": secret})
    if login is None:
        raise HTTPException(status_code=400, detail="Invalid secret")
    
    login_log.update_one({"secret": secret}, {"$set": {"authorized": True}})


def login_authorized(login_token: Token) -> Token:
    payload = jwt.decode(login_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    if payload["token_type"] != "login":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    login = login_log.find_one({"identifier": payload["identifier"]})

    if login is None or not login["authorized"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    login_log.delete_one({"identifier": payload["identifier"]})

    new_user = new_user_from_email(login["email"])

    if new_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    existing_user = users.find_one({"identifier": new_user.identifier})
    if existing_user is None:
        users.insert_one(new_user.model_dump())
    
    token = jwt.encode({
        "identifier": new_user.identifier, "token_type": "bearer"
    }, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return token
    

# Authentication Logic
bearer = HTTPBearer()

def http_jwt(credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer)]) -> TokenData:
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if payload["token_type"] != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return payload