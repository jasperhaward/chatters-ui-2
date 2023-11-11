FROM nginx:1.25

RUN rm /etc/nginx/conf.d/default.conf
COPY app.conf /etc/nginx/conf.d/default.conf
COPY inject-frontend-env.sh /docker-entrypoint.d/

WORKDIR /app
COPY dist .
