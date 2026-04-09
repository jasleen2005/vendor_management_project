# vendor/views.py
import logging
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import NewUser
from django.contrib.auth import login ,authenticate
# from .auth_backends import custom_authenticate
from django.contrib.auth.hashers import check_password

from .models import Subscriber, Vendor, Zone, Division, State, SiteMessage
from .serializers import (
    SubscriberSerializer,
    VendorSerializer,
    ZoneSerializer,
    DivisionSerializer,
    StateSerializer,
    NewUserSerializer,
    # UserSerializer 
)

logger = logging.getLogger(__name__)


from django.core import signing

TOKEN_SALT = "newuser-auth"
TOKEN_MAX_AGE = 60 * 60 * 8  # 8 hours

# -------------------- BROADCAST MESSAGE VIEWS --------------------

@api_view(['GET', 'POST', 'DELETE'])
def active_message(request):
    """
    GET    -> Returns the currently active broadcast message
    POST   -> Sets a new active broadcast message (admin only)
    DELETE -> Stops the broadcast
    """
    if request.method == 'GET':
        msg = SiteMessage.objects.filter(active=True).order_by('-created_at').first()
        return Response({"message": msg.message if msg else ""})

    elif request.method == 'POST':
        message_text = request.data.get('message', '').strip()
        if not message_text:
            return Response({"error": "Message text required."}, status=status.HTTP_400_BAD_REQUEST)

        # deactivate old messages
        SiteMessage.objects.filter(active=True).update(active=False)
        # create new message
        SiteMessage.objects.create(message=message_text, active=True)
        logger.info(f"New broadcast message started: {message_text}")
        return Response({"message": "Broadcast started successfully."})

    elif request.method == 'DELETE':
        SiteMessage.objects.filter(active=True).update(active=False)
        logger.info("Broadcast message stopped.")
        return Response({"message": "Broadcast stopped successfully."})


# -------------------- EXISTING VIEWS --------------------

@api_view(['POST'])
def create_vendor(request):
    serializer = VendorSerializer(data=request.data)
    if serializer.is_valid():
        vendor = serializer.save()
        send_mail(
            'Vendor Form Submission Alert',
            f"Vendor Form Submitted Successfully \n Subscriber {vendor.vendor_name} needs to be configured in the API Gateway",
            'noobdagamerog@gmail.com',
            [vendor.nodal_person_email],
            fail_silently=False,
        )
        return Response({'id': vendor.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['POST']) 
def create_user(request):
    data = request.data.copy()
   # Only assign default password if missing completely
    if 'password' not in data:
        data['password'] = 'defaultPassword123'
        
    serializer = NewUserSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "status": "success",
            "user": {"id": user.id, "name": user.name, "role": user.role}
        }, status=201)
    return Response(serializer.errors, status=400)


class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    def create_id(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        vendor = Vendor.objects.get(id=response.data['id'])
        subscriber_code = vendor.vendor_code
        return Response({'vendor': response.data, 'subscriber_code': subscriber_code})


class ZoneViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer


class StateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = State.objects.all()
    serializer_class = StateSerializer


class SubscriberViewSet(viewsets.ModelViewSet):
    queryset = Subscriber.objects.all()
    serializer_class = SubscriberSerializer

    def create(self, request, *args, **kwargs):
        try:
            logger.debug(f"Request data: {request.data}")
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            subscriber = serializer.save()

            # Get nodal email from vendor
            vendor = subscriber.vendor
            nodal_email = vendor.nodal_person_email

            # Send email
            subject = f"New Subscriber Created - {subscriber.subscriber_id}"
            message = f"""
Dear {vendor.nodal_person_name},

A new subscriber has been created for Vendor: {vendor.vendor_name}.

Subscriber ID: {subscriber.subscriber_id}
Services Required: {', '.join(subscriber.services_required)}
Display Devices: {', '.join(subscriber.display_device)}
URL: {subscriber.url}

Regards,
VendorFormProject System
"""
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [nodal_email],
                fail_silently=False,
            )

            logger.info(f"Email sent to nodal officer: {nodal_email}")

            # Return subscriber + nodal info to frontend
            return Response(
                {
                    "success": True,
                    "subscriber_id": subscriber.subscriber_id,
                    "nodal_email": nodal_email,
                    "subscriber": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            logger.error(f'Error during subscriber creation: {e}')
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        

class DivisionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer


def vendor_list(request):
    vendors = Vendor.objects.all()
    subscribers = Subscriber.objects.all()
    return render(request, 'vendor/vendor_list.html', {'vendors': vendors, 'subscribers': subscribers})

def vendor_list(request):
    vendors = Vendor.objects.all()
    subscribers = Subscriber.objects.all()
    zones = Zone.objects.all()
    divisions = Division.objects.all()
    states = State.objects.all()
    
    return render(request, 'vendor/vendor_list.html', {
        'vendors': vendors,
        'subscribers': subscribers,
        'zones': zones,
        'divisions': divisions,
        'states': states
    })

def home(request):
    return HttpResponse("Welcome to the CRIS Vendor Management System!")


def send_email(subject, message, recipient_email):
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [recipient_email],
        fail_silently=False,
    )


@csrf_exempt
def send_email_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            subject = data.get('subject', '')
            message = data.get('message', '')
            recipient_email = data.get('recipientEmail', '')

            send_email(subject, message, recipient_email)
            return JsonResponse({'status': 'success', 'message': 'Email sent successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})


@api_view(['POST'])
def send_email_api(request):
    subject = request.data.get('subject', '')
    message = request.data.get('message', '')
    recipient = request.data.get('recipientEmail', '')

    if subject and message and recipient:
        try:
            send_mail(subject, message, 'crismailserver@gmail.com', [recipient])
            return Response({"message": "Email sent successfully!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def new_user_details(request):
    if request.method == "GET":
        users = NewUser.objects.all()
        serializer = NewUserSerializer(users, many=True)
        return JsonResponse({"status": "success", "users": serializer.data}, safe=False)


@api_view(['GET'])
def list_users(request):
    users = NewUser.objects.all()
    serializer = NewUserSerializer(users, many=True)
    return Response({
        "status": "success",
        "users": serializer.data
    })
    


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    print(f"Username: {username}, Password: {password}")

    user = custom_authenticate(username=username, password=password)
    print(f"Authenticated user: {user}")
    
    if user:
        if hasattr(user, "status") and user.status in ["Approved"]:
            token = make_token(user)  #
            return Response({
                "status": "success",
                "username": user.name,
                "role": getattr(user, 'role', 'user'),
                
                 "user": {                             #   
                "username": user.name,
                "role": getattr(user, 'role', 'user'),
                "status": getattr(user, 'status', 'Pending'),
            },
            "token": token  # 
            })  
        else:
            # User exists but is rejected
            return Response({
                "status": "failed",
                "message": "User is rejected"
            }, status=401)
    else:
        return Response({
            "status": "failed",
            "message": "Invalid username or password"
        }, status=401)
        
    # if user:
    #     return Response({
    #         "status": "success",
    #         "username": user.name,
    #         "role": getattr(user, 'role', 'user')
    #     })
    # else:
    #     return Response({
    #         "status": "failed",
    #         "message": "Invalid username or password"
    #     }, status=401)
  
def custom_authenticate(username=None, password=None):
    if not username or not password:
        return None
    
    try:
        user = NewUser.objects.get(name=username, password=password)
        return user
    except NewUser.DoesNotExist:
        return None                                                                                                  

# ------------------- To reject or approve user -------------------
@api_view(['POST'])
def approve_user(request, user_id):
    user = NewUser.objects.get(id=user_id)
    user.status = "Approved"
    user.save()
    return Response({"message": "User approved"})

@api_view(['POST'])
def reject_user(request, user_id):
    user = NewUser.objects.get(id=user_id)
    user.status = "Rejected"
    user.save()
    return Response({"message": "User rejected"})


# ------------------- Current user -------------------
@api_view(['GET'])
def current_user(request):
    # Expect: Authorization: Bearer <token>
    auth = request.headers.get("Authorization", "")
    prefix = "Bearer "
    if auth.startswith(prefix):
        token = auth[len(prefix):].strip()
        data = verify_token(token)
        if data:
            # Optionally re-fetch from DB to get fresh role/status
            try:
                user = NewUser.objects.get(id=data.get("id"))
            except NewUser.DoesNotExist:
                return Response({"detail": "Not authenticated"}, status=401)

            return Response({
                "id": user.id,
                "username": getattr(user, "name", data.get("username")),
                "role": getattr(user, "role", data.get("role", "user")),
                "status": getattr(user, "status", data.get("status", "Pending")),
            })

    return Response({"detail": "Not authenticated"}, status=401)


def make_token(user):
    # store minimal info; you can add more if you like
    payload = {
        "username": getattr(user, "name", ""),  
        "role": getattr(user, "role", "user"),
        "status": getattr(user, "status", "Pending"),
        "id": user.id,
    }
    return signing.dumps(payload, salt=TOKEN_SALT)

def verify_token(token: str):
    try:
        data = signing.loads(token, salt=TOKEN_SALT, max_age=TOKEN_MAX_AGE)
        return data  
    except signing.SignatureExpired:
        return None
    except signing.BadSignature:
        return None



# below code is to store password into hash in DB  
# # ------------------- Custom authenticate -------------------
# def custom_authenticate(name=None, password=None):
#     if not name or not password:
#         return None
#     try:
#         user = NewUser.objects.get(name=name)
#     except NewUser.DoesNotExist:
#         return None

#     if check_password(password, user.password):
#         return user
#     return None


# # ------------------- Login API -------------------

# def _parse_json_request(request):
#     """Safe JSON parser: works even if DRF parser fails."""
#     data = request.data if hasattr(request, "data") and request.data else None
#     if data:
#         return data
#     try:
#         raw = request.body.decode("utf-8") if request.body else ""
#         return json.loads(raw) if raw else {}
#     except Exception:
#         return {}
    
    
# @csrf_exempt
# @api_view(['POST'])
# @permission_classes([AllowAny])
# def login_user(request):
#     """
#     Login user.
#     Payload: { "name": "...", "password": "..." }
#     """
#     data = _parse_json_request(request)
    
#     print("Login data received:", data)

#     name = data.get('name') or data.get('username')    
#     password = data.get('password')

#     logger.info("Login attempt with keys: %s", list(data.keys()))

#     if not name or not password:
#         return Response(
#             {"status": "failed", "message": "Name and password required"},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     user = custom_authenticate(name=name, password=password)  # pass name, not username
#     if not user:
#         return Response(
#             {"status": "failed", "message": "Invalid name or password"},
#             status=status.HTTP_401_UNAUTHORIZED
#         )

#     return Response(
#         {"status": "success", "name": user.name, "role": user.role},
#         status=status.HTTP_200_OK
#     )

