from django.forms import ModelForm, TextInput
from django.contrib.auth.models import User



class UserForm(ModelForm):
    class Meta:
        model = User
        fields = ['username','password']

        widgets = {
            "username": TextInput(attrs={
                'type': "login",
                'palceholder':"Логин"
            }),
            "password": TextInput(attrs={
                'type': 'password',
                'palceholder':'Пароль'
            })
        }