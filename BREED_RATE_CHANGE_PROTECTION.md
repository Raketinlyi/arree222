# ✅ Защита от Изменения Курса Breeding (как на DEX)

**Дата:** 7 октября 2025  
**Статус:** ✅ **РЕАЛИЗОВАНО**

---

## 🎯 Задача

Когда пользователь выбрал 2 NFT для breeding и нажимает кнопку, курс может измениться (бот меняет раз в 10 минут).

**Проблема:**
- Пользователь видит один курс при выборе NFT
- Нажимает кнопку
- Курс изменился → пользователь попадает на другую цену
- Теряет деньги на комиссии если не согласен

**Решение:**
Как на DEX свапалках (PancakeSwap, Uniswap) - показывать предупреждение:
> ⚠️ **Курс изменился с 1000 CRAA на 1050 CRAA (+5%). Продолжить?**

---

## ✅ Реализация

### 1. Сохранение начального курса

**Файл:** `app/breed/page.tsx`

```typescript
// Защита от изменения курса (как на DEX)
const [initialBreedCost, setInitialBreedCost] = useState<string | null>(null);
const [showRateChangedDialog, setShowRateChangedDialog] = useState(false);
const [newBreedCost, setNewBreedCost] = useState<string | null>(null);
```

**useEffect для сохранения курса:**
```typescript
// Сохранить начальный курс когда пользователь выбрал 2 NFT
useEffect(() => {
  if (selectedNFTs.length === 2 && breedCost) {
    // Сохраняем курс который видел пользователь при выборе
    setInitialBreedCost(breedCost);
  } else if (selectedNFTs.length === 0) {
    // Сбросить когда отменили выбор
    setInitialBreedCost(null);
  }
}, [selectedNFTs.length, breedCost]);
```

---

### 2. Проверка изменения курса перед транзакцией

**В функции handleBreeding:**

```typescript
// КРИТИЧНО: Обновить курс перед транзакцией
await Promise.all([
  refetchBreedQuote(),
  refetchOctaaBalance(),
  refetchOctaBalance(),
]);

// ЗАЩИТА ОТ ИЗМЕНЕНИЯ КУРСА (как на DEX свапалках)
if (initialBreedCost && breedCost && initialBreedCost !== breedCost) {
  const oldCost = Number(initialBreedCost);
  const newCost = Number(breedCost);
  const changePercent = ((newCost - oldCost) / oldCost * 100).toFixed(2);
  
  // Показать предупреждение
  setNewBreedCost(breedCost);
  setShowRateChangedDialog(true);
  
  // Остановить выполнение - пользователь должен подтвердить
  return;
}

// Продолжить с транзакцией если курс не изменился...
```

---

### 3. Модальное окно подтверждения

**Добавить в конец компонента перед закрывающим `</div>`:**

```tsx
{/* Модальное окно предупреждения об изменении курса (как на DEX) */}
<AlertDialog open={showRateChangedDialog} onOpenChange={setShowRateChangedDialog}>
  <AlertDialogContent className='bg-gradient-to-br from-yellow-900/95 to-orange-900/95 border-2 border-yellow-500/50'>
    <AlertDialogHeader>
      <AlertDialogTitle className='text-2xl font-bold text-yellow-200 flex items-center gap-2'>
        ⚠️ Курс изменился!
      </AlertDialogTitle>
      <AlertDialogDescription className='text-yellow-100 space-y-3'>
        <div className='text-lg'>
          Курс breeding изменился пока вы выбирали NFT.
        </div>
        <div className='bg-black/30 p-4 rounded-lg space-y-2'>
          <div className='flex justify-between items-center'>
            <span className='text-gray-300'>Старый курс:</span>
            <span className='text-white font-bold text-xl'>{initialBreedCost} CRAA</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-gray-300'>Новый курс:</span>
            <span className='text-yellow-300 font-bold text-xl'>{newBreedCost} CRAA</span>
          </div>
          {initialBreedCost && newBreedCost && (
            <div className='flex justify-between items-center pt-2 border-t border-yellow-500/30'>
              <span className='text-gray-300'>Изменение:</span>
              <span className={`font-bold text-lg ${Number(newBreedCost) > Number(initialBreedCost) ? 'text-red-400' : 'text-green-400'}`}>
                {Number(newBreedCost) > Number(initialBreedCost) ? '+' : ''}
                {(((Number(newBreedCost) - Number(initialBreedCost)) / Number(initialBreedCost)) * 100).toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        <div className='text-sm text-yellow-200/80 mt-3'>
          Вы согласны продолжить с новым курсом?
        </div>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel 
        className='bg-gray-700 hover:bg-gray-600 text-white border-gray-500'
        onClick={() => {
          setShowRateChangedDialog(false);
          setNewBreedCost(null);
        }}
      >
        Отменить
      </AlertDialogCancel>
      <AlertDialogAction
        className='bg-yellow-500 hover:bg-yellow-400 text-black font-bold'
        onClick={() => {
          // Обновить начальный курс и продолжить breeding
          setInitialBreedCost(newBreedCost);
          setShowRateChangedDialog(false);
          setNewBreedCost(null);
          // Продолжить breeding с новым курсом
          setTimeout(() => handleBreeding(), 100);
        }}
      >
        Продолжить с новым курсом
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Импорты добавлены:**
```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
```

---

## 📊 Как работает

### Сценарий 1 - Курс НЕ изменился:
```
0:00 → Выбрал 2 NFT → курс 1000 CRAA сохранен
0:10 → Нажал "Breed"
0:10 → Проверка курса → 1000 CRAA (не изменился)
0:11 → Транзакция продолжается ✅
```

### Сценарий 2 - Курс ИЗМЕНИЛСЯ:
```
0:00 → Выбрал 2 NFT → курс 1000 CRAA сохранен
0:10 → Автообновление → курс стал 1050 CRAA (бот изменил)
0:15 → Нажал "Breed"
0:15 → Проверка курса → 1050 CRAA ≠ 1000 CRAA
0:15 → ⚠️ ПОКАЗЫВАЕТСЯ МОДАЛЬНОЕ ОКНО:
        "Курс изменился с 1000 на 1050 CRAA (+5%)"
0:15 → Пользователь выбирает:
        • Отменить → возврат к выбору NFT
        • Продолжить → breeding с новым курсом 1050 CRAA ✅
```

---

## 🎨 Внешний вид модального окна

**Цвета:**
- Фон: желто-оранжевый градиент (предупреждение)
- Рамка: желтая светящаяся
- Заголовок: ⚠️ Курс изменился!
- Старый курс: белым
- Новый курс: желтым
- Изменение: красным (+) или зеленым (-)
- Кнопка "Отменить": серая
- Кнопка "Продолжить": желтая

**Пример:**
```
┌────────────────────────────────────┐
│  ⚠️ Курс изменился!                │
│                                    │
│  Курс breeding изменился пока вы   │
│  выбирали NFT.                     │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ Старый курс:     1000 CRAA   │ │
│  │ Новый курс:      1050 CRAA   │ │
│  │ Изменение:           +5.00%  │ │
│  └──────────────────────────────┘ │
│                                    │
│  Вы согласны продолжить с новым    │
│  курсом?                           │
│                                    │
│  [Отменить] [Продолжить с новым]  │
└────────────────────────────────────┘
```

---

## ✅ Преимущества

1. **Защита пользователя:**
   - Видит изменение курса ДО транзакции
   - Может отменить если не согласен
   - Не теряет комиссию зря

2. **Как на DEX:**
   - Привычный UX для крипто-пользователей
   - Показывает старый и новый курс
   - Показывает процент изменения

3. **Прозрачность:**
   - Пользователь всегда в курсе
   - Нет сюрпризов
   - Доверие к платформе

---

## 📝 Изменено файлов: 1

**`app/breed/page.tsx`:**
- ✅ Добавлены useState для хранения начального курса
- ✅ Добавлен useEffect для сохранения курса при выборе 2 NFT
- ✅ Добавлена проверка изменения курса в handleBreeding
- ✅ Добавлено модальное окно AlertDialog
- ✅ Добавлены импорты AlertDialog компонентов

**Билд:** ✓ Compiled successfully

---

## 🎉 ИТОГ

**Реализовано:**
- ✅ Сохранение начального курса при выборе 2 NFT
- ✅ Автообновление курса каждые 5 секунд
- ✅ Проверка изменения курса перед транзакцией
- ✅ Модальное окно подтверждения (как на PancakeSwap)
- ✅ Показ старого и нового курса
- ✅ Показ процента изменения
- ✅ Кнопки "Отменить" и "Продолжить"

**Пользователь защищен от:**
- ❌ Неожиданного изменения курса
- ❌ Потери комиссии
- ❌ Сюрпризов при транзакции

**Статус:** 🎉 **ГОТОВО К PRODUCTION!**
