# ⚡ БЫСТРОЕ ИСПРАВЛЕНИЕ - Анимации на слабых устройствах

**Проблема:** Монетки летят в 5-7 раз быстрее на Huawei ноутбуке  
**Решение:** Автоматическое определение слабых устройств и оптимизация  

---

## 🎯 Что нужно сделать (2 минуты)

### Шаг 1: Добавить import в ClientLayout.tsx

Открой файл: **`app/ClientLayout.tsx`**

**Найди строку 28** (после других imports):
```typescript
import type { AnimatedLayoutShellProps } from '@/components/layout/AnimatedLayoutShell';
```

**Добавь после неё:**
```typescript
import { usePerformanceMode } from '@/hooks/usePerformanceMode';
```

---

### Шаг 2: Вызвать хук в ClientLayout

**Найди строку 175** (функция ClientLayout):
```typescript
export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Initialize on client side
```

**Добавь после `pathname`:**
```typescript
  // Enable performance mode for weak devices
  usePerformanceMode();
```

**Результат:**
```typescript
export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // Enable performance mode for weak devices
  usePerformanceMode();

  // Initialize on client side
  useEffect(() => {
```

---

## ✅ Что это даёт

### На слабых устройствах (Huawei без GPU):

1. **Автоматически определяет:**
   - CPU cores <= 2
   - RAM <= 2GB

2. **Автоматически включает:**
   - `lite-mode` класс на `<body>`
   - 70% меньше монеток (4 вместо 12)
   - Отключение тяжёлых анимаций
   - GPU acceleration для оставшихся монеток

3. **Результат:**
   - Монетки летят нормально (не 5-7x быстрее)
   - Кнопки моргают медленнее
   - Общая производительность лучше

---

## 🧪 Как проверить

После добавления кода:

1. **Открой DevTools → Console**
2. **Должны увидеть логи:**
   ```
   [Performance Mode] Device detection: { cores: 2, memory: 2, isWeak: true }
   [Performance Mode] Lite mode enabled automatically
   ```

3. **Инспектируй `<body>`:**
   - Должен быть класс `lite-mode`

4. **Посчитай монетки:**
   - Инспектируй DOM
   - Найди `.animate-coin-fall`
   - Должно быть 4-6 монеток (вместо 12-20)

---

## 📊 Что уже готово

✅ **CoinsAnimation оптимизирован** - автоматически снижает количество монеток  
✅ **Hook usePerformanceMode** - определяет слабые устройства  
✅ **Lite-mode styles** - упрощает интерфейс на слабых устройствах  
✅ **Переводы на хинди** - диалоги кубов переведены  

⚠️ **Нужно:** Добавить 2 строки в ClientLayout.tsx (смотри выше)

---

## 🔍 Альтернатива - Ручной режим

Если автоматика не сработает, можно добавить кнопку:

```typescript
// Пример в настройках
import { usePerformanceMode } from '@/hooks/usePerformanceMode';

function Settings() {
  const { isLiteMode, toggleLiteMode } = usePerformanceMode();
  
  return (
    <button onClick={toggleLiteMode}>
      {isLiteMode ? '⚡ Lite Mode: ON' : '🎨 Lite Mode: OFF'}
    </button>
  );
}
```

---

## 📝 Файлы изменены

1. ✅ `components/coins-animation.tsx` - оптимизация монеток
2. ✅ `hooks/usePerformanceMode.ts` - hook для detection
3. ✅ `lib/locales/hi.json` - переводы на хинди
4. ⚠️ `app/ClientLayout.tsx` - **НУЖНО ДОБАВИТЬ ВРУЧНУЮ**

---

## 🎉 После этого

1. Пересобери проект: `npm run build`
2. Запусти: `npm run dev`
3. Открой на ноутбуке Huawei
4. Проверь что монетки летят нормально

**Готово!** 🚀

---

**Полная документация:** `ANIMATION_PERFORMANCE_FIX.md`
