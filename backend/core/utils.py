from datetime import datetime, time, timedelta
from .models import *
from django.db.models import Q
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template import loader


def send_mail(subject_template_name, email_template_name, context, from_email, to_email, html_email_template_name=None):

    subject = loader.render_to_string(subject_template_name, context)
    subject = ''.join(subject.splitlines())
    body = loader.render_to_string(email_template_name, context)

    email_message = EmailMultiAlternatives(subject, body, from_email, [to_email])
    print(html_email_template_name)
    print(f"server email {settings.EMAIL_HOST_USER}")
    print(f"server pass {settings.EMAIL_HOST_PASSWORD}")
    if html_email_template_name is not None:
        html_email = loader.render_to_string(html_email_template_name, context)
        email_message.attach_alternative(html_email, 'text/html')

    email_message.send()

def allocate_resources(product,is_vacancy):
    is_vacancy={
        "Senior":0,
        "Junior":0,
        "Mid":0
    }

    if product.end_date is not None :
        for k,v in product.requirements.items():
            available_resources=Resource.objects.filter(role_level=k).exclude(
                Q(products_through__start_date__range=[product.start_date,product.end_date])|
                Q(products_through__end_date__range=[product.start_date,product.end_date])|
                Q(products_through__end_date__gte=product.end_date,products_through__start_date__lte=product.start_date)
            ).exclude(
                Q(products_through__product__end_date__range=[product.start_date,product.end_date])|
                Q(products_through__product__end_date__gte=product.end_date,products_through__start_date__lte=product.start_date),
                products_through__end_date=None,
            )

            can_take=min(int(product.requirements[k]),available_resources.count())
            print(can_take)
            diff=can_take-int(product.requirements[k])
            if diff<0 :
                is_vacancy[k]=-1*diff
            for i in range(can_take):
                print("i",i)
                product.resources.add(available_resources[i])
    else :
        for k,v in product.requirements.items():
            available_resources=Resource.objects.filter(role_level=k).exclude(
                products_through__end_date__gte=product.start_date
            ).exclude(
                products_through__end_date=None,
                products_through__product__end_date__gte=product.start_date
            ).exclude(
                products__end_date=None
            )

            can_take=min(int(product.requirements[k]),available_resources.count())
            diff=can_take-int(product.requirements[k])
            if diff<0 :
                is_vacancy[k]=-1*diff
            for i in range(can_take):
                product.resources.add(available_resources[i])

    product.save()
