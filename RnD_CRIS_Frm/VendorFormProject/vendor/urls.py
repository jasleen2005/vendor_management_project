# vendor/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, ZoneViewSet, DivisionViewSet, SubscriberViewSet, StateViewSet, approve_user, reject_user
from . import views
# from .views import create_subscriber

router = DefaultRouter()
router.register(r'vendor', VendorViewSet)
router.register(r'zone', ZoneViewSet)
router.register(r'division', DivisionViewSet)
router.register(r'subscribers', SubscriberViewSet)
router.register(r'state', StateViewSet)

from .views import home

urlpatterns = [
    path('', home, name='home'),
    path('vendors/', views.vendor_list, name='vendor_list'),
    path('api/', include(router.urls)),
    # path('create/', views.create_user, name='create_user'),
    #  path('send-email/', views.send_email_view, name='send_email'),
    path('api/active-message/', views.active_message, name='active_message'),
    path('create-user/', views.create_user, name='create-user'),
    path('new-user-details/', views.list_users, name='new-user-details'),
    path('api/login/', views.login_user, name='login_user'),
    path("api/users/<int:user_id>/approve/", views.approve_user, name='approve_user'),
    path("api/users/<int:user_id>/reject/", views.reject_user, name='reject_user'),
    path('api/current_user/', views.current_user, name='current_user'),
]
