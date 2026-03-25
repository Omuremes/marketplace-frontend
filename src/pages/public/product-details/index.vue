<template>
  <div class="product-details max-w-7xl mx-auto p-4 md:p-6 mt-4">
    <div v-if="loading" class="text-center py-10 text-gray-500">Загрузка информации о товаре...</div>
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
      <div class="lg:col-span-3">
        <div class="w-full h-128 bg-slate-200/70 rounded-2xl flex items-center justify-center overflow-hidden sticky top-6 border border-slate-200">
          <img v-if="product.image_url" :src="product.image_url" class="object-contain h-full w-full" :alt="product.name" />
          <span v-else class="text-slate-500 font-semibold">Фото товара</span>
        </div>
      </div>

      <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 md:p-6">
        <h1 class="text-3xl leading-tight font-extrabold text-slate-900 mb-2">{{ product.name }}</h1>
        <div class="flex items-center gap-3 mb-4">
          <p class="text-amber-500 text-sm">★★★★☆</p>
          <p class="text-slate-500 text-sm">({{ averageRating.toFixed(1) }})</p>
        </div>

        <p class="text-sm text-slate-500 mb-5">Артикул: {{ product.id.slice(0, 8).toUpperCase() }}</p>

        <div class="space-y-2 mb-5" v-if="attributesForDisplay.length > 0">
          <div
            v-for="attr in attributesForDisplay"
            :key="attr.key"
            class="grid grid-cols-2 gap-3 text-sm"
          >
            <span class="text-slate-500">{{ attr.key }}</span>
            <span class="font-semibold text-slate-800">{{ attr.value }}</span>
          </div>
        </div>

      </div>

      <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 md:p-5">
        <div class="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
          <p class="text-sm text-slate-500">Сортировка:</p>
          <div class="flex items-center gap-2">
            <button
              @click="setSort('price')"
              class="px-3 py-1 rounded-full text-xs font-semibold transition"
              :class="sortBy === 'price' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              По цене
            </button>
            <button
              @click="setSort('delivery_date')"
              class="px-3 py-1 rounded-full text-xs font-semibold transition"
              :class="sortBy === 'delivery_date' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              По дате доставки
            </button>
          </div>
        </div>

        <p v-if="product.offers.length === 0" class="text-gray-500 py-2">Сейчас нет доступных предложений</p>
        <div v-else class="max-h-128 overflow-y-auto pr-1 space-y-2">
          <div
            v-for="offer in product.offers"
            :key="offer.id"
            class="border border-slate-200 p-3 rounded-xl hover:bg-slate-50 flex justify-between items-start transition"
          >
            <div>
              <p class="font-bold text-slate-800">{{ offer.seller.name }}</p>
              <p class="text-xs text-slate-500 mt-1">Рейтинг {{ offer.seller.rating.toFixed(1) }} • {{ formatDelivery(offer.delivery_date) }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="font-extrabold text-slate-900">{{ offer.price.amount }} {{ offer.price.currency }}</p>
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
const sortBy = ref<'price' | 'delivery_date'>('price')

const averageRating = computed(() => {
  if (!product.value || product.value.offers.length === 0) return 0;
  const sum = product.value.offers.reduce((acc, offer) => acc + offer.seller.rating, 0);
  return sum / product.value.offers.length;
});

const attributesForDisplay = computed(() => {
  if (!product.value) return [];
  return product.value.attributes.filter((attr) => {
    const key = attr.key.toLowerCase().trim();
    return key !== 'description' && key !== 'описание';
  });
});

const fetchDetails = async () => {
  const id = route.params.id as string;
  loading.value = true;
  try {
    product.value = await productApi.getProductDetails(id, sortBy.value);
  } catch (error) {
    console.error('Failed to load product details', error);
  } finally {
    loading.value = false;
  }
}

const setSort = (mode: 'price' | 'delivery_date') => {
  if (sortBy.value === mode) return;
  sortBy.value = mode;
  fetchDetails();
}

const formatDelivery = (dateValue: string) => {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return parsed.toLocaleDateString('ru-RU');
}

onMounted(() => {
  fetchDetails();
})
</script>
