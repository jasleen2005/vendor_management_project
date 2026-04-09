# vendor/serializers.py
from rest_framework import serializers
from .models import Subscriber, Vendor, Zone, Division, State
from django.contrib.auth.models import User  
from .models import NewUser
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'role']   
        
class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ['code', 'name']

class DivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        fields = ['code', 'name', 'zone']

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['code', 'name']

class VendorSerializer(serializers.ModelSerializer):
    zone = serializers.PrimaryKeyRelatedField(queryset=Zone.objects.all())
    division = serializers.PrimaryKeyRelatedField(queryset=Division.objects.all())

    class Meta:
        model = Vendor
        fields = '__all__'
        extra_kwargs = {
            'pdf_file': {'write_only': True}

        }

class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = '__all__'

##
class NewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}  
        }
        
    
    def create(self, validated_data):
        # Use the password sent in request directly
        password = validated_data.get('password')
        if not password:
            raise serializers.ValidationError({"password": "Password is required."})
        user = NewUser.objects.create(**validated_data)
        return user

     

