# 1. Базовый образ: берём легковесный Python 3.11
FROM python:3.11-slim

# 2. Рабочая директория внутри контейнера
WORKDIR /app

# 3. Копируем файлы с компьютера в контейнер
COPY requirements.txt .

# 4. Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# 5. Копируем всё остальное
COPY . .

# 6. Говорим Docker, что будет открыто приложение на порту 5000
EXPOSE 5000

# 7. Команда, которая запустится при старте контейнера
CMD ["python", "app.py"]