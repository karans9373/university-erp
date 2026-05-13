from flask import Blueprint, request

chatbot_bp = Blueprint("chatbot", __name__)


@chatbot_bp.post("/")
def chatbot():
    message = (request.get_json() or {}).get("message", "")
    return {
        "reply": f"UniSphere Assistant: I can help with admissions, attendance, fees, results, and campus notices. You asked: {message}"
    }
