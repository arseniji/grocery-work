#!/bin/bash

# Путь к Rails-проекту
RAILS_ROOT="/Users/michael/Documents/grocery-shop/server"

# Папка для логов
LOG_DIR="$RAILS_ROOT/log"

# Файл лога
LOG_FILE="$LOG_DIR/backup.log"

# Переходим в корень проекта
cd "$RAILS_ROOT" || exit

/bin/bash -c "bin/rails db:json_backup >> \"$LOG_FILE\" 2>&1"
/bin/bash -c "bin/rails db:sql_backup >> \"$LOG_FILE\" 2>&1"
