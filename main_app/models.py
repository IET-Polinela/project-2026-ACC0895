from django.db import models

class Report(models.Model):
    CATEGORY_CHOICES = [
        ('Jalan',   'Jalan'),
        ('Sampah',  'Sampah'),
        ('Banjir',  'Banjir'),
        ('Lampu',   'Lampu'),
        ('Lainnya', 'Lainnya'),
    ]
    STATUS_CHOICES = [
        ('REPORTED',    'Dilaporkan'),
        ('VERIFIED',    'Diverifikasi'),
        ('IN_PROGRESS', 'Diproses'),
        ('RESOLVED',    'Selesai'),
    ]

    title       = models.CharField(max_length=200)
    category    = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    description = models.TextField()
    location    = models.CharField(max_length=200)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='REPORTED')
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title