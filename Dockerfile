FROM nginx:stable-bullseye

WORKDIR /var/www

RUN apt-get update \
    && apt-get install -y curl

RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
    apt-get install -y nodejs

