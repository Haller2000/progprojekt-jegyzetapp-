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

@login_required
def jegyzet_mentes(request):
    if request.method == 'POST':
        try:
            cim = request.POST.get('cim')
            tartalom = request.POST.get('tartalom')
            kategoria = request.POST.get('kategoria')
            
            # Mezők ellenőrzése
            if not all([cim, tartalom, kategoria]):
                return JsonResponse({
                    'status': 'error',
                    'message': 'Kérlek töltse ki minden mezőt!'
                }, status=400)

            if len(cim) > 200:
                return JsonResponse({
                    'status': 'error',
                    'message': 'A cím maximum 200 karakter lehet!'
                }, status=400)

            if len(kategoria) > 50:
                return JsonResponse({
                    'status': 'error',
                    'message': 'A kategória maximum 50 karakter lehet!'
                }, status=400)

            jegyzetelos_user = JegyzetelosFelhasznalo.objects.get(user=request.user)
            
            jegyzet = Jegyzet.objects.create(
                felhasznalo=jegyzetelos_user,
                cim=cim,
                tartalom=tartalom,
                kategoria=kategoria
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'A jegyzet sikeresen elmentve!',
                'jegyzet': {
                    'id': jegyzet.id,
                    'cim': jegyzet.cim,
                    'tartalom': jegyzet.tartalom,
                    'kategoria': jegyzet.kategoria,
                    'datum': jegyzet.datum.strftime('%Y-%m-%d %H:%M:%S')
                }
            })
        except JegyzetelosFelhasznalo.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'A jegyzetelő felhasználó nem található!'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Hiba a jegyzet mentése közben: {str(e)}'
            }, status=400)
    return JsonResponse({
        'status': 'error',
        'message': 'Csak POST kérések támogatottak!'
    }, status=400)

@login_required
def jegyzet_torles(request):
    if request.method == 'POST':
        try:
            jegyzet_id = request.POST.get('jegyzet_id')
            jegyzet = Jegyzet.objects.get(id=jegyzet_id, felhasznalo__user=request.user)
            jegyzet.delete()
            return JsonResponse({
                'status': 'success',
                'message': 'A jegyzet sikeresen törölve!'
            })
        except Jegyzet.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'A jegyzet nem található vagy nem engedélyezett!'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'Hiba a jegyzet törlése közben: {str(e)}'
            }, status=400)
    return JsonResponse({
        'status': 'error',
        'message': 'Csak POST kérések támogatottak!'
    }, status=400)
