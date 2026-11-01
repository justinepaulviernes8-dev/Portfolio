#!/bin/sh
set -eu
mkdir -p /app/storage/framework/cache/data /app/storage/framework/sessions /app/storage/framework/views /app/storage/logs /app/bootstrap/cache
php /app/scripts/check-production.php
exec "$@"
