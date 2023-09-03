FROM node:20-alpine as build
ENV NODE_OPTIONS --openssl-legacy-provider
COPY ./backend/src/data /backend/src/data
WORKDIR /app
COPY ./frontend .
RUN npm install --omit=dev
RUN npm run build

FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY ./frontend/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]