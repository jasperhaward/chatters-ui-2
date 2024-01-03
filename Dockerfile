FROM nginx:1.25

RUN rm /etc/nginx/conf.d/default.conf
COPY app.conf /etc/nginx/conf.d/default.conf

COPY inject-frontend-env.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/inject-frontend-env.sh

WORKDIR /app
COPY dist .
