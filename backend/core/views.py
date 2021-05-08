from django.shortcuts import render
from .models import Resource
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .serializers import *
from django.http import Http404
from rest_framework.renderers import JSONRenderer
from datetime import datetime
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
import pandas as pd
from datetime import datetime
from django.conf import settings
import os
from django.http import HttpResponse
# Create your views here.

class DiversityView(APIView):
    renderer_classes=(JSONRenderer,)
    def get(self,request,*args,**kwargs):
        data={
            "gender":{
                    "male":{
                    "colored":Resource.objects.filter(is_color=True,gender="M").count(),
                    "not_colored":Resource.objects.filter(is_color=False,gender="M").count(),
                },
                "female":{
                    "colored":Resource.objects.filter(is_color=True,gender="F").count(),
                    "not_colored":Resource.objects.filter(is_color=False,gender="F").count()
                },
                "other":{
                    "colored":Resource.objects.filter(is_color=True,gender="O").count(),
                    "not_colored":Resource.objects.filter(is_color=False,gender="O").count()
                },
            },
            "total":{
                "colored":Resource.objects.filter(is_color=True).count(),
                "not_colored":Resource.objects.filter(is_color=False).count(),
                "male":Resource.objects.filter(gender="M").count(),
                "female":Resource.objects.filter(gender="F").count()
            }
            
        }

        return Response(data,status=status.HTTP_200_OK)

class ProductResourcesView(generics.GenericAPIView):
    serializer_class=ProductResourceInfoSerializer
    renderer_classes=(JSONRenderer,)
    
    def get_object(self):
        return get_object_or_404(Product,pk=int(self.kwargs["product_id"]))
    
    def get_data(self,role):
        return self.object.resources_through.filter(resource__role=role)
    
    def get(self,request,*args,**kwargs):
        data={
            "pms":self.serializer_class(self.get_data("PM"),many=True,context=self.get_serializer_context(**kwargs)).data,
            "uxs":self.serializer_class(self.get_data("UX"),many=True,context=self.get_serializer_context(**kwargs)).data,
            "Engr":self.serializer_class(self.get_data("Engr"),many=True,context=self.get_serializer_context(**kwargs)).data
        }
        return Response(data,status=status.HTTP_200_OK)


class LocationResourcesView(generics.GenericAPIView):
    serializer_class=ResourceSerializer
    renderer_classes=(JSONRenderer,)
    
    def get_data(self,baseresources,role):

        return baseresources.filter(role=role,location=location)    

    def get(self,request,*args,**kwargs):
        location=self.request.query_params("location")
        if location is not None:
            base_resources = Resource.objects.filter(location=location)
            data={
                "pms":self.serializer_class(self.get_data(base_resources,"PM"),many=True,context=self.get_serializer_context(**kwargs)).data,
                "uxs":self.serializer_class(self.get_data(base_resources,"UX"),many=True,context=self.get_serializer_context(**kwargs)).data,
                "Engr":self.serializer_class(self.get_data(base_resources,"Engr"),many=True,context=self.get_serializer_context(**kwargs)).data
            }
            return Response(data,status=status.HTTP_200_OK)
        else :
            return Response("Invalid data",status=status.HTTP_400_BAD_REQUEST)



class GetProductResourcePositionsView(generics.GenericAPIView):
    serializer_class=ProductResourceInfoSerializer
    renderer_classes=(JSONRenderer,)
    
    def get_object(self):
        return get_object_or_404(Product,pk=int(self.kwargs["product_id"]))
    
    def get_product_resources(self):
        return self.object.resources_through.all()
    
    def get(self,request,*args,**kwargs):
        resources=self.get_product_resources()
        data={}
        for k,v in request.query_params:
            if k in ["PM","UX","Engr"]:
                data[k]=self.serializer_class(resources.filter(resource__role=k),many=True,context=self.get_context_data(**kwargs)).data
            else :
                check={}
                check[k]=1
                data[k]==self.serializer_class(resources.filter(positions__contains=check),many=True,context=self.get_context_data(**kwargs)).data

        return Response(data,status=status.HTTP_200_OK)



class ResourceRatio(APIView):
    renderer_classes=(JSONRenderer,)
    def get(self,request,*args,**kwargs):
        data={
            "pms": Resource.objects.filter(role="PM").count(),
            "uxs": Resource.objects.filter(role="UX").count(),
            "Engr": Resource.objects.filter(role="Engr").count()
        }
        return Response(data,status=status.HTTP_200_OK)


class EngineersRatio(APIView):
    renderer_classes=(JSONRenderer,)
    def get(self,request,*args,**kwargs):
        data={
            "senior": Resource.objects.filter(role_level="S").count(),
            "mid": Resource.objects.filter(role_level="M").count(),
            "junior": Resource.objects.filter(role_level="J").count()
        }
        return Response(data,status=status.HTTP_200_OK)


class ActiveProducts(generics.ListAPIView):
    renderer_classes=(JSONRenderer,)
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        products = Product.objects.filter(start_date__lte=datetime.now().date(),end_date__gte=datetime.now().date())
        return products
    
        

class ContractorResources(generics.ListAPIView):
    renderer_classes=(JSONRenderer,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['vendor', 'location']

    def get_queryset(self):
        return Resource.objects.exclude(vendor=None)


class DashboardData(APIView):
    renderer_classes=(JSONRenderer,)
    def get(self,request,*args,**kwargs):
        data["active_projects"]=Product.objects.filter(start_date__lte=datetime.now().date(),end_date__gte=datetime.now().date()).count()
        data["completed_project"]=Product.objects.filter(end_date__lt=datetime.now().date()).count()
        data["contractors"]=Vendor.objects.count()
        data["employees"]=Resource.objects.filter(vendor=None).count()

        return Response(data,status=status.HTTP_200_OK)


class ResourceSkills(generics.GenericAPIView):
    queryset=Resource.objects.all()
    serializer_class=ResourceSerializer
    

class NextRotationResources(generics.ListAPIView):
    serializer_class=ResourceSerializer
    renderer_classes=(JSONRenderer,)

    def get_queryset(self):
        return Resource.objects.all().order_by("-current_end_data")

def allocate_resources(product):
    is_vacancy={
        "S":False,
        "J":False,
        "M":False
    }

    if product.end_date is not None :
        for k,v in product.requirements:
            available_resouces=Resource.objects.filter(role_level=k).exclude(
                Q(products_through__start_date__range=[product.start_date,product.end_date])|
                Q(products_through__end_date__range=[product.start_date,product.end_date])
            ).exclude(
                products_through__end_date=None,
                products__end_date__range=[product.start_date,product.end_date]
            )

            can_take=min(product.requirements[k],avaialable_resources.count())
            diff=can_take-product.requirements[k]
            if diff<0 :
                is_vacancy[k]=True
            for i in range(can_take):
                product.resources.add(avaialable_resources[i])
                
                
    else :
        for k,v in product.requirements:
            available_resouces==Resource.objects.filter(role_level=k).exclude(
                products_through__end_date__gte=product.start_date
            ).exclude(
                products_through__end_date=None,
                products__end_date__range__gte=product.start_date
            )
            can_take=min(product.requirements[k],avaialable_resources.count())
            diff=can_take-product.requirements[k]
            if diff<0 :
                is_vacancy[k]=True
            for i in range(can_take):
                product.resources.add(avaialable_resources[i])
                
    product.save()


class AllocateResources(generics.CreateAPIView):
    serializer_class=ProductSerializer
    renderer_classes=(JSONRenderer,)

    def create(self,request,*args,**kwargs):
        serializer=self.serializer_class(request.data,context={"request":request})
        if serializer.is_valid():
            instance =serializer.save()
            allocate_resources(instance)
            data=ProductSerializer(instance,context={"request":request}).data
            return Response(data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=HTTP_400_BAD_REQUEST)


# Data filling scripts

def ResourceFilling(request):
    base_dir = settings.BASE_DIR
    data = pd.read_csv(os.path.join(base_dir,'data.csv'),error_bad_lines=False)
    return HttpResponse("Good")
    