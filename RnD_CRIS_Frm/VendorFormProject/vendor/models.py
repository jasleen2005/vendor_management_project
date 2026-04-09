# vendor/models.py
from django.db import models
from django.contrib.postgres.fields import ArrayField
# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin 
# from django.dispatch import receiver
# from django.db.models.signals import post_save 
from django.db import models


class Zone(models.Model):
    code = models.CharField(max_length=3, primary_key=True)
    # zone_id = models.CharField(max_length=2, primary_key=True)
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class Division(models.Model):
    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)
    zone = models.ForeignKey(Zone, related_name='divisions', on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
class State(models.Model) : 
    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Vendor(models.Model):
    vendor_name = models.CharField(max_length=100)
    vendor_address_line1 = models.CharField(max_length=200)
    vendor_address_line2 = models.CharField(max_length=200, blank=True)
    vendor_address_state = models.CharField(max_length=200, blank=True)
    vendor_address_pincode = models.CharField(max_length=200)
    vendor_location = models.CharField(max_length=100)
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, null=True, blank=True)
    division = models.ForeignKey(Division, on_delete=models.CASCADE, null=True, blank=True)
    vendor_mobile = models.CharField(max_length=15)
    vendor_email = models.EmailField()
    nodal_person_name = models.CharField(max_length=100)
    nodal_person_contact = models.CharField(max_length=15)
    nodal_person_email = models.EmailField()
    # location_codes = models.CharField(max_length=255, blank=True, null=True) 
    # location_codes = models.CharField(max_length=200) 
    vendor_status = models.CharField(max_length=10, default='new')
    attachment = models.FileField(upload_to='attachments/')
    attachment_url = models.CharField(max_length=255)
    
    
    vendor_code = ''
    
    
    def __str__(self):
        return self.vendor_name

    def save(self, *args, **kwargs):
        if (self.vendor_code == ''):
            vendor_name_part = self.vendor_name[:8].upper()
            vendor_location_part = self.vendor_location[:4].upper()
            self.vendor_code = f'{vendor_name_part}_{vendor_location_part}'
        super().save(*args, **kwargs)


class Subscriber(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    subscriber_id = models.CharField(max_length=50)
    display_device = ArrayField(
        models.CharField(max_length=50),
        default= list
    )
    services_required = ArrayField(
        models.CharField(max_length=50),
        default= list
    )
    url = models.URLField(max_length=255)

    def __str__(self):
        return f'{self.subscriber_id}'
    

class SiteMessage(models.Model):
    message = models.TextField()
    active = models.BooleanField(default=True)  # Controls if shown or hidden
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message ({'Active' if self.active else 'Inactive'})"


class NewUser(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=50)
    password = models.CharField(max_length=255)
    status = models.CharField(
        max_length=10,
        choices=[("Pending","Pending"), ("Approved", "Approved"), ("Rejected", "Rejected")],
        default="Pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.role})"
    
