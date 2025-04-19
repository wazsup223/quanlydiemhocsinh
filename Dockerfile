FROM php:8.2-cli

# Cài đặt các extension cần thiết
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql

# Cài đặt Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Tạo thư mục làm việc
WORKDIR /app

# Copy composer files trước
COPY composer.json composer.lock ./

# Cài đặt dependencies
RUN composer install --no-scripts --no-autoloader

# Copy toàn bộ source code
COPY . .

# Tạo autoload
RUN composer dump-autoload

# Expose port
EXPOSE 80

# Start PHP built-in server
CMD ["php", "-S", "0.0.0.0:80"] 