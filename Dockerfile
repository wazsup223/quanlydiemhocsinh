FROM php:8.2-apache

# Cài đặt các extension PHP cần thiết
RUN docker-php-ext-install pdo pdo_pgsql

# Cài đặt composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Tạo và chuyển đến thư mục làm việc
WORKDIR /var/www/html

# Copy composer files trước
COPY composer.json composer.lock ./

# Cài đặt dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy source code
COPY . .

# Cấu hình Apache
RUN a2enmod rewrite
RUN service apache2 restart

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"] 