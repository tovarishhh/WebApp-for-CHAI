from django.urls import path, include
from django.contrib import admin

from . import views
urlpatterns = [
    path('load_orders/',views.get_orders),
    path('add_order/', views.add_order),
    path('clear_orders/', views.clear_orders),
    path('admin/', admin.site.urls),
    path('', views.Main),
    path('login',views.Login),
    path('registr',views.Reg),
    path('tables',views.GetTables),
    path('logout',views.Logout),
    path('add',views.AddTables),
    path('kitchen', views.Kitchen)
]