# Build stage
FROM composer:2.5 as composer

WORKDIR /app
COPY . .
RUN composer install --no-scripts --no-autoloader

# Runtime stage
FROM php:8.2-cli

# Cài đặt các extension cần thiết
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql

# Copy code và dependencies từ build stage
COPY --from=composer /app /app
WORKDIR /app

# Tạo autoload
RUN composer dump-autoload

# Expose port
EXPOSE 80

# Start PHP built-in server
CMD ["php", "-S", "0.0.0.0:80"] 