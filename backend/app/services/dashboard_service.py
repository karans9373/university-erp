from io import BytesIO

import pandas as pd
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Spacer, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

from ..models import AttendanceRecord, Course, FeeRecord, Notice, ResultRecord, Student, Teacher, User


def dashboard_snapshot():
    total_students = Student.query.count()
    total_teachers = Teacher.query.count()
    total_courses = Course.query.count()
    total_notices = Notice.query.count()

    attendance_rows = AttendanceRecord.query.all()
    avg_attendance = round(
        sum((row.present / row.total) * 100 for row in attendance_rows) / max(len(attendance_rows), 1), 2
    )
    fees = FeeRecord.query.all()
    fee_collection = round(sum(item.paid_amount for item in fees), 2)

    return {
        "stats": [
            {"label": "Students", "value": total_students, "delta": "+12%"},
            {"label": "Faculty", "value": total_teachers, "delta": "+4%"},
            {"label": "Courses", "value": total_courses, "delta": "+8%"},
            {"label": "Fee Collection", "value": f"${fee_collection:,.0f}", "delta": "+17%"},
        ],
        "overview": {
            "attendanceRate": avg_attendance,
            "retentionRate": 96.4,
            "placementRate": 89.7,
            "activeNotices": total_notices,
        },
    }


def student_payload():
    rows = Student.query.join(User).all()
    return [
        {
            "id": row.id,
            "name": row.user.name,
            "email": row.user.email,
            "registrationNumber": row.registration_number,
            "program": row.program,
            "semester": row.semester,
            "cgpa": row.cgpa,
            "attendancePercentage": row.attendance_percentage,
        }
        for row in rows
    ]


def teacher_payload():
    rows = Teacher.query.join(User).all()
    return [
        {
            "id": row.id,
            "name": row.user.name,
            "email": row.user.email,
            "employeeId": row.employee_id,
            "department": row.department,
            "designation": row.designation,
        }
        for row in rows
    ]


def attendance_payload():
    rows = AttendanceRecord.query.join(Student, AttendanceRecord.student_id == Student.id).join(User, Student.user_id == User.id).all()
    return [
        {
            "month": row.month,
            "studentName": row.student.user.name,
            "course": row.course.title,
            "present": row.present,
            "total": row.total,
            "percentage": round((row.present / row.total) * 100, 1),
        }
        for row in rows
    ]


def result_payload():
    rows = ResultRecord.query.join(Student, ResultRecord.student_id == Student.id).join(User, Student.user_id == User.id).all()
    return [
        {
            "examName": row.exam_name,
            "studentName": row.student.user.name,
            "course": row.course.title,
            "marks": row.marks,
            "grade": row.grade,
        }
        for row in rows
    ]


def fee_payload():
    rows = FeeRecord.query.join(Student, FeeRecord.student_id == Student.id).join(User, Student.user_id == User.id).all()
    return [
        {
            "semesterLabel": row.semester_label,
            "studentName": row.student.user.name,
            "totalAmount": row.total_amount,
            "paidAmount": row.paid_amount,
            "balance": row.total_amount - row.paid_amount,
            "status": row.status,
        }
        for row in rows
    ]


def notice_payload():
    rows = Notice.query.order_by(Notice.created_at.desc()).all()
    return [{"title": row.title, "category": row.category, "content": row.content} for row in rows]


def export_excel_bytes():
    output = BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        pd.DataFrame(student_payload()).to_excel(writer, sheet_name="Students", index=False)
        pd.DataFrame(attendance_payload()).to_excel(writer, sheet_name="Attendance", index=False)
        pd.DataFrame(result_payload()).to_excel(writer, sheet_name="Results", index=False)
        pd.DataFrame(fee_payload()).to_excel(writer, sheet_name="Fees", index=False)
    output.seek(0)
    return output


def export_pdf_bytes():
    output = BytesIO()
    doc = SimpleDocTemplate(output, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = [Paragraph("UniSphere ERP Summary Report", styles["Title"]), Spacer(1, 18)]

    summary_data = [["Metric", "Value"]]
    snapshot = dashboard_snapshot()["overview"]
    for key, value in snapshot.items():
        summary_data.append([key, str(value)])

    table = Table(summary_data, colWidths=[220, 220])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F3C88")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D5DCEE")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F5F7FF")]),
            ]
        )
    )
    elements.append(table)
    doc.build(elements)
    output.seek(0)
    return output
