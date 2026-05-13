from flask import Blueprint, request
from flask_jwt_extended import create_access_token

from ..models import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/login")
def login():
    payload = request.get_json() or {}
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return {"message": "Invalid email or password"}, 401

    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role, "name": user.name})
    return {
        "accessToken": token,
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role},
    }


@auth_bp.post("/register")
def register():
    payload = request.get_json() or {}
    email = payload.get("email", "").strip().lower()
    if User.query.filter_by(email=email).first():
        return {"message": "Email already exists"}, 409

    user = User(name=payload["name"], email=email, role=payload.get("role", "student"))
    user.set_password(payload["password"])
    from .. import db

    db.session.add(user)
    db.session.commit()
    return {"message": "User registered successfully"}, 201
