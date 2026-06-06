from django.contrib import admin
from django.urls import path
from agromonitor.router import api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('farmintelytics-engine/agromonitoring/', api.urls),
]
