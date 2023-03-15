from django.shortcuts import render, get_object_or_404
from django.views import View

from donatation_app.models import Donation, Institution


class LandingPage(View):
    def get(self, request):
        donation = Donation.objects.all()
        return render(request, "index.html", {"donation": donation})


class AddDonation(View):
    def get(self, request):
        return render(request, "form.html")


class Login(View):
    def get(self, request):
        return render(request, "login.html")


class Register(View):
    def get(self, request):
        return render(request, "register.html")
