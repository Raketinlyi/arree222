# 🚀 Настройка автоматического деплоя на Netlify через GitHub

## 📋 План действий

### 1. Подготовка GitHub репозитория
✅ **Выполнено**: Добавлен remote `netlify-deploy` → `https://github.com/rosindima793-rgb/10.git`

### 2. Пуш кода в новый репозиторий

```powershell
# Проверяем статус
git status

# Добавляем все изменения
git add .

# Коммитим
git commit -m "feat: setup Netlify auto-deploy with fixed config"

# Пушим в новый репозиторий для деплоя
git push netlify-deploy main
```

### 3. Настройка Netlify Dashboard

1. **Зайдите на https://app.netlify.com/**
2. **Нажмите "New site from Git"**
3. **Выберите GitHub и подключите репозиторий:**
   - Repository: `rosindima793-rgb/10`
   - Branch: `main`
4. **Настройте параметры сборки:**
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: `18`

### 4. Настройка GitHub Secrets

Перейдите в репозиторий `https://github.com/rosindima793-rgb/10` → Settings → Secrets and variables → Actions

**Добавьте следующие secrets:**

#### NETLIFY_AUTH_TOKEN
1. Зайдите в Netlify → User settings → Applications → Personal access tokens
2. Создайте новый токен с полными правами
3. Скопируйте токен и добавьте как `NETLIFY_AUTH_TOKEN`

#### NETLIFY_SITE_ID  
1. В Netlify Dashboard → Site settings → General → Site details
2. Скопируйте "Site ID" 
3. Добавьте как `NETLIFY_SITE_ID`

### 5. Environment Variables в Netlify

В Netlify Dashboard → Site settings → Environment variables добавьте:

```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Monad Testnet
NEXT_PUBLIC_MONAD_RPC=https://monad-testnet.g.alchemy.com/v2/XgKXPDCwM8SYsWDPk1yCs
NEXT_PUBLIC_MONAD_CHAIN_ID=10143
MONAD_RPC=https://monad-testnet.g.alchemy.com/v2/XgKXPDCwM8SYsWDPk1yCs
MONAD_CHAIN_ID=10143

# Contracts
NEXT_PUBLIC_CORE_PROXY=0xb8Fee974031de01411656F908E13De4Ad9c74A9B
NEXT_PUBLIC_GAME_PROXY=0xb8Fee974031de01411656F908E13De4Ad9c74A9B
NEXT_PUBLIC_READER_ADDRESS=0xF9017a4701E1464690d6b71E2Fb3AF9c4c1acab1
NEXT_PUBLIC_NFT_ADDRESS=0x4bcd4aff190d715fa7201cce2e69dd72c0549b07
NEXT_PUBLIC_OCTA_ADDRESS=0xB4832932D819361e0d250c338eBf87f0757ed800
NEXT_PUBLIC_CRAA_ADDRESS=0x7D7F4BDd43292f9E7Aae44707a7EEEB5655ca465
NEXT_PUBLIC_PAIR_TOKEN=0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=03b6c40419bd4b447d10bae3bc1377f3
NEXT_PUBLIC_WEB3_MODAL_ENABLED=true
```

## 🔧 Команды для локального тестирования

```powershell
# Установка зависимостей
pnpm install

# Очистка
pnpm run clean:deploy

# Сборка (как на Netlify)
pnpm build

# Проверка результата
ls out/
```

## ✅ Проверка автоматического деплоя

1. **Сделайте любое изменение в коде**
2. **Закоммитьте и запушьте:**
   ```powershell
   git add .
   git commit -m "test: trigger auto-deploy"
   git push netlify-deploy main
   ```
3. **Проверьте:**
   - GitHub Actions: `https://github.com/rosindima793-rgb/10/actions`
   - Netlify Deploys: В Dashboard → Deploys

## 🎯 Ожидаемый результат

- ✅ Автоматический деплой при каждом push в `main`
- ✅ Рабочие Web3 функции на Monad Testnet
- ✅ Безопасные CSP заголовки
- ✅ Оптимизированная сборка Next.js

## 🚨 Если что-то не работает

1. **Проверьте GitHub Actions логи**
2. **Проверьте Netlify Deploy логи**
3. **Убедитесь что все Secrets настроены**
4. **Проверьте Environment Variables в Netlify**

---
**Готово к деплою! 🚀**