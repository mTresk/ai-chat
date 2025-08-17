<script setup lang="ts">
interface Emits {
  (e: 'sendExample', content: string): void
}

defineEmits<Emits>()

const examples = [
  'Объясни, что такое машинное обучение',
  'Помоги написать функцию на JavaScript',
  'Как приготовить идеальную пасту?',
  'Расскажи интересный факт о космосе',
  'Помоги составить план изучения нового языка',
  'Что такое квантовая физика простыми словами?',
]
</script>

<template>
  <div class="welcome-screen">
    <div class="welcome-screen__body">
      <h2 class="welcome-screen__title">
        Спроси меня о чем угодно...
      </h2>
      <div class="welcome-screen__buttons">
        <button
          v-for="example in examples"
          :key="example"
          class="welcome-screen__button"
          type="button"
          :title="example"
          :aria-label="example"
          @click="$emit('sendExample', example)"
          @keydown.enter.prevent="$emit('sendExample', example)"
          @keydown.space.prevent="$emit('sendExample', example)"
        >
          {{ example }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-block: rem(16);

  &__body {
    display: grid;
    gap: rem(40);
    justify-items: center;
    text-align: center;
  }

  &__title {
    font-size: rem(30);
    font-weight: 500;
    line-height: 125%;
  }

  &__buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;

    @include adaptive-value('gap', 12, 6);

    @media (max-width: $mobileSmall) {
      grid-template-columns: 1fr;
    }
  }

  &__button {
    padding: rem(16);
    font-size: rem(14);
    background-color: transparent;
    border: rem(1) solid var(--color-gray);
    border-radius: rem(8);
    transition: background-color 0.3s ease-in-out;

    @media (any-hover: hover) {
      &:hover {
        background-color: var(--color-gray);
      }
    }
  }
}
</style>
