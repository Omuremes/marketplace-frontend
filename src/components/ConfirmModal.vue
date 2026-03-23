<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-sm">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-3">{{ title }}</h2>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        
        <div class="flex justify-end gap-3">
          <button @click="cancel" :disabled="loading" class="px-4 py-2 border rounded hover:bg-gray-100 transition disabled:opacity-50">
            Отмена
          </button>
          <button @click="confirm" :disabled="loading" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium disabled:opacity-50">
            {{ loading ? 'Удаление...' : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: 'Подтверждение' },
  message: { type: String, default: 'Данное действие необратимо. Продолжить?' },
  confirmText: { type: String, default: 'Удалить' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const cancel = () => {
  if (props.loading) return;
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm')
}
</script>
