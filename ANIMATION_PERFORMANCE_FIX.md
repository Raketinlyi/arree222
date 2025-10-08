# 🚀 Оптимизация Анимаций для Слабых Устройств

**Дата:** 7 января 2025  
**Проблема:** На ноутбуке Huawei без видеокарты монетки летят в 5-7 раз быстрее, кнопки быстро моргают  
**Статус:** ⚠️ **В ПРОЦЕССЕ - ТЕСТИРОВАНИЕ ТРЕБУЕТСЯ**

---

## 🔴 Проблема

**Симптомы:**
- Монетки (CoinsAnimation) летят в 5-7 раз быстрее на слабом ноутбуке
- Кнопки моргают быстро
- На других устройствах (десктоп, телефон, рабочий ПК) всё нормально
- Устройство: Huawei ноутбук без выделенной видеокарты

**Возможные причины:**
1. CSS animations без GPU acceleration
2. Браузер пропускает фреймы и визуально анимация кажется быстрее
3. Отсутствие GPU acceleration заставляет CPU рендерить некорректно
4. Браузер пытается "компенсировать" пропущенные фреймы ускорением анимации

---

## ✅ Что сделано

### 1. Оптимизация CoinsAnimation

**Файл:** `components/coins-animation.tsx`

**Изменения:**
- ✅ Добавлена функция `detectWeakDevice()` - проверка CPU cores и RAM
- ✅ Автоматическое снижение количества монеток на слабых устройствах:
  - Weak device multiplier: **0.3** (70% меньше монеток)
  - Минимум: **4 монетки** вместо 8
- ✅ Добавлен GPU acceleration для монеток:
  ```css
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  ```

**Код detection:**
```typescript
function detectWeakDevice(): boolean {
  const nav = navigator as any;
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4; // GB
  
  // Weak device: <= 2 cores OR <= 2GB RAM
  return cores <= 2 || memory <= 2;
}
```

---

### 2. Глобальная оптимизация анимаций

**Файл:** `styles/globals.css`

**Уже существует lite-mode:**
```css
.lite-mode * {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}
```

**Также есть:**
- ✅ `@media (prefers-reduced-motion: reduce)` - системная настройка
- ✅ `.reduce-motion` класс для mobile
- ✅ GPU acceleration для animated элементов

---

### 3. Хук usePerformanceMode

**Файл:** `hooks/usePerformanceMode.ts`

**Функционал:**
- ✅ Автоматическое определение слабого устройства (cores <= 2 OR memory <= 2GB)
- ✅ Автоматическое включение `lite-mode` класса на `<body>`
- ✅ Ручной toggle для пользователя
- ✅ Сохранение preference в localStorage

**API:**
```typescript
const { isWeakDevice, isLiteMode, toggleLiteMode } = usePerformanceMode();

// isWeakDevice - true если cores <= 2 OR memory <= 2GB
// isLiteMode - текущее состояние lite mode
// toggleLiteMode() - включить/выключить вручную
```

---

### 4. Переводы на хинди

**Файл:** `lib/locales/hi.json`

**Проблема:** Диалоги кубов (cubeAnimation) были на английском вместо хинди

**Исправлено:**
- ✅ Все диалоги переведены на хинди (Devanagari script)
- ✅ oldDialog - старые кубы
- ✅ panicText - паника
- ✅ newCubePhrases - новые кубы (про Monad testnet)

**Пример:**
```json
"oldDialog": [
  "नीला बैंगनी क्यों हो गया?!",
  "मुझे किसने फिर से रंगा?",
  "क्या यह वाकई हमारी दुनिया है?",
  "मैं पीला था, ईमानदारी से!",
  "रुको, क्या हो रहा है?"
]
```

---

## ⚠️ Что нужно доделать

### 1. Подключить usePerformanceMode к ClientLayout

**Файл:** `app/ClientLayout.tsx`

**Нужно добавить:**

```typescript
// В imports (после других импортов)
import { usePerformanceMode } from '@/hooks/usePerformanceMode';

// В начале ClientLayout функции (после useState)
export default function ClientLayout({ children }: ...) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // ADD THIS: Enable performance mode for weak devices
  usePerformanceMode();
  
  // ... остальной код
}
```

**Как добавить вручную:**
1. Открыть `app/ClientLayout.tsx`
2. Найти строку с импортами (около строки 28):
   ```typescript
   import type { AnimatedLayoutShellProps } from '@/components/layout/AnimatedLayoutShell';
   ```
3. Добавить после неё:
   ```typescript
   import { usePerformanceMode } from '@/hooks/usePerformanceMode';
   ```
4. Найти функцию `ClientLayout` (около строки 169):
   ```typescript
   export default function ClientLayout({ children }: ...) {
     const [mounted, setMounted] = useState(false);
     const pathname = usePathname();
   ```
5. Добавить после `pathname`:
   ```typescript
     // Enable performance mode for weak devices
     usePerformanceMode();
   ```

---

### 2. Протестировать на слабом устройстве

**Чек-лист тестирования:**

✅ **CoinsAnimation (монетки):**
- [ ] Открыть главную страницу
- [ ] Проверить количество монеток (должно быть меньше)
- [ ] Проверить скорость падения (должна быть нормальной, не 5-7x быстрее)

✅ **Кнопки:**
- [ ] Проверить `animate-pulse` (должны моргать медленнее)
- [ ] Проверить `animate-spin` (должны крутиться медленнее)

✅ **Console logs:**
- [ ] Открыть DevTools → Console
- [ ] Найти лог: `[Performance Mode] Device detection: { cores: ..., memory: ..., isWeak: ... }`
- [ ] Проверить что `isWeak: true` если cores <= 2 OR memory <= 2GB
- [ ] Найти лог: `[Performance Mode] Lite mode enabled automatically`

✅ **DOM:**
- [ ] Инспектировать `<body>` элемент
- [ ] Должен быть класс `lite-mode` если устройство слабое

---

## 📊 Что делает lite-mode

**Файл:** `styles/globals.css`

### 1. Отключает анимации
```css
.lite-mode * {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
}
```

### 2. Упрощает карточки
```css
.lite-mode .ape-card {
  @apply bg-slate-800 border border-slate-600;
  box-shadow: none;
  backdrop-filter: none;
}
```

### 3. Убирает градиенты
```css
.lite-mode .ape-text {
  @apply text-cyan-400;
  background: none;
}
```

### 4. Убирает hover effects
```css
.lite-mode *:hover {
  transform: none !important;
  filter: none !important;
}
```

### 5. Скрывает эффекты частиц
```css
.lite-mode .particle-effect {
  display: none !important;
}
```

---

## 🔍 Как проверить detection

**В браузере:**

```javascript
// Console в DevTools
navigator.hardwareConcurrency  // CPU cores
navigator.deviceMemory          // RAM в GB

// Для Huawei без видеокарты ожидаем:
// cores: 2 или меньше
// memory: 2GB или меньше
```

**Ожидаемые значения:**
- **Huawei слабый ноутбук:** cores: 2, memory: 2GB → `isWeak: true`
- **Десктоп:** cores: 8, memory: 16GB → `isWeak: false`
- **Телефон:** cores: 8, memory: 6GB → `isWeak: false`

---

## 🎯 Альтернативные решения

Если автоматическое определение не работает:

### 1. Ручной toggle в UI

Добавить кнопку "Performance Mode" в Settings:

```tsx
import { usePerformanceMode } from '@/hooks/usePerformanceMode';

function SettingsPanel() {
  const { isLiteMode, toggleLiteMode } = usePerformanceMode();
  
  return (
    <button onClick={toggleLiteMode}>
      {isLiteMode ? '⚡ Performance Mode: ON' : '🎨 Performance Mode: OFF'}
    </button>
  );
}
```

### 2. FPS detection

Более точный способ - измерять реальный FPS:

```typescript
function detectLowFPS(callback: (isLow: boolean) => void) {
  let lastTime = performance.now();
  let frames = 0;
  
  function checkFPS() {
    const now = performance.now();
    frames++;
    
    if (now - lastTime >= 1000) {
      const fps = (frames * 1000) / (now - lastTime);
      const isLow = fps < 30; // < 30 FPS = weak device
      callback(isLow);
      
      frames = 0;
      lastTime = now;
    }
    
    requestAnimationFrame(checkFPS);
  }
  
  requestAnimationFrame(checkFPS);
}
```

### 3. User Agent detection

Если известны конкретные слабые устройства:

```typescript
function isKnownWeakDevice(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  
  return (
    ua.includes('huawei') ||
    ua.includes('low-end') ||
    // добавить другие
  );
}
```

---

## 🐛 Дебаг

**Если анимации всё ещё быстрые:**

1. **Проверить console logs:**
   ```
   [Performance Mode] Device detection: { cores: ..., memory: ..., isWeak: ... }
   [Performance Mode] Lite mode enabled automatically
   ```

2. **Проверить DOM:**
   - Инспектировать `<body>`
   - Должен быть класс `lite-mode`

3. **Проверить CSS:**
   - В DevTools → Elements → Computed
   - Найти `animation-duration`
   - Должно быть `0s !important` для всех элементов

4. **Проверить количество монеток:**
   - Инспектировать DOM
   - Найти `.animate-coin-fall` элементы
   - Должно быть 4-6 монеток вместо 12-20

**Если detection не работает:**

```typescript
// Временно hardcode weak device
// В hooks/usePerformanceMode.ts
function detectWeakDevice(): boolean {
  return true; // Всегда включать lite mode для теста
}
```

---

## 📝 Дополнительная информация

### Tailwind animations

**Файл:** `tailwind.config.ts`

Кастомные анимации:
- `float` - 3s ease-in-out infinite
- `pulse-glow` - 2s ease-in-out infinite

Встроенные:
- `animate-pulse` - opacity pulse
- `animate-spin` - rotate 360deg
- `animate-bounce` - up and down

Все они будут отключены в lite-mode.

---

### CSS animations timing

**Важно:** CSS animations используют **time-based** timing, НО:
- На слабых устройствах браузер может пропускать фреймы
- Визуально анимация кажется быстрее
- GPU acceleration помогает стабилизировать

**Решение:**
1. Уменьшить количество анимированных элементов (✅ сделано для монеток)
2. Добавить GPU acceleration (✅ сделано: `will-change: transform`)
3. Упростить сложные градиенты/фильтры (✅ lite-mode делает это)

---

## 🎉 ИТОГ

**Что готово:**
- ✅ Оптимизация CoinsAnimation (70% меньше монеток на weak devices)
- ✅ GPU acceleration для монеток
- ✅ Hook usePerformanceMode с auto-detection
- ✅ Lite-mode класс в globals.css
- ✅ Переводы на хинди (hi.json)

**Что нужно:**
- ⚠️ Добавить вызов `usePerformanceMode()` в ClientLayout.tsx (2 строки кода)
- ⚠️ Протестировать на слабом ноутбуке Huawei

**После добавления в ClientLayout и тестирования:**
- Монетки должны лететь нормально (не 5-7x быстрее)
- Кнопки должны моргать медленнее
- Общая производительность должна улучшиться

---

**Дата создания:** 7 января 2025  
**Следующий шаг:** Добавить usePerformanceMode() в ClientLayout.tsx и протестировать
