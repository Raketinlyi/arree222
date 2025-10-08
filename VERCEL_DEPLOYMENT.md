# 🚀 Деплой на Vercel

Полная инструкция по развертыванию проекта CrazyOctagon на Vercel.

## 📋 Подготовка к деплою

### 1. Проверка локального билда

```bash
# Установка зависимостей
npm install

# Проверка линтера
npm run lint

# Проверка сборки
npm run build

# Локальный запуск production билда
npm run start
```

### 2. Очистка проекта

Убедитесь что удалены все ненужные файлы:
- ✅ Тестовые страницы (ipfs-debug, ipfs-test и т.д.) - **УЖЕ УДАЛЕНЫ**
- ✅ Временные файлы (.next/, out/, node_modules/)
- ✅ Локальные env файлы (.env.local - не коммитим!)

## 🔧 Настройка Vercel

### 1. Создание проекта на Vercel

1. Зайти на [vercel.com](https://vercel.com)
2. Нажать **"Add New Project"**
3. Выбрать Git репозиторий (GitHub/GitLab/Bitbucket)
4. Импортировать проект

### 2. Настройка Environment Variables

В настройках проекта на Vercel добавить:

#### 🔑 Обязательные переменные:

```bash
# Alchemy API Keys (для RPC)
NEXT_PUBLIC_ALCHEMY_API_KEY_1=ваш_ключ_1
NEXT_PUBLIC_ALCHEMY_API_KEY_2=ваш_ключ_2
NEXT_PUBLIC_ALCHEMY_API_KEY_3=ваш_ключ_3
NEXT_PUBLIC_ALCHEMY_API_KEY_4=ваш_ключ_4
NEXT_PUBLIC_ALCHEMY_API_KEY_5=ваш_ключ_5

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=ваш_project_id

# Monad Chain ID
NEXT_PUBLIC_MONAD_CHAIN_ID=10143

# Monad RPC URLs
NEXT_PUBLIC_MONAD_RPC=https://monad-testnet.rpc.caldera.xyz/http
MONAD_RPC=https://monad-testnet.rpc.caldera.xyz/http
```

#### 🔗 Адреса контрактов (если отличаются от дефолтных):

```bash
NEXT_PUBLIC_CORE_PROXY=0xадрес_контракта
NEXT_PUBLIC_NFT_ADDRESS=0xадрес_nft
NEXT_PUBLIC_OCTA_ADDRESS=0xадрес_octa
NEXT_PUBLIC_OCTAA_ADDRESS=0xадрес_octaa
```

### 3. Build & Deployment Settings

Vercel автоматически определит Next.js проект. Настройки:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node Version:** 18.x или 20.x

### 4. Настройка домена (опционально)

1. В настройках проекта → **Domains**
2. Добавить свой домен
3. Настроить DNS записи у регистратора

## 🎯 Особенности деплоя

### Локальные изображения NFT

Проект использует локальные изображения из `/public/nft/`:
- ✅ Все изображения автоматически оптимизируются Vercel
- ✅ Кешируются на 1 год (immutable)
- ✅ Не нужны внешние IPFS gateway

### Security Headers

Все security headers настроены в `vercel.json`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- Content-Security-Policy (CSP)
- Permissions-Policy

### Оптимизация изображений

Vercel автоматически оптимизирует изображения:
- Конвертация в WebP/AVIF
- Lazy loading
- Responsive images
- CDN кеширование

## 🚦 После деплоя

### Проверка работоспособности

1. **Главная страница:** https://ваш-домен.vercel.app
2. **NFT изображения:** Проверить что грузятся локальные картинки
3. **Web3 подключение:** Подключить кошелек и проверить работу
4. **Основные функции:**
   - Breed (скрещивание NFT)
   - Burn (сжигание NFT)
   - Ping (активация NFT)
   - Graveyard (кладбище)

### Мониторинг

1. **Vercel Analytics:** Включить в настройках проекта
2. **Real-time logs:** Vercel → Project → Functions
3. **Build logs:** Проверить успешность сборки

## 🐛 Типичные проблемы

### 1. Build Failed

**Причина:** TypeScript ошибки или отсутствующие зависимости

**Решение:**
```bash
# Локально проверить билд
npm run build

# Проверить зависимости
npm install

# Проверить TypeScript
npm run typecheck
```

### 2. Изображения не грузятся

**Причина:** Неправильные пути или отсутствуют файлы в `/public/nft/`

**Решение:**
- Убедиться что все изображения есть в `/public/nft/`
- Проверить что имена файлов: `1.webp`, `10.webp`, `100.webp` и т.д.
- Проверить что компоненты передают `tokenId` prop

### 3. ENV переменные не работают

**Причина:** Не добавлены на Vercel или неправильный префикс

**Решение:**
- Все публичные переменные должны начинаться с `NEXT_PUBLIC_`
- Проверить что добавлены в Vercel Settings → Environment Variables
- После изменения переменных - **Redeploy**

### 4. CSP ошибки в консоли

**Причина:** Блокировка Web3 библиотек

**Решение:**
- CSP уже настроен в `vercel.json`
- Разрешены `unsafe-inline` и `unsafe-eval` для Web3
- Если нужно - добавить дополнительные домены в CSP

## 📊 Производительность

Ожидаемые метрики:

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **Build Time:** ~2-3 минуты
- **Bundle Size:** ~500-800 KB (JS) + изображения

## 🔄 Обновления

### Автоматический деплой

Vercel автоматически деплоит при push в GitHub:
- **main branch** → Production
- **другие ветки** → Preview deployments

### Ручной деплой

```bash
# Установить Vercel CLI
npm i -g vercel

# Залогиниться
vercel login

# Деплой
vercel --prod
```

## 📚 Полезные ссылки

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/environment-variables)

## ✅ Чеклист перед деплоем

- [ ] Локальный `npm run build` проходит без ошибок
- [ ] Все ENV переменные добавлены на Vercel
- [ ] Изображения NFT лежат в `/public/nft/`
- [ ] Удалены тестовые страницы
- [ ] Проверен `.vercelignore`
- [ ] Настроен домен (если нужно)
- [ ] Включен Vercel Analytics (опционально)

---

**Готово! Проект настроен для Vercel deployment 🚀**

В случае проблем - проверить Vercel logs или написать в поддержку.
