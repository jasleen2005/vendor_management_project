# views.py
from django.http import JsonResponse
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
# from .email_utils import send_email
import json
from VendorFormProject.email_utils import send_email


# from vendor.models import SiteMessage 

@csrf_exempt  # For simplicity, you may want to add proper CSRF protection later
@require_POST
def send_email_view(request): 
    try:
        # Parse the request body (JSON format)
        data = json.loads(request.body)
        subject = data['subject']
        message = data['message']
        recipient_email = data['recipient_email']
        
        # Send the email
        send_email(subject, message, recipient_email)
        
        return JsonResponse({'status': 'success', 'message': 'Email sent successfully.'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})


# def get_active_message(request):
#     message = SiteMessage.objects.filter(active=True).first()
#     if message:
#         return JsonResponse({"message": message.message})
#     return JsonResponse({"message": ""})

