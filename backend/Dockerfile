FROM python:3.6
RUN pip install pipenv


ENV DJANGO_ENV=production \
    PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    PIPENV_HIDE_EMOJIS=true \
    PIPENV_COLORBLIND=true \
    PIPENV_NOSPIN=true \
    PIPENV_DOTENV_LOCATION=.env

# postgres (need psql cli for wait-for-postgres.sh)
# RUN apt-get update && apt-get install -y libpq-dev postgresql postgresql-contrib

COPY Pipfile* /
# RUN cd /tmp && pipenv lock --keep-outdated --requirements > requirements.txt
RUN pipenv lock --requirements > requirements.txt
RUN pipenv install  --deploy --system --ignore-pipfile

WORKDIR /interapt

# ENV WAIT_VERSION 2.7.2
# ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait scripts/wait

# always copy files after installing packages
# docker will cache the packages hence better build time
COPY . /interapt

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait scripts/wait
RUN chmod +x scripts/*