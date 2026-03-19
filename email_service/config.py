import os
from dotenv import load_dotenv

load_dotenv()

GMAIL_FROM_EMAIL = os.getenv('GMAIL_FROM_EMAIL')
CREDENTIALS_PATH = os.getenv('CREDENTIALS_PATH', './client_secret.json')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'


def validate_config():
    errors = []
    
    if not GMAIL_FROM_EMAIL:
        errors.append("❌ GMAIL_FROM_EMAIL not set in .env file")
    
    if not os.path.exists(CREDENTIALS_PATH):
        errors.append(f"❌ Credentials file not found: {CREDENTIALS_PATH}")
    
    if errors:
        print("\n⚠️  Configuration Errors:")
        for error in errors:
            print(f"   {error}")
        print("\n💡 Make sure:")
        print("   1. .env file exists in the same directory")
        print("   2. GMAIL_FROM_EMAIL is set in .env")
        print("   3. credentials.json file exists and path is correct\n")
        return False
    
    return True


def print_config():
    print("\n" + "="*50)
    print("📋 Email Service Configuration")
    print("="*50)
    print(f"Gmail Email: {GMAIL_FROM_EMAIL}")
    print(f"Credentials: {CREDENTIALS_PATH} ({'✅ exists' if os.path.exists(CREDENTIALS_PATH) else '❌ missing'})")
    print(f"Flask Port: {FLASK_PORT}")
    print(f"Debug Mode: {FLASK_DEBUG}")
    print("="*50 + "\n")
