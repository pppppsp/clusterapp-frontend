# ClusterApp Frontend

Фронтенд для визуализации данных и прогнозов из `API_DOCS.md`.

## Стек

- `React 18`
- `TypeScript`
- `Vite`
- `Recharts`
- пакетный менеджер: `yarn`

## Запуск

Проект лучше запускать внутри WSL, так как установка из пути `\\wsl.localhost\...` ломает часть postinstall-скриптов (`esbuild`) в Windows `cmd.exe`.

```bash
cd /home/salavat/kursovaya/clusterapp-frontend
yarn install
yarn dev
```

## Сборка

```bash
yarn build
```

## Переменные окружения

- `VITE_API_BASE_URL` — базовый адрес backend API.
- если переменная не задана, используется `http://localhost:8000`.

## Что реализовано

- список магазинов и агрегированные метрики из `GET /api/v1/stores`
- исторический график продаж магазина из `GET /api/v1/stores/{store_id}/sales`
- запуск прогнозов `SARIMAX` и `GRU`
- локальная визуализация факта и прогноза
- отображение серверных PNG-графиков из поля `plots`
- вывод метрик качества и параметров модели
