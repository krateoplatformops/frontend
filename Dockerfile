# dist/ is static, so build it on the native arch instead of emulating the target
FROM --platform=$BUILDPLATFORM node:24.2.0-alpine3.22 AS react-build
LABEL maintainer "Krateo <contact@krateo.io>"

ARG VERSION

WORKDIR /app
COPY . ./
RUN npm install
RUN npm version $VERSION
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm run build

# remove config folder that is used for local development
#in production a volume is mounted in the container
RUN rm -r dist/config 

# server environment
FROM bitnami/nginx

COPY --from=react-build /app/dist /app

ENV PORT 8080
EXPOSE 8080
# COPY nginx.conf /opt/bitnami/nginx/conf/server_blocks/my_server_block.conf
COPY nginx.conf /opt/bitnami/nginx/conf/bitnami/location.conf
CMD ["nginx", "-g", "daemon off;"]