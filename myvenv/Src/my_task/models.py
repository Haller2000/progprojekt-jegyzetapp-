from django.db import models
from django.contrib.auth.models import User

class JegyzetelosFelhasznalo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    aktiv = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Jegyzetelő felhasználó'
        verbose_name_plural = 'Jegyzetelő felhasználók'

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

class Jegyzet(models.Model):
    felhasznalo = models.ForeignKey(JegyzetelosFelhasznalo, on_delete=models.CASCADE)
    cim = models.CharField('Cím', max_length=200)
    tartalom = models.TextField('Tartalom')
    kategoria = models.CharField('Kategória', max_length=50)
    datum = models.DateTimeField('Létrehozás dátuma', auto_now_add=True)

    class Meta:
        verbose_name = 'Jegyzet'
        verbose_name_plural = 'Jegyzetek'
        ordering = ['-datum']

    def __str__(self):
        return f'{self.cim} - {self.felhasznalo}'
