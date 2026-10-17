# Stage 1: Build the React application
FROM node:22 as build

WORKDIR app

ARG ENVIRONMENT

# Copy package files first for better Docker layer caching
COPY package.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the source code
COPY . .

# Build logic based on environment
RUN echo "🔍 Environment: $ENVIRONMENT" && \
    if [ "$ENVIRONMENT" = "dev" ]; then \
        echo "🔧 Development environment detected. Running yarn build:dev..."; \
        yarn build:dev; \
    else \
        echo "🏭 Production/other environment detected. Running yarn build..."; \
        yarn build; \
    fi

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/build .

CMD ["nginx", "-g", "daemon off;"]
