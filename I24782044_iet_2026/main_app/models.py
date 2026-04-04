from django.db import models

class EmailLogin(models.Model):
    email = models.EmailField()
    waktu = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class Pesan(models.Model):
    KATEGORI_CHOICES = [
        ('Saran', 'Saran'),
        ('Keluhan', 'Keluhan'),
        ('Kendala', 'Kendala'),
    ]
    email = models.EmailField(blank=True)
    kategori = models.CharField(max_length=20, choices=KATEGORI_CHOICES)
    isi = models.TextField()
    waktu = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.kategori} - {self.email}"