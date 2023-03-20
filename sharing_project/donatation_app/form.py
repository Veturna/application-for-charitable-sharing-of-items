from django import forms


class ProfileForm(forms.Form):
    name = forms.CharField(label='Imię', max_length=64)
    surname = forms.CharField(label='Nazwisko', max_length=64)
    email = forms.EmailField(label='Email', max_length=64)
