from django.db import models
from django.contrib.auth.models import User


TYPE = (
    (1, "fundacja"),
    (2, "organizacja pozarządowa"),
    (3, "zbiórka lokalna"),
)

class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)


class Institution(models.Model):
    name = models.CharField(max_length=64, unique=True)
    description = models.TextField()
    type = models.IntegerField(choices=TYPE, default=1)
    category = models.ManyToManyField(Category)


class Donation(models.Model):
    quantity = models.IntegerField()
    categories = models.ManyToManyField(Category)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    address = models.CharField(max_length=125)
    phone_number = models.IntegerField()
    city = models.CharField(max_length=64)
    zip_code = models.IntegerField()
    pick_up_date = models.DateField()
    pick_up_time = models.TimeField()
    pick_up_comment = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, default=None)

