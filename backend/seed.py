from app import create_app, db
from app.models import AttendanceRecord, Course, FeeRecord, Notice, ResultRecord, Student, Teacher, User

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    admin = User(name="Ariana Blake", email="admin@unisphere.edu", role="admin")
    admin.set_password("Admin@123")
    teacher_user = User(name="Prof. Lucas Kim", email="teacher@unisphere.edu", role="teacher")
    teacher_user.set_password("Teacher@123")
    student_user = User(name="Maya Rodriguez", email="student@unisphere.edu", role="student")
    student_user.set_password("Student@123")

    db.session.add_all([admin, teacher_user, student_user])
    db.session.flush()

    teacher = Teacher(
        employee_id="FAC-2048",
        department="Computer Science",
        designation="Associate Professor",
        user_id=teacher_user.id,
    )
    student = Student(
        registration_number="UNI-2026-1042",
        program="B.Tech AI & Data Science",
        semester=6,
        cgpa=8.84,
        attendance_percentage=93,
        user_id=student_user.id,
    )
    course = Course(code="AI402", title="Applied Machine Learning", credits=4, faculty_name=teacher_user.name)
    db.session.add_all([teacher, student, course])
    db.session.flush()

    db.session.add_all(
        [
            AttendanceRecord(student_id=student.id, course_id=course.id, month="January", present=24, total=26),
            AttendanceRecord(student_id=student.id, course_id=course.id, month="February", present=22, total=24),
            AttendanceRecord(student_id=student.id, course_id=course.id, month="March", present=25, total=26),
            ResultRecord(student_id=student.id, course_id=course.id, exam_name="Mid Semester", marks=87, grade="A"),
            ResultRecord(student_id=student.id, course_id=course.id, exam_name="End Semester", marks=91, grade="A+"),
            FeeRecord(student_id=student.id, semester_label="Spring 2026", total_amount=4800, paid_amount=3600, status="Partial"),
            Notice(title="Global Immersion Week", category="Event", content="International exchange showcases and innovation booths."),
            Notice(title="Placement Bootcamp", category="Placement", content="Resume clinics and recruiter prep sessions this Friday."),
        ]
    )
    db.session.commit()
    print("Seeded demo data.")
