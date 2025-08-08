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
   # Создайте .env файл
   echo "NUXT_GITHUB_TOKEN=ghp_your_token_here" > .env
   echo "NUXT_GITHUB_ENDPOINT=https://models.github.ai/inference" >> .env
   echo "NUXT_GITHUB_MODEL=openai/gpt-5" >> .env
   ```

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
