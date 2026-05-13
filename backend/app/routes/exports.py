from flask import Blueprint, send_file

from ..services.dashboard_service import export_excel_bytes, export_pdf_bytes

exports_bp = Blueprint("exports", __name__)


@exports_bp.get("/excel")
def export_excel():
    output = export_excel_bytes()
    return send_file(
        output,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        as_attachment=True,
        download_name="unisphere-report.xlsx",
    )


@exports_bp.get("/pdf")
def export_pdf():
    output = export_pdf_bytes()
    return send_file(output, mimetype="application/pdf", as_attachment=True, download_name="unisphere-report.pdf")
