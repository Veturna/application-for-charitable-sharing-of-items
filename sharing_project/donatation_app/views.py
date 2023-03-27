from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.urls import reverse


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

    def post(self, request):
        if request.user.is_authenticated:
            address = request.POST.get('address')
            city = request.POST.get('city')
            postcode = request.POST.get('postcode')
            phone = request.POST.get('phone')
            data = request.POST.get('data')
            time = request.POST.get('time')
            more_info = request.POST.get('more_info')
            quantity = request.POST.get('bags')
            categories = request.POST.get('categories')
            organization = request.POST.get('organization-name')
            user = request.user

            institution = Institution.objects.get(name=organization)

            donation = Donation.objects.create(quantity=quantity, address = address, phone_number=phone,
                                               city=city, zip_code=postcode, pick_up_date = data, pick_up_time=time,
                                               pick_up_comment=more_info, user=user)
            donation.save()

            for category in categories:
                category = Category.objects.get(name=category)
                donation.categories.add(category)

            url = reverse('confirm')
            return redirect(url)
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
        donations = Donation.objects.filter(user=user)

        return render(request, 'profile.html', {'user': user, 'form': form, 'donations':donations})


class AddDonationConfirmation(View):
    def get(self, request):
        return render(request, 'form-confirmation.html')

class InstitutionView(generics.ListCreateAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
