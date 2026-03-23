<template>
  <div class="product-details max-w-4xl mx-auto bg-white p-6 rounded shadow mt-6">
    <div v-if="loading" class="text-center py-10 text-gray-500">Загрузка информации о товаре...</div>
    <div v-else-if="product" class="flex flex-col md:flex-row gap-8">
      <div class="md:w-1/2">
        <div class="w-full h-96 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
          <img v-if="product.image_url" :src="product.image_url" class="object-cover h-full w-full" :alt="product.name" />
          <span v-else class="text-gray-400">Нет фото</span>
        </div>
      </div>
      <div class="md:w-1/2">
        <h1 class="text-3xl font-bold mb-4">{{ product.name }}</h1>
        <p v-if="product.offers.length" class="text-2xl text-blue-600 mb-6">
          от {{ minPrice }} {{ product.offers[0].price.currency }}
        </p>
        <p v-else class="text-2xl text-gray-500 mb-6">Нет в наличии</p>
        
        <div class="mb-6" v-if="product.attributes && product.attributes.length > 0">
          <h3 class="font-bold border-b pb-2 mb-2">Характеристики</h3>
          <ul>
            <li v-for="attr in product.attributes" :key="attr.key" class="py-1">
              <span class="text-gray-600 w-24 inline-block font-medium">{{ attr.key }}:</span> {{ attr.value }}
            </li>
          </ul>
        </div>
        
        <div>
          <h3 class="font-bold border-b pb-2 mb-2">Предложения продавцов ({{ product.offers.length }})</h3>
          <div v-if="product.offers.length === 0" class="text-gray-500 py-2">Сейчас нет доступных предложений</div>
          <div v-else v-for="offer in product.offers" :key="offer.id" class="border p-4 rounded mb-2 hover:bg-gray-50 flex justify-between items-center transition">
            <div>
              <p class="font-bold">{{ offer.seller.name }} <span class="text-yellow-500 text-sm ml-1">★ {{ offer.seller.rating }}</span></p>
              <p class="text-sm text-gray-500">Доставка: {{ offer.delivery_date }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-lg text-blue-600">{{ offer.price.amount }} {{ offer.price.currency }}</p>
              <button class="bg-gray-900 text-white px-3 py-1 mt-1 text-sm rounded hover:bg-gray-800 transition">В корзину</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-10 text-red-500 font-bold">Товар не найден</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { productApi, type ProductDetails } from '@/entities/product'

const route = useRoute()
const loading = ref(true)
const product = ref<ProductDetails | null>(null)

const minPrice = computed(() => {
  if (!product.value || product.value.offers.length === 0) return 0;
  return Math.min(...product.value.offers.map(o => o.price.amount));
})

onMounted(async () => {
  const id = route.params.id as string;
  try {
    product.value = await productApi.getProductDetails(id);
  } catch (error) {
    console.error('Failed to load product details', error);
  } finally {
    loading.value = false;
  }
})
</script>
