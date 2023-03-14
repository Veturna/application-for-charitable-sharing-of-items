from django.shortcuts import render
from django.views import View


class LandingPage(View):
    def get(self, request):
        return render(request, "index.html")

class AddDonation(View):
    def get(self, requst):
        return render(requst, "form.html")