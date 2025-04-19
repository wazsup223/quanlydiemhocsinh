FROM php:8.2-fpm

# Cài đặt các extension và công cụ cần thiết
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    supervisor \
    && docker-php-ext-install pdo pdo_pgsql

# Cài đặt Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Tạo thư mục làm việc
WORKDIR /var/www/html

# Copy source code
COPY . .

# Cài đặt dependencies
RUN composer install --no-scripts --no-autoloader

# Tạo autoload
RUN composer dump-autoload

# Cấu hình supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port
EXPOSE 80

# Start supervisor
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"] 