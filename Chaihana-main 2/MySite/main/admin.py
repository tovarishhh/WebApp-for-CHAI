from django.contrib import admin
from .models import Table,Menu,Order

# Register your models here.
admin.site.register(Table)
admin.site.register(Order)
admin.site.register(Menu)