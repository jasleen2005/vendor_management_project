# # vendor/signals.py
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.core.mail import send_mail
# from django.conf import settings

# from .models import Subscriber

# @receiver(post_save, sender=Subscriber)
# def send_email_to_nodal(sender, instance, created, **kwargs):
#     if created:
#         nodal_email = instance.vendor.nodal_person_email
#         vendor_name = instance.vendor.vendor_name

#         subject = f"New Subscriber Created - {instance.subscriber_id}"
#         message = f"""
# Dear {instance.vendor.nodal_person_name},

# A new subscriber has been created for Vendor: {vendor_name}.

# Subscriber ID: {instance.subscriber_id}
# Services Required: {', '.join(instance.services_required)}
# Display Devices: {', '.join(instance.display_device)}
# URL: {instance.url}

# Regards,
# VendorFormProject System
# """

#         send_mail(
#             subject,
#             message,
#             settings.DEFAULT_FROM_EMAIL,
#             [nodal_email],
#             fail_silently=False,
#         )
## apps.py
# from django.apps import AppConfig

# class VendorConfig(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'vendor'

#     def ready(self):
#         import vendor.signals
