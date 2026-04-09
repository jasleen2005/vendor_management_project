from django.core.mail import send_mail
from django.conf import settings

def send_email(subject, message, recipient_email):
    send_mail(
        subject,  # Email subject
        message,  # Email body
        settings.DEFAULT_FROM_EMAIL,  # Sender's email
        [recipient_email],  # Recipient's email
        fail_silently=False,  # Throw error if sending fails
    )
