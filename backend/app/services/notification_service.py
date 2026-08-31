import logging
from typing import Optional

logger = logging.getLogger(__name__)

class NotificationService:
    @staticmethod
    async def send_donation_receipt_notification(
        mobile: str,
        email: Optional[str],
        donor_name: str,
        amount: float,
        receipt_number: str,
        download_url: str
    ):
        """
        Decoupled notification dispatcher for WhatsApp, SMS, and Email.
        In dev/MVP, logs the formatted message to stdout and system log.
        """
        wa_message = (
            f"🕉️ श्री कृष्ण जन्माष्टमी महोत्सव - ग्राम युवा समिति\n\n"
            f"आदरणीय {donor_name} जी,\n"
            f"आपके द्वारा दिए गए ₹{amount:,.2f} के सहयोग के लिए समिति आपका हार्दिक आभार व्यक्त करती है।\n\n"
            f"रसीद संख्या: {receipt_number}\n"
            f"ई-रसीद डाउनलोड लिंक: {download_url}\n\n"
            f"जय श्री कृष्णा! 🙏"
        )
        logger.info(f"[DISPATCH NOTIFICATION] To Mobile: {mobile} | WhatsApp Message:\n{wa_message}")
        if email:
            logger.info(f"[DISPATCH NOTIFICATION] To Email: {email} | Subject: Donation Receipt {receipt_number}")
        return True

notification_service = NotificationService()
