from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.db.models import Sum
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.core.paginator import Paginator

from rest_framework import generics

from .serializers import InstitutionSerializer
from .models import Donation, Institution, Category
from .form import ProfileForm


class LandingPage(View):
    def get(self, request):
        donation = Donation.objects.all()

        total_donations = 0
        for d in donation:
            if d.quantity == 0:
                total_donations = 0
            total_donations += d.quantity

        supported_institutions = len([d.institution for d in donation])

        foundations = Institution.objects.filter(type=1)
        ngos = Institution.objects.filter(type=2)
        locals = Institution.objects.filter(type=3)

        #p_foundations = Paginator(foundations, 5)

        return render(request, "index.html", {"total_donations": total_donations,
                                              "supported_institutions": supported_institutions,
                                              "foundations": foundations, "ngos": ngos, "locals": locals
                                              }
                      )


class AddDonation(View):
    def get(self, request):
        if request.user.is_authenticated:
            category = Category.objects.all()
            institutions = Institution.objects.all()
            return render(request, "form.html", {"user": request.user, "category": category, 'institutions': institutions})
        else:
            return render(request, "form.html")


class Login(View):
    def get(self, request):
        return render(request, "login.html")

    def post(self, request):
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)

            url = reverse('landing-page')
            return redirect(url)

        url = reverse('register')
        return redirect(url)


class Register(View):
    def get(self, request):
        return render(request, "register.html")

    def post(self, request):
        name = request.POST.get('name')
        surname = request.POST.get('surname')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        if password2 == password:
                user = User.objects.create_user(first_name = name, last_name = surname, username = email, password = password)
                user.save()

                url = reverse('login')
                return redirect(url)

        return render(request, 'register.html')

class Profile(View):
    def get(self, request):
        user = request.user
        form = ProfileForm(initial = {
            'name': user.first_name,
            'surname': user.last_name,
            'email': user.username
        })

        return render(request, 'profile.html', {'user': user, 'form': form})


class InstitutionView(generics.ListCreateAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer

