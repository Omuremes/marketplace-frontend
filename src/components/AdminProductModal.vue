<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div class="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
        <h2 class="text-xl font-bold">{{ isEdit ? 'Редактировать товар' : 'Создать товар' }}</h2>
        <button @click="close" class="text-gray-500 hover:text-black font-bold text-xl">&times;</button>
      </div>
      
      <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
        <form @submit.prevent="save" id="productForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Название</label>
            <input v-model="form.name" type="text" class="w-full border rounded px-3 py-2" required />
          </div>
          
          <div class="flex gap-4">
            <div class="w-1/2">
              <label class="block text-sm font-medium mb-1">Цена (сумма)</label>
              <input v-model.number="form.price" type="number" step="0.01" min="0" class="w-full border rounded px-3 py-2" required />
            </div>
            <div class="w-1/2">
              <label class="block text-sm font-medium mb-1">Валюта</label>
              <input v-model="form.currency" type="text" class="w-full border rounded px-3 py-2 bg-gray-100 placeholder-gray-500" readonly />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Остаток на складе</label>
            <input v-model.number="form.stock" type="number" min="0" class="w-full border rounded px-3 py-2" required />
          </div>

          <div class="border rounded p-4 bg-gray-50">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-bold text-gray-700">Характеристики</label>
              <button type="button" @click="addAttribute" class="text-blue-600 text-sm hover:underline font-medium">+ Добавить</button>
            </div>
            <div v-for="(attr, index) in form.attributes" :key="index" class="flex gap-2 mb-2 items-center">
              <input v-model="attr.key" placeholder="Ключ (напр. Цвет)" class="w-1/2 border rounded px-2 py-1.5 text-sm outline-blue-500" required />
              <input v-model="attr.value" placeholder="Значение (напр. Белый)" class="w-1/2 border rounded px-2 py-1.5 text-sm outline-blue-500" required />
              <button type="button" @click="removeAttribute(index)" class="text-red-500 hover:text-red-700 px-2 font-bold text-lg">&times;</button>
            </div>
            <p v-if="form.attributes.length === 0" class="text-sm text-gray-500 italic mt-2">Нет добавленных характеристик.</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Фотография товара (URL)</label>
            <input type="file" @change="handleFileChange" accept="image/*" class="w-full border rounded px-3 py-2 text-sm bg-white" />
            <p class="text-xs text-gray-500 mt-1">Изображение загрузится в S3 хранилище после сохранения.</p>
          </div>
          
          <p v-if="errorMsg" class="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">{{ errorMsg }}</p>
        </form>
      </div>
      
      <div class="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
        <button type="button" @click="close" class="px-5 py-2 text-gray-700 border rounded hover:bg-gray-100 font-medium transition">Отмена</button>
        <button type="submit" form="productForm" :disabled="loading" class="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition disabled:bg-blue-400">
          {{ loading ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { adminProductApi, type AdminProductResponse } from '@/entities/product'

const props = defineProps<{
  modelValue: boolean;
  product?: AdminProductResponse | null;
}>()

const emit = defineEmits(['update:modelValue', 'saved'])

const loading = ref(false)
const errorMsg = ref('')

const isEdit = computed(() => !!props.product)

const form = ref({
  name: '',
  price: 0,
  currency: 'RUB',
  stock: 0,
  attributes: [] as { key: string; value: string }[]
})

let selectedFile: File | null = null

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (props.product) {
      form.value = {
        name: props.product.name,
        price: props.product.price.amount,
        currency: props.product.price.currency,
        stock: props.product.stock,
        attributes: JSON.parse(JSON.stringify(props.product.attributes || []))
      }
    } else {
      form.value = {
        name: '',
        price: 0,
        currency: 'RUB',
        stock: 0,
        attributes: []
      }
    }
    selectedFile = null
    errorMsg.value = ''
  }
})

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile = target.files[0]
  }
}

const addAttribute = () => {
  form.value.attributes.push({ key: '', value: '' })
}

const removeAttribute = (index: number) => {
  form.value.attributes.splice(index, 1)
}

const close = () => {
  emit('update:modelValue', false)
}

const save = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    const payload = {
      name: form.value.name,
      price: { amount: Number(form.value.price), currency: form.value.currency },
      stock: Number(form.value.stock),
      attributes: form.value.attributes
    }
    
    let productId = ''
    if (isEdit.value && props.product) {
      productId = props.product.id
      await adminProductApi.update(productId, payload)
    } else {
      const res = await adminProductApi.create(payload)
      productId = res.id
    }
    
    if (selectedFile && productId) {
      await adminProductApi.uploadImage(productId, selectedFile)
    }
    
    emit('saved')
    close()
  } catch (e: any) {
    errorMsg.value = e.response?.data?.detail || 'Произошла ошибка при сохранении товара.'
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
</style>
