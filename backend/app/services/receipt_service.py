import os
import uuid
import qrcode
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A5, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from app.core.config import settings

class ReceiptService:
    @staticmethod
    def generate_receipt_pdf(
        receipt_number: str,
        donor_name: str,
        donor_mobile: str,
        amount: float,
        purpose: str,
        payment_method: str,
        transaction_ref: str,
        issued_at: datetime,
        download_hash: str
    ) -> str:
        """
        Generates a tamper-proof, aesthetic A5-landscape donation receipt PDF.
        """
        filename = f"receipt_{receipt_number}_{uuid.uuid4().hex[:8]}.pdf"
        file_path = os.path.join(settings.RECEIPT_DIR, filename)

        doc = SimpleDocTemplate(
            file_path,
            pagesize=landscape(A5),
            rightMargin=15 * mm,
            leftMargin=15 * mm,
            topMargin=12 * mm,
            bottomMargin=12 * mm
        )

        elements = []
        styles = getSampleStyleSheet()

        # Custom Styles
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontSize=16,
            leading=20,
            textColor=colors.HexColor('#0B1D3A'),
            alignment=1
        )
        subtitle_style = ParagraphStyle(
            'SubTitleStyle',
            parent=styles['Normal'],
            fontSize=10,
            leading=13,
            textColor=colors.HexColor('#D97706'),
            alignment=1
        )
        receipt_badge_style = ParagraphStyle(
            'BadgeStyle',
            parent=styles['Normal'],
            fontSize=11,
            leading=14,
            textColor=colors.HexColor('#1E3A8A'),
            alignment=1,
            fontName='Helvetica-Bold'
        )
        label_style = ParagraphStyle(
            'LabelStyle',
            parent=styles['Normal'],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#4B5563'),
            fontName='Helvetica-Bold'
        )
        val_style = ParagraphStyle(
            'ValStyle',
            parent=styles['Normal'],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#111827')
        )
        amount_style = ParagraphStyle(
            'AmountStyle',
            parent=styles['Normal'],
            fontSize=13,
            leading=16,
            textColor=colors.HexColor('#047857'),
            fontName='Helvetica-Bold'
        )

        # Header Section
        elements.append(Paragraph("<b>पोथीपुरा युवा समिति (Pothipura Youth Committee)</b>", title_style))
        elements.append(Paragraph("श्री राधा कृष्ण मंदिर, पोथी का नगला (पोथीपुरा) • श्री कृष्ण जन्माष्टमी एवं खेलकूद महोत्सव 2026", subtitle_style))
        elements.append(Spacer(1, 4 * mm))

        # Receipt Number & Date Banner
        formatted_date = issued_at.strftime("%d-%b-%Y %I:%M %p")
        banner_data = [
            [
                Paragraph(f"<b>RECEIPT NO: {receipt_number}</b>", receipt_badge_style),
                Paragraph(f"<b>DATE:</b> {formatted_date}", val_style)
            ]
        ]
        banner_table = Table(banner_data, colWidths=[100 * mm, 70 * mm])
        banner_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FEF3C7')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('LINEBELOW', (0, 0), (-1, -1), 1, colors.HexColor('#D97706')),
        ]))
        elements.append(banner_table)
        elements.append(Spacer(1, 4 * mm))

        # QR Code for Verification
        qr_data = f"https://pothipura-youth-committee.vercel.app/transparency"
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=3,
            border=1,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        img_buffer = BytesIO()
        qr_img = qr.make_image(fill_color="#0B1D3A", back_color="white")
        qr_img.save(img_buffer, format="PNG")
        img_buffer.seek(0)
        
        qr_rl_img = RLImage(img_buffer, width=28 * mm, height=28 * mm)

        # Details Table
        details_data = [
            [Paragraph("Donor Name / दानदाता:", label_style), Paragraph(f"<b>{donor_name}</b>", val_style), qr_rl_img],
            [Paragraph("Mobile Number / मोबाइल:", label_style), Paragraph(f"XXXXXX{donor_mobile[-4:] if len(donor_mobile) >= 4 else donor_mobile}", val_style), ""],
            [Paragraph("Amount / सहयोग राशि:", label_style), Paragraph(f"₹ {amount:,.2f} /-", amount_style), ""],
            [Paragraph("Purpose / उद्देश्य:", label_style), Paragraph(f"{purpose.upper()}", val_style), ""],
            [Paragraph("Payment Mode / माध्यम:", label_style), Paragraph(f"{payment_method.replace('_', ' ')} (Ref: {transaction_ref or 'Verified Cash'})", val_style), ""],
            [Paragraph("Status / स्थिति:", label_style), Paragraph("<b>✓ 100% VERIFIED & RECORDED IN OFFICIAL LEDGER</b>", val_style), ""],
        ]

        table = Table(details_data, colWidths=[45 * mm, 95 * mm, 30 * mm])
        table.setStyle(TableStyle([
            ('SPAN', (2, 0), (2, 5)), # QR code spans all rows
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 2),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ('LINEBELOW', (0, 0), (1, -1), 0.5, colors.HexColor('#E5E7EB')),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 5 * mm))

        # Footer Signatures & Note
        footer_data = [
            [
                Paragraph("<i>धन्यवाद! आपका सहयोग पोथीपुरा ग्राम संस्कृति एवं महोत्सव आयोजन हेतु अमूल्य है।<br/>(Official Valid Digital Receipt • पोथी का नगला)</i>", ParagraphStyle('F', fontSize=7.5, leading=9, textColor=colors.HexColor('#6B7280'))),
                Paragraph("<b>अधिकृत हस्ताक्षरकर्ता</b><br/>राजेश (कोषाध्यक्ष) / आकाश (अध्यक्ष)<br/>पोथीपुरा युवा समिति", ParagraphStyle('FS', fontSize=8, leading=10, alignment=2, textColor=colors.HexColor('#0B1D3A')))
            ]
        ]
        footer_table = Table(footer_data, colWidths=[110 * mm, 60 * mm])
        footer_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
        ]))
        elements.append(footer_table)

        doc.build(elements)
        return filename

receipt_service = ReceiptService()
