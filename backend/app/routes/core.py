from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from .. import db
from ..models import AttendanceRecord, Course, FeeRecord, Notice, ResultRecord, Student, Teacher, User
from ..services.dashboard_service import attendance_payload, fee_payload, notice_payload, result_payload, student_payload, teacher_payload
from ..utils.auth import role_required

core_bp = Blueprint("core", __name__)


@core_bp.get("/students")
@jwt_required(optional=True)
def students():
    return {"items": student_payload()}


@core_bp.post("/students")
@role_required("admin")
def create_student():
    payload = request.get_json() or {}
    user = User(name=payload["name"], email=payload["email"], role="student")
    user.set_password(payload.get("password", "Student@123"))
    db.session.add(user)
    db.session.flush()

    student = Student(
        registration_number=payload["registrationNumber"],
        program=payload["program"],
        semester=payload["semester"],
        cgpa=payload.get("cgpa", 0),
        attendance_percentage=payload.get("attendancePercentage", 0),
        user_id=user.id,
    )
    db.session.add(student)
    db.session.commit()
    return {"message": "Student created"}, 201


@core_bp.get("/teachers")
@jwt_required(optional=True)
def teachers():
    return {"items": teacher_payload()}


@core_bp.get("/attendance")
@jwt_required(optional=True)
def attendance():
    return {"items": attendance_payload()}


@core_bp.post("/attendance")
@role_required("admin", "teacher")
def create_attendance():
    payload = request.get_json() or {}
    student = _find_student(payload)
    if not student:
        return {"message": "Student not found"}, 404

    course = _find_course(payload)
    if not course:
        return {"message": "Course not found"}, 404

    record = AttendanceRecord(
        month=payload["month"],
        present=payload["present"],
        total=payload["total"],
        student_id=student.id,
        course_id=course.id,
    )
    db.session.add(record)
    db.session.flush()

    student_records = AttendanceRecord.query.filter_by(student_id=student.id).all()
    if student_records:
        student.attendance_percentage = round(
            sum((row.present / row.total) * 100 for row in student_records) / len(student_records), 1
        )

    db.session.commit()
    return {"message": "Attendance added"}, 201


@core_bp.get("/results")
@jwt_required(optional=True)
def results():
    return {"items": result_payload()}


@core_bp.post("/results")
@role_required("admin", "teacher")
def create_result():
    payload = request.get_json() or {}
    student = _find_student(payload)
    if not student:
        return {"message": "Student not found"}, 404

    course = _find_course(payload)
    if not course:
        return {"message": "Course not found"}, 404

    marks = payload["marks"]
    result = ResultRecord(
        exam_name=payload["examName"],
        marks=marks,
        grade=payload.get("grade") or _grade_from_marks(marks),
        student_id=student.id,
        course_id=course.id,
    )
    db.session.add(result)
    db.session.flush()

    student_results = ResultRecord.query.filter_by(student_id=student.id).all()
    if student_results:
        student.cgpa = round(sum(_grade_point(row.grade) for row in student_results) / len(student_results), 2)

    db.session.commit()
    return {"message": "Result added"}, 201


@core_bp.get("/fees")
@jwt_required(optional=True)
def fees():
    return {"items": fee_payload()}


@core_bp.get("/notices")
@jwt_required(optional=True)
def notices():
    return {"items": notice_payload()}


@core_bp.post("/notices")
@role_required("admin", "teacher")
def create_notice():
    payload = request.get_json() or {}
    notice = Notice(title=payload["title"], category=payload["category"], content=payload["content"])
    db.session.add(notice)
    db.session.commit()
    return {"message": "Notice posted"}, 201


@core_bp.get("/modules")
def modules():
    return {
        "items": [
            "Student Management",
            "Teacher Management",
            "Admin Dashboard",
            "Attendance Management",
            "Result/GPA System",
            "Online Admission Portal",
            "Course Enrollment",
            "Fee Management",
            "Library Management",
            "Hostel Management",
            "Assignment Submission",
            "Online Exam Portal",
            "Events & Notices",
            "Timetable Management",
            "Placement Cell",
            "AI Chatbot Support",
            "Student Performance Analytics",
            "Messaging/Notification System",
        ]
    }


def _find_student(payload):
    if payload.get("studentId"):
        return Student.query.get(payload["studentId"])
    if payload.get("registrationNumber"):
        return Student.query.filter_by(registration_number=payload["registrationNumber"]).first()
    if payload.get("studentName"):
        return Student.query.join(User).filter(User.name == payload["studentName"]).first()
    return None


def _find_course(payload):
    if payload.get("courseId"):
        return Course.query.get(payload["courseId"])
    if payload.get("courseCode"):
        return Course.query.filter_by(code=payload["courseCode"]).first()
    if payload.get("course"):
        return Course.query.filter_by(title=payload["course"]).first()
    return None


def _grade_from_marks(marks):
    if marks >= 90:
        return "A+"
    if marks >= 80:
        return "A"
    if marks >= 70:
        return "B+"
    if marks >= 60:
        return "B"
    if marks >= 50:
        return "C"
    return "F"


def _grade_point(grade):
    mapping = {"A+": 10, "A": 9, "B+": 8, "B": 7, "C": 6, "F": 0}
    return mapping.get(grade, 0)
