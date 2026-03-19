# 


import base64
import os
from email.message import EmailMessage

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/gmail.readonly']


class GmailService:

    def __init__(self, credentials_path):
        self.credentials_path = credentials_path  # client_secret.json
        self.token_path = "token.json"
        self.service = None
        self.sender_email = None
        self.authenticate()

    def authenticate(self):
        creds = None

        # ✅ Load existing token
        if os.path.exists(self.token_path):
            creds = Credentials.from_authorized_user_file(self.token_path, SCOPES)

        # ❗ If no valid token → login flow
        if not creds or not creds.valid:
            flow = InstalledAppFlow.from_client_secrets_file(
                self.credentials_path, SCOPES
            )
            creds = flow.run_local_server(port=8080)

            # Save token for reuse
            with open(self.token_path, 'w') as token:
                token.write(creds.to_json())

        self.service = build('gmail', 'v1', credentials=creds)

        # Extract logged-in email
        profile = self.service.users().getProfile(userId='me').execute()
        self.sender_email = "das123chilkaditya@gmail.com"

        print(f"✅ Authenticated as {self.sender_email}")

    def send_email(self, recipient_email, subject, body):
        try:
            message = EmailMessage()
            message.set_content(body)

            message['To'] = recipient_email
            message['From'] = self.sender_email
            message['Subject'] = subject

            encoded_message = base64.urlsafe_b64encode(
                message.as_bytes()
            ).decode()

            result = self.service.users().messages().send(
                userId='me',
                body={'raw': encoded_message}
            ).execute()

            return {
                "success": True,
                "message_id": result['id']
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


def get_gmail_service(credentials_path):
    return GmailService(credentials_path)