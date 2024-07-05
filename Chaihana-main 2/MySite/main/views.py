from django.shortcuts import render, redirect, get_object_or_404 
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseBadRequest
from .models import Table,Menu,Order
from .forms import UserForm
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json
from django.utils import timezone

auth = True
menu = Menu.objects.all()
# Create your views here.
def Main (request):
    if not auth:
        return HttpResponseRedirect("/login")
    else:
        data={
            'menu':menu
        }
        return render(request, 'main/main.html', data)

def GetTables(request):
    tables = Table.objects.all().values_list("number")
    
    responseT = JsonResponse(list(tables),safe=False)
    return responseT

def AddTables(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        table_name = data.get('number')
        if table_name:
            new_table = Table(number=table_name)
            new_table.save()
            
            return JsonResponse({'id': new_table.id, 'number': new_table.number}, status=201)
        else:
            return JsonResponse({'error': 'Invalid data'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
def Logout(request):
    global auth
    auth=False
    return HttpResponseRedirect("/login")

def Login (request):
    form = UserForm()
    error = ''
    if request.method == "POST":
        # create a form instance and populate it with data from the request:
        form = UserForm(request.POST)
        # check whether it's valid:
        users = User.objects.filter(username=form.data.get("username"))
        passw = User.objects.filter(password = form.data.get("password"))
        if users.exists() == True and passw.exists():
            global auth
            auth = True 
            return HttpResponseRedirect("/")
        elif not users.exists() or not passw.exists():
            error = 'Неверный логин или пароль'            

    data = {
        'form':form,
        'error':error
    }
    return render(request, 'main/login.html', data)

def Reg(request):
    form = UserForm()
    error = ''
    if request.method == "POST":
        # create a form instance and populate it with data from the request:
        form = UserForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            form.save()
            return HttpResponseRedirect("/login")
        else:
            error = 'Пользователь с таким именем уже существет'            

    data = {
        'form':form,
        'error':error
    }

    return render(request,'main/registration.html',data)

def add_order(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        table_number = data.get('table_number')
        dish_id = data.get('dish_id')
        count = data.get('count')

        table = get_object_or_404(Table, number=table_number)
        dish = get_object_or_404(Menu, name=dish_id)
        price = dish.price * int(count)

        Order.objects.create(table=table, dish=dish, price=price, count=count, date=timezone.now())

        return JsonResponse({'status': 'Order added'})

def clear_orders(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        table_number = data.get('table_number')
        
        table = get_object_or_404(Table, number=table_number)
        if(Order.objects.filter(table=table).delete()):
            print("Удалено")
        else: print("Не удалено")
        
        return JsonResponse({'status': 'Orders cleared'})
    
def get_orders(request):
    if request.method == 'GET':
        table_number = request.GET.get('table_number')
        table = get_object_or_404(Table, number=table_number)
        orders = Order.objects.filter(table=table)

        order_list = []
        for order in orders:
            order_list.append({
                'dish_name': order.dish.name,
                'count': order.count,
                'price': order.price,
            })

        return JsonResponse({'orders': order_list})
    
def Kitchen(request):
    if not auth:
        return HttpResponseRedirect("/login")
    else:
        return render(request, 'main/kitchen.html')