from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from my_task.models import JegyzetelosFelhasznalo, Jegyzet

User = get_user_model()

@csrf_exempt
def registration_view(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        print(f'Received data: {first_name}, {email}, {password}') 
        
        try:
            username = email.split('@')[0]
            if len(username) < 4:
                return JsonResponse({'error': 'A felhasználónévnek (email cím előtte) legalább 4 karakterből kell állnia!'}, status=400)
            
          
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name
            )
            
            
            JegyzetelosFelhasznalo.objects.create(
                user=user,
                email=email,
                aktiv=True
            )
            
            print(f'User created: {user.username}') 
            
            
            login(request, user)
            return JsonResponse({'redirect': '/index.html'})
            
        except Exception as e:
            print(f'Error in registration: {str(e)}') 
            return JsonResponse({'error': f'Hiba történt: {str(e)}'}, status=400)
    
    return render(request, 'regisztracio.html')

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        print(f'Login attempt: {email}') 
        
        try:
            username = email.split('@')[0]
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                
                jegyzetelos_user = JegyzetelosFelhasznalo.objects.get(user=user)
                if jegyzetelos_user.aktiv:
                    login(request, user)
                    return JsonResponse({'redirect': '/index.html/'})
                else:
                    return JsonResponse({'error': 'Ez az email cím nem aktív!'}, status=400)
            else:
                return JsonResponse({'error': 'Hibás email vagy jelszó!'}, status=400)
        except JegyzetelosFelhasznalo.DoesNotExist:
            return JsonResponse({'error': 'Ez az email cím nem megengedett vagy nem aktív!'}, status=400)
        except Exception as e:
            print(f'Error in login: {str(e)}') 
            return JsonResponse({'error': f'Hiba történt: {str(e)}'}, status=400)
    
    return render(request, 'bejelentkezes.html')

@login_required
def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def index(request):
    jegyzetelos_user = JegyzetelosFelhasznalo.objects.get(user=request.user)
    jegyzetek = Jegyzet.objects.filter(felhasznalo=jegyzetelos_user).order_by('-datum')
    return render(request, 'index.html', {
        'jegyzetek': jegyzetek,
        'categories': ['Általános', 'Munka', 'Tanulás', 'Ötletek']
    })

