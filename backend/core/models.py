from django.db import models
from typing import (
    Optional,
    Dict
)
from datetime import datetime
# Create your models here.

class LocationChoices(models.TextChoices):
        AZ="AZ"
        IL="IL"
        TX="TX"
        EMPTY=""

class Skill(models.Model):
    title:str=models.CharField(max_length=255)
    description:Optional[str]=models.TextField(blank=True,null=True)

class Vendor(models.Model):
    name:str=models.CharField(max_length=255)
    description:Optional[str]=models.TextField(blank=True,null=True)
    
class Resource(models.Model):
    class GenderChoices(models.TextChoices):
        Male="M"
        Female="F"
        Other="O"

    class RoleChoices(models.TextChoices):
        PM="PM"
        UX="UX"
        Engr="Engr"

    class RoleLevelChoices(models.TextChoices):
        Senior="S"
        Mid="M"
        Junior="J"

    skills=models.ManyToManyField(Skill,related_name="resources")
    vendor=models.ForeignKey(Vendor,related_name="resources",on_delete=models.CASCADE,null=True)
    start_date:datetime.date=models.DateField()
    current_end_date:datetime.date=models.DateField()
    location=models.CharField(max_length=100,choices=LocationChoices.choices,default="")
    is_color=models.BooleanField(blank=True,null=True)
    gender=models.CharField(choices=GenderChoices.choices,max_length=200)
    role=models.CharField(choices=RoleChoices.choices,max_length=200)
    role_level:Optional[str]=models.CharField(choices=RoleLevelChoices.choices,blank=True,null=True,max_length=200)
    is_employee:bool=models.BooleanField(default=True)

    def save(self,*args,**kwargs):
        if not self.id:
            self.current_end_date=self.start_date
            if self.vendor is not None:
                self.is_employee=False
        return super(Resource,self).save(*args,**kwargs)



def get_default_requirements():
    return {
        "S":0,
        "M":0,
        "J":0
    }

def get_default_positions():
    return {
        "devsecops":0,
        "security_maven":0,
        "interviewer":0,
        "work_intake_scoping":0,
        "anchor":0,
        "accesibility":0,
        "education_training":0
    }

class Product(models.Model):
    product_title:str=models.CharField(max_length=255)
    product_description:Optional[str]=models.TextField(blank=True,null=True)
    start_date:datetime.date = models.DateField(blank=False)
    end_date:Optional[datetime.date]=models.DateField(blank=True,null=True)
    location=models.CharField(max_length=100,choices=LocationChoices.choices,default="")
    resources=models.ManyToManyField(Resource,related_name="products",through="core.ProductResourceInfo")
    requirements=models.JSONField(default=get_default_requirements)

class ProductResourceInfo(models.Model):
    product=models.ForeignKey(Product,related_name="resources_through",on_delete=models.CASCADE)
    resource=models.ForeignKey(Resource,related_name="products_through",on_delete=models.CASCADE)
    start_date:datetime.date=models.DateField(auto_now=True)
    end_date:datetime.date=models.DateField(null=True)
    positions=models.JSONField(default=get_default_positions)
    is_employee:bool=models.BooleanField(default=True)

    def save(self,*args,**kwargs):
        if not self.id:
            if self.resource.vendor is not None:
                self.is_employee=False
        return super(ProductResourceInfo,self).save(*args,**kwargs)