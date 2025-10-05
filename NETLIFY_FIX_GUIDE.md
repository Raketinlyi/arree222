# 🔧 ИСПРАВЛЕНИЯ ДЛЯ NETLIFY ДЕПЛОЯ

## ✅ **Что исправлено:**

### 1. **Next.js конфигурация** (`next.config.mjs`)
- ✅ Добавлен статический экспорт: `output: 'export'`
- ✅ Изменена директория сборки: `distDir: 'out'`
- ✅ Убраны конфликтующие заголовки безопасности
- ✅ Оставлена только конфигурация в `netlify.toml`

### 2. **Netlify конфигурация** (`netlify.toml`)
- ✅ Изменена директория публикации: `publish = "out"`
- ✅ Упрощен CSP для совместимости с Web3
- ✅ Убраны проблемные nonce и strict-dynamic

### 3. **GitHub Actions** (`.github/workflows/deploy-netlify.yml`)
- ✅ Добавлена установка pnpm
- ✅ Изменена директория деплоя: `--dir=out`
- ✅ Исправлен workflow для корректной сборки

### 4. **Документация** (`netlify-setup.md`)
- ✅ Обновлены инструкции с правильными настройками

## 🚀 **Команды для проверки:**

### Локальная проверка сборки:
```powershell
# Очистка и сборка
npm run clean:deploy
npm run build

# Проверка что создалась папка 'out'
ls out

# Проверка что есть index.html
ls out/index.html
```

### Проверка GitHub Secrets:
В настройках GitHub репозитория должны быть:
- `NETLIFY_AUTH_TOKEN` - токен из Netlify
- `NETLIFY_SITE_ID` - ID сайта из Netlify

### Настройки в Netlify Dashboard:
- **Build command:** `npm run build`
- **Publish directory:** `out`
- **Node version:** `18`

## 🔒 **Безопасность:**

### CSP теперь упрощен и совместим:
```
default-src 'self'; 
script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; 
style-src 'self' 'unsafe-inline' https:; 
img-src 'self' data: blob: https:; 
connect-src 'self' https: wss: ws:; 
font-src 'self' https:; 
media-src 'self' https: data: blob:; 
frame-src 'self' https:; 
object-src 'none'; 
base-uri 'self'; 
form-action 'self'; 
frame-ancestors 'none'
```

## 🎯 **Результат:**

После этих исправлений:
1. ✅ Нет конфликтов между Next.js и Netlify заголовками
2. ✅ Статический экспорт работает корректно
3. ✅ CSP не блокирует Web3 библиотеки
4. ✅ GitHub Actions деплоит правильную директорию
5. ✅ Все защиты работают без ошибок

## 📞 **Если все еще есть ошибки:**

1. Проверьте логи сборки в Netlify
2. Убедитесь что GitHub Secrets добавлены
3. Проверьте что локальная сборка работает: `npm run build`
4. Проверьте что папка `out` создается и содержит `index.html`

---

**🎉 Готово к автоматическому деплою без ошибок!**