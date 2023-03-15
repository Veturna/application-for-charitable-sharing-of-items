from django.shortcuts import render, get_object_or_404
from django.views import View
from django.db.models import Sum

from donatation_app.models import Donation, Institution


class LandingPage(View):
    def get(self, request):
        donation = Donation.objects.all()
        #total_donations = donation.aggregate(Sum('quantity'))['quantity__sum'] or 0
        total_donations = 0
        for d in donation:
            if d.quantity == 0:
                total_donations = 0
            total_donations += d.quantity

        #supported_institutions = donation.distinct('institution').count()
        supported_institutions = len([d.institution for d in donation])

        foundations = Institution.objects.filter(type=1)
        ngos = Institution.objects.filter(type=2)
        locals = Institution.objects.filter(type=3)





        return render(request, "index.html", {"total_donations": total_donations,
                                              "supported_institutions": supported_institutions,
                                              "foundations": foundations, "ngos": ngos, "locals": locals }
                      )


class AddDonation(View):
    def get(self, request):
        return render(request, "form.html")


class Login(View):
    def get(self, request):
        return render(request, "login.html")


class Register(View):
    def get(self, request):
        return render(request, "register.html")
