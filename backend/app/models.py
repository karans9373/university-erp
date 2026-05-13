from datetime import datetime

from werkzeug.security import check_password_hash, generate_password_hash

from . import db


class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class User(db.Model, TimestampMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(180), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(30), nullable=False)

    student = db.relationship("Student", backref="user", uselist=False)
    teacher = db.relationship("Teacher", backref="user", uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Student(db.Model, TimestampMixin):
    id = db.Column(db.Integer, primary_key=True)
    registration_number = db.Column(db.String(60), unique=True, nullable=False)
    program = db.Column(db.String(120), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    cgpa = db.Column(db.Float, default=0)
    attendance_percentage = db.Column(db.Float, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    attendance_records = db.relationship("AttendanceRecord", backref="student", lazy=True)
    result_records = db.relationship("ResultRecord", backref="student", lazy=True)
    fee_records = db.relationship("FeeRecord", backref="student", lazy=True)


class Teacher(db.Model, TimestampMixin):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(60), unique=True, nullable=False)
    department = db.Column(db.String(120), nullable=False)
    designation = db.Column(db.String(120), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)


class Course(db.Model, TimestampMixin):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(40), unique=True, nullable=False)
    title = db.Column(db.String(140), nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    faculty_name = db.Column(db.String(120), nullable=False)
    attendance_records = db.relationship("AttendanceRecord", backref="course", lazy=True)
    result_records = db.relationship("ResultRecord", backref="course", lazy=True)


class AttendanceRecord(db.Model, TimestampMixin):
    id = db.Column(db.Integer, primary_key=True)
    month = db.Column(db.String(30), nullable=False)
    present = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey("student.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)


class ResultRecord(db.Model, TimestampMixin):
    id = db.Column(db.Integer, primary_key=True)
    exam_name = db.Column(db.String(80), nullable=False)
    marks = db.Column(db.Float, nullable=False)
    grade = db.Column(db.String(5), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey("student.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)


class FeeRecord(db.Model, TimestampMixin):
    id = db.Column(db.Integer, primary_key=True)
    semester_label = db.Column(db.String(60), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    paid_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey("student.id"), nullable=False)


class Notice(db.Model, TimestampMixin):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    category = db.Column(db.String(40), nullable=False)
    content = db.Column(db.Text, nullable=False)
