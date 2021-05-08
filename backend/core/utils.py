from datetime import datetime, time, timedelta

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
