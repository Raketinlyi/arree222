# 🚀 Быстрая настройка Netlify (5 минут)

## ✅ Что уже сделано:
- Код запушен в `https://github.com/rosindima793-rgb/10.git`
- GitHub Actions настроен
- Конфигурация исправлена

## 🔧 Что нужно сделать СЕЙЧАС:

### 1. Создать сайт на Netlify
1. Зайти на **https://app.netlify.com/**
2. Нажать **"New site from Git"**
3. Выбрать **GitHub** → **rosindima793-rgb/10**
4. Настроить:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
   - **Node version**: `18`

### 2. Получить Netlify токены
После создания сайта:
1. **Site ID**: Site settings → General → Site details
2. **Auth Token**: User settings → Applications → Personal access tokens

### 3. Добавить GitHub Secrets
В репозитории `https://github.com/rosindima793-rgb/10` → Settings → Secrets:
- `NETLIFY_AUTH_TOKEN` = ваш токен
- `NETLIFY_SITE_ID` = ваш site ID

### 4. Добавить Environment Variables в Netlify
Site settings → Environment variables:
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_MONAD_RPC=https://monad-testnet.g.alchemy.com/v2/XgKXPDCwM8SYsWDPk1yCs
NEXT_PUBLIC_MONAD_CHAIN_ID=10143
NEXT_PUBLIC_CORE_PROXY=0xb8Fee974031de01411656F908E13De4Ad9c74A9B
NEXT_PUBLIC_GAME_PROXY=0xb8Fee974031de01411656F908E13De4Ad9c74A9B
NEXT_PUBLIC_READER_ADDRESS=0xF9017a4701E1464690d6b71E2Fb3AF9c4c1acab1
NEXT_PUBLIC_NFT_ADDRESS=0x4bcd4aff190d715fa7201cce2e69dd72c0549b07
NEXT_PUBLIC_OCTA_ADDRESS=0xB4832932D819361e0d250c338eBf87f0757ed800
NEXT_PUBLIC_CRAA_ADDRESS=0x7D7F4BDd43292f9E7Aae44707a7EEEB5655ca465
NEXT_PUBLIC_PAIR_TOKEN=0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=03b6c40419bd4b447d10bae3bc1377f3
NEXT_PUBLIC_WEB3_MODAL_ENABLED=true
```

## 🎯 Результат:
После настройки каждый push в `main` будет автоматически деплоиться на Netlify!

## 🔗 Полезные ссылки:
- **Репозиторий**: https://github.com/rosindima793-rgb/10
- **GitHub Actions**: https://github.com/rosindima793-rgb/10/actions
- **Netlify Dashboard**: https://app.netlify.com/

---
**Готово к автоматическому деплою! 🚀**