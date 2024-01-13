import os.path
import base64
from email.message import EmailMessage

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

flow = InstalledAppFlow.from_client_secrets_file(
    "/secrets/gmail/credentials.json", SCOPES
)

def get_gmail_service():
    creds = None
    if os.path.exists("/secrets/gmail/token.json"):
        creds = Credentials.from_authorized_user_file("/secrets/gmail/token.json", SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            return None
        
    return build("gmail", "v1", credentials=creds)

def get_authorization_url(redirect_url):
    flow.redirect_uri = redirect_url    
    return flow.authorization_url(access_type="offline", include_granted_scopes="true", prompt="consent")[0]

def save_refresh_token(code):
    flow.fetch_token(code=code)
    creds = flow.credentials
    with open("/secrets/gmail/token.json", "w") as token:
        token.write(creds.to_json())

def send_mail(to, subject, text, html=None):
    service = get_gmail_service()
    
    if service is None:
        return None
    
    try:
        message = EmailMessage()

        message.set_content(text)

        if html is not None:
            message.add_alternative(html, subtype="html")

        message["To"] = to
        message["Subject"] = subject

        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

        create_message = {"raw": encoded_message}

        send_message = (
            service.users()
            .messages()
            .send(userId="me", body=create_message)
            .execute()
        )
        return(send_message["id"])
    
    except HttpError:
        return None
