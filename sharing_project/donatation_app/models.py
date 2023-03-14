from django.db import models
from django.contrib.auth.models import User


TYPE = (
    (1, "fundacja"),
    (2, "organizacja pozarządowa"),
    (3, "zbiórka lokalna"),
    (4, "fundacja")
)

class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)

class Institution(models.Model):
    name = models.CharField(max_length=64, unique=True)
    description = models.TextField()
    type = models.IntegerField(choices=TYPE, default=4)
    category = models.ManyToManyField(Category)