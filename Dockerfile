FROM php:8.2-apache

# Cài đặt các dependencies cần thiết
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Cài đặt các extension PHP cần thiết
RUN docker-php-ext-install pdo pdo_pgsql

# Cài đặt composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Tạo và chuyển đến thư mục làm việc
WORKDIR /var/www/html

# Copy source code
COPY . .

# Tạo composer.json nếu chưa có
RUN if [ ! -f composer.json ]; then \
    echo '{"require": {"php": ">=7.4", "ext-pdo": "*"}}' > composer.json; \
    fi

# Cài đặt dependencies
RUN composer install --no-dev --optimize-autoloader

# Cấu hình Apache
RUN a2enmod rewrite
RUN service apache2 restart

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"] 