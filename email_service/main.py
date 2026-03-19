from flask import Flask, request, jsonify
import sys
import traceback

from config import (
    GMAIL_FROM_EMAIL,
    CREDENTIALS_PATH,
    FLASK_PORT,
    FLASK_DEBUG,
    validate_config,
    print_config
)
from main_service.gmail_sender import get_gmail_service

app = Flask(__name__)
gmail_service = None


def initialize_gmail_service():
    global gmail_service
    
    try:
        print("🔐 Initializing Gmail service...")
        gmail_service = get_gmail_service(CREDENTIALS_PATH)
        print("✅ Gmail service initialized successfully!\n")
        return True
    
    except Exception as e:
        print(f"❌ Failed to initialize Gmail service: {e}")
        traceback.print_exc()
        return False



@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "Email service is running"
    }), 200


@app.route('/send-email', methods=['POST'])
def send_email_endpoint():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "message": "Request body must be JSON"
            }), 400
        
        recipient_email = data.get('recipient_email')
        
        if not recipient_email:
            return jsonify({
                "success": False,
                "message": "recipient_email is required"
            }), 400
        
        subject = data.get('subject', 'Welcome to Demo Project!')
        body = data.get('body', f"""
Hello {recipient_email},

Thank you for signing in to our Demo Project!

If this wasn't you, please contact support.

Best regards,
The Demo Project Team
        """.strip())
        
        if not gmail_service:
            return jsonify({
                "success": False,
                "message": "Gmail service not initialized"
            }), 500
        
        result = gmail_service.send_email(
            recipient_email=recipient_email,
            subject=subject,
            body=body
        )
        
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
    
    except Exception as e:
        print(f"❌ Error in send_email_endpoint: {e}")
        traceback.print_exc()
        
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "message": "Endpoint not found. Available: /health, /send-email"
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        "success": False,
        "message": "Method not allowed. Use GET for /health, POST for /send-email"
    }), 405


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "success": False,
        "message": "Internal server error"
    }), 500


def main():
    print("\n" + "="*60)
    print("🚀 Email Notification Service")
    print("="*60)
    
    print_config()
    
    print("🔍 Validating configuration...")
    if not validate_config():
        print("⛔ Configuration validation failed. Exiting.\n")
        sys.exit(1)
    print("✅ Configuration valid!\n")
    
    if not initialize_gmail_service():
        print("⛔ Failed to initialize Gmail service. Exiting.\n")
        sys.exit(1)
    
    print("📡 Starting Flask server...")
    print(f"🌐 Server running on http://localhost:{FLASK_PORT}")
    print(f"💡 Try: curl http://localhost:{FLASK_PORT}/health\n")
    print("Press Ctrl+C to stop the server\n")
    
    app.run(debug=FLASK_DEBUG, port=FLASK_PORT)


if __name__ == '__main__':
    main()

