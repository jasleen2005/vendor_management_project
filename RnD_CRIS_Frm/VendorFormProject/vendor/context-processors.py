# from .models import SiteMessage

# def site_message(request):
#     msg = SiteMessage.objects.filter(active=True).order_by('-created_at').first()
#     return {'site_message': msg}

from vendor.models import SiteMessage

def site_message(request):
    # Always query database for latest active message
    message = SiteMessage.objects.filter(active=True).order_by('-id').first()
    return {'site_message': message}
