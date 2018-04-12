from __future__ import unicode_literals

from django.db import models
from datetime import datetime

# Create your models here.
class Blog(models.Model):
    title = models.CharField(max_length=100)
    ts = models.DateTimeField(default=datetime.now)
    text = models.TextField()


    def __unicode__(self):
        return self.title
