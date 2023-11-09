FROM nginx:1.25

RUN rm /etc/nginx/conf.d/default.conf
COPY app.conf /etc/nginx/conf.d/default.conf

WORKDIR /app
COPY dist .
COPY entrypoint.sh .

ENTRYPOINT ["./entrypoint.sh"]