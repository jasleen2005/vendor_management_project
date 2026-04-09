# vendor/admin.py
from django.contrib import admin
from .models import Vendor, Zone, Division, Subscriber, State, NewUser

admin.site.register(Vendor)
admin.site.register(Zone)
admin.site.register(State)
admin.site.register(Division)
admin.site.register(Subscriber)
admin.site.register(NewUser)

class SiteMessageAdmin(admin.ModelAdmin):
    list_display = ('message', 'active', 'created_at')
    list_editable = ('active',)
