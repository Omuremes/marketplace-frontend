<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h2 class="text-2xl font-bold">Каталог товаров</h2>
      <div class="w-full md:w-1/3 flex gap-2">
        <input 
          v-model="searchQuery" 
          @keyup.enter="handleSearch"
          type="text" 
          placeholder="Поиск по названию..." 
          class="flex-1 border rounded px-3 py-2 outline-blue-500" 
        />
        <button @click="handleSearch" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Найти
        </button>
      </div>
    </div>
    
    <div v-if="loading && items.length === 0" class="text-center text-gray-500 py-10">Загрузка товаров...</div>
    <div v-else-if="items.length === 0" class="text-center text-gray-500 py-10">Ничего не найдено</div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="item in items" :key="item.id" class="border p-4 rounded shadow hover:shadow-lg transition flex flex-col">
        <div class="h-48 bg-gray-100 mb-4 rounded flex items-center justify-center overflow-hidden relative">
          <img v-if="item.thumbnail_url" :src="item.thumbnail_url" class="object-contain h-full w-full" :alt="item.name" />
          <span v-else class="text-gray-400">Нет фото</span>
        </div>
        <h3 class="font-bold text-lg mb-2 line-clamp-2 leading-tight">{{ item.name }}</h3>
        <p class="text-xl text-blue-600 mb-2 font-bold">{{ item.price.amount }} {{ item.price.currency }}</p>
        
        <p v-if="item.nearest_delivery_date" class="text-sm text-gray-500 mb-4">
          Ближайшая доставка: {{ formatDelivery(item.nearest_delivery_date) }}
        </p>
        <p v-else class="text-sm text-gray-500 mb-4 mt-auto">Нет предложений</p>
        
        <router-link :to="`/product/${item.id}`" class="mt-auto text-center w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition">
          Подробнее
        </router-link>
      </div>
    </div>
    
    <div v-if="nextCursor && !loading" class="mt-8 text-center">
      <button @click="loadMore" class="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300 transition font-medium text-gray-700">
        Загрузить еще
      </button>
    </div>
    <div v-else-if="loading && items.length > 0" class="mt-8 text-center text-gray-500">
      Загрузка...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productApi, type ProductListItem } from '@/entities/product'

const items = ref<ProductListItem[]>([])
const nextCursor = ref<string | null>(null)
const loading = ref(false)
const searchQuery = ref('')

const formatDelivery = (dateValue: string) => {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return parsed.toLocaleDateString('ru-RU');
}

const fetchProducts = async (cursor: string | null = null, search: string | null = null) => {
  if (loading.value) return;
  loading.value = true;
  try {
    const data = await productApi.getPublicProducts(12, cursor, search);
    if (!cursor) {
      items.value = data.items;
    } else {
      items.value.push(...data.items);
    }
    nextCursor.value = data.next_cursor || null;
  } catch (error) {
    console.error('Failed to fetch products', error);
  } finally {
    loading.value = false;
  }
}

const handleSearch = () => {
  nextCursor.value = null;
  fetchProducts(null, searchQuery.value);
}

const loadMore = () => {
  if (nextCursor.value) {
    fetchProducts(nextCursor.value, searchQuery.value);
  }
}

onMounted(() => {
  fetchProducts();
})
</script>
