from flask import Blueprint
from flask_jwt_extended import jwt_required

from ..services.dashboard_service import attendance_payload, dashboard_snapshot, fee_payload, result_payload

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.get("/dashboard")
@jwt_required(optional=True)
def dashboard():
    attendance = attendance_payload()
    results = result_payload()
    fees = fee_payload()
    return {
        **dashboard_snapshot(),
        "attendanceTrend": [{"name": row["month"], "attendance": row["percentage"]} for row in attendance],
        "gradeDistribution": [
            {"name": "A+", "value": sum(1 for row in results if row["grade"] == "A+")},
            {"name": "A", "value": sum(1 for row in results if row["grade"] == "A")},
            {"name": "B+", "value": sum(1 for row in results if row["grade"] == "B+")},
        ],
        "feeTrend": [{"name": row["semesterLabel"], "paid": row["paidAmount"], "balance": row["balance"]} for row in fees],
    }
