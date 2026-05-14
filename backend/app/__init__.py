import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
jwt = JWTManager()


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///unisphere.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me")

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": os.getenv("FRONTEND_URL", "*")}}, supports_credentials=True)

    from .routes.analytics import analytics_bp
    from .routes.auth import auth_bp
    from .routes.chatbot import chatbot_bp
    from .routes.core import core_bp
    from .routes.exports import exports_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(core_bp, url_prefix="/api")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(exports_bp, url_prefix="/api/exports")
    app.register_blueprint(chatbot_bp, url_prefix="/api/chatbot")

    @app.get("/")
    def index():
        return {
            "service": "UniSphere ERP API",
            "status": "running",
            "message": "Backend is live. Use the /api routes for application data.",
            "endpoints": {
                "health": "/api/health",
                "login": "/api/auth/login",
                "students": "/api/students",
                "dashboard": "/api/analytics/dashboard",
            },
        }

    @app.get("/api/health")
    def health():
        return {"status": "ok", "service": "UniSphere ERP API"}

    return app
