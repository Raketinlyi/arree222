# 🎮 CrazyOctagon / CrazyCube NFT Game

Web3 NFT Game на Monad Testnet - скрещивай, сжигай, оживляй и зарабатывай с уникальными кубиками!

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env.local
# Заполнить реальные значения в .env.local

# Запуск dev сервера
npm run dev

# Открыть в браузере
# http://localhost:3000
```

## 📦 Технологии

- **Frontend:** Next.js 15, React 18, TypeScript
- **Web3:** Wagmi, Viem, WalletConnect
- **Styling:** Tailwind CSS, Framer Motion
- **Blockchain:** Monad Testnet
- **Images:** Локальное хранение (public/nft/)
- **Deployment:** Vercel (рекомендуется) или Netlify

## 🎯 Основные функции

- **Breed (Скрещивание):** Создавай новые NFT из двух родителей
- **Burn (Сжигание):** Сжигай NFT за награды
- **Ping (Активация):** Активируй NFT для заработка
- **Graveyard (Кладбище):** Оживляй сожженные NFT
- **Stats (Статистика):** Отслеживай свои достижения

## 📁 Структура проекта

```
├── app/                    # Next.js App Router
│   ├── breed/             # Страница скрещивания
│   ├── burn/              # Страница сжигания
│   ├── graveyard/         # Кладбище NFT
│   ├── ping/              # Активация NFT
│   ├── stats/             # Статистика
│   └── api/               # API routes
├── components/            # React компоненты
│   ├── ui/               # UI библиотека (shadcn)
│   └── web3/             # Web3 компоненты
├── hooks/                # Custom React hooks
├── lib/                  # Утилиты и конфиги
├── public/               # Статические файлы
│   ├── nft/             # NFT изображения (локально!)
│   └── images/          # Прочие изображения
├── config/               # Конфигурация контрактов
├── styles/               # Глобальные стили
└── types/                # TypeScript типы
```

## 🔧 Переменные окружения

Основные переменные (`.env.local`):

```bash
# Alchemy API Keys (5 ключей для ротации)
NEXT_PUBLIC_ALCHEMY_API_KEY_1=your_key_1
NEXT_PUBLIC_ALCHEMY_API_KEY_2=your_key_2
NEXT_PUBLIC_ALCHEMY_API_KEY_3=your_key_3
NEXT_PUBLIC_ALCHEMY_API_KEY_4=your_key_4
NEXT_PUBLIC_ALCHEMY_API_KEY_5=your_key_5

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Monad Chain ID
NEXT_PUBLIC_MONAD_CHAIN_ID=10143

# Monad RPC
NEXT_PUBLIC_MONAD_RPC=https://monad-testnet.rpc.caldera.xyz/http
```

Полный список переменных см. в `.env.example`

## 🚀 Deployment

### Vercel (Рекомендуется)

Проект оптимизирован для Vercel:

1. Импортировать репозиторий на vercel.com
2. Добавить Environment Variables
3. Deploy!

Подробная инструкция: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### Netlify

Альтернативно можно использовать Netlify:
- Конфигурация в `netlify.toml`
- Следовать инструкции в `NETLIFY_GITHUB_SETUP.md`

## 📜 Доступные скрипты

```bash
# Development
npm run dev              # Запуск dev сервера

# Production
npm run build            # Сборка проекта
npm run start            # Запуск production билда

# Code Quality
npm run lint             # Проверка ESLint
npm run lint:fix         # Исправить ESLint ошибки
npm run typecheck        # Проверка TypeScript

# Security
npm run check:security   # Аудит безопасности
npm run ci:check         # CI проверки (typecheck + lint + security)

# Other
npm run format           # Форматирование кода (Prettier)
npm run clean:logs       # Удаление console.log
```

## 🖼️ Локальные изображения NFT

Проект использует **локальные изображения** вместо IPFS:

- **Путь:** `public/nft/`
- **Формат:** `{tokenId}.webp` (1.webp, 10.webp, 100.webp и т.д.)
- **Преимущества:** Быстрая загрузка, нет ошибок IPFS gateway, CDN кеширование

Подробнее: [LOCAL_IMAGES_IMPLEMENTATION.md](./LOCAL_IMAGES_IMPLEMENTATION.md)

## 🔒 Безопасность

Проект имеет высокий уровень безопасности (4.4/5):

- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ Trusted Types + DOMPurify (XSS защита)
- ✅ Rate limiting (middleware)
- ✅ Contract allowlist
- ✅ Chain ID validation

Подробный аудит: [SECURITY_AUDIT_2025.md](./SECURITY_AUDIT_2025.md)

## 📚 Документация

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Деплой на Vercel
- [LOCAL_IMAGES_IMPLEMENTATION.md](./LOCAL_IMAGES_IMPLEMENTATION.md) - Локальные изображения
- [SECURITY_AUDIT_2025.md](./SECURITY_AUDIT_2025.md) - Аудит безопасности
- [MONAD_NETWORK_OPTIMIZATIONS.md](./MONAD_NETWORK_OPTIMIZATIONS.md) - Оптимизации для Monad
- [IPFS_IMPROVEMENTS_SUMMARY.md](./IPFS_IMPROVEMENTS_SUMMARY.md) - История IPFS улучшений

## 🤝 Поддержка

- Website: [crazyoctagon.xyz](https://crazyoctagon.xyz)
- Twitter: [@CrazyOctagon](https://twitter.com/CrazyOctagon)
- Telegram: [CrazyOctagon Community](https://t.me/crazyoctagon)

## 📄 License

Proprietary - All rights reserved

---

## 🔧 Smart Contracts (UUPS Upgradeable)

Core контракт upgradeable через UUPS. Только `ADMIN_ROLE` может обновлять.

### Upgrade процесс:

```bash
npx hardhat run scripts/upgrade_core.js --network monadTestnet --impl 0xNewImplementationAddress
```

**Safety checklist:**
- Сохранить storage layout (append-only)
- Оставить `_authorizeUpgrade` функцию
- Протестировать на fork перед mainnet

---

**Made with ❤️ by CrazyOctagon Team**
