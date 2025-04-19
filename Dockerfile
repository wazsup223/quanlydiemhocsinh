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
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN a2enmod rewrite headers
RUN echo "DirectoryIndex index.php index.html" > /etc/apache2/conf-available/directory-index.conf
RUN a2enconf directory-index

# Cấu hình virtual host
RUN echo '<VirtualHost *:80>\n\
    ServerAdmin webmaster@localhost\n\
    DocumentRoot /var/www/html\n\
    <Directory /var/www/html>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"] 