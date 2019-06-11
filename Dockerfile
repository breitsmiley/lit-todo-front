ARG NODE_VERSION=12.4.0
ARG NGINX_VERSION=1.17.0

### STAGE 1: Building project ###
#-----------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS builder

## Create app directory
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN ng build --prod


### STAGE 2: Setup main image ###
##-----------------------------------------------------
FROM nginx:${NGINX_VERSION}-alpine

WORKDIR /app

# Copy compiled sources
COPY --from=builder /app/dist/lit-todo-front /app

# Expose the port the app runs in
EXPOSE 80
