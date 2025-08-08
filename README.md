# TreskAI

Веб-приложение для общения с искусственным интеллектом через GitHub Models API.

## Возможности

- 💬 Чат с AI через GitHub Models
- 💾 Сохранение истории в браузере
- 🔢 Множественные диалоги
- 📝 Подсветка кода

## Быстрый старт

1. **Установка**
   ```bash
   npm install
   ```

2. **GitHub токен**
   - Создайте токен на [github.com/settings/tokens](https://github.com/settings/tokens)
   - Добавьте права: `models`

3. **Настройка**
   ```bash
   cp .env.example .env
   ```
   Затем откройте `.env` и укажите значение переменной `NUXT_GITHUB_TOKEN`.

4. **Запуск**
   ```bash
   npm run dev
   ```

## Технологии

- **Frontend**: Nuxt 4, Vue 3, TypeScript
- **AI**: GitHub Models API
- **Стили**: Tailwind CSS
- **Хранение**: IndexedDB

---

**TreskAI** использует [GitHub Models](https://github.com/features/models) для безопасного доступа к AI-моделям.
