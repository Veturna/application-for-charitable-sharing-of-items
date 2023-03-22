from rest_framework import serializers
from .models import Institution, Category, Donation

class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = '__all__'

