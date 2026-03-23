<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h1 class="text-2xl font-bold">Список товаров</h1>
      <div class="flex gap-2 w-full md:w-1/2 justify-end">
        <input 
          v-model="searchQuery" 
          @keyup.enter="handleSearch"
          type="text" 
          placeholder="Поиск по названию..." 
          class="w-64 border rounded px-3 py-2 outline-blue-500" 
        />
        <button @click="handleSearch" class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition">
          Найти
        </button>
        <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition whitespace-nowrap">
          + Создать
        </button>
      </div>
    </div>
    
    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b">
            <th class="p-4">ID</th>
            <th class="p-4 flex gap-4">Фото / Название</th>
            <th class="p-4">Цена</th>
            <th class="p-4">Остаток</th>
            <th class="p-4">Действия</th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <tr v-for="item in items" :key="item.id" class="border-b hover:bg-gray-50 transition">
            <td class="p-4 text-sm text-gray-500 font-mono">{{ item.id.split('-')[0] }}...</td>
            <td class="p-4 flex items-center gap-4">
              <img v-if="item.thumbnail_url" :src="item.thumbnail_url" class="w-10 h-10 rounded object-cover border bg-white" />
              <div v-else class="w-10 h-10 rounded bg-gray-200 border"></div>
              <span class="text-blue-600 font-medium hover:underline cursor-pointer" @click="openEditModal(item)">{{ item.name }}</span>
            </td>
            <td class="p-4 whitespace-nowrap">{{ item.price.amount }} {{ item.price.currency }}</td>
            <td class="p-4">{{ item.stock }} шт</td>
            <td class="p-4 space-x-2">
              <button @click="openEditModal(item)" class="text-blue-500 hover:text-blue-700 text-sm font-medium">Изменить</button>
              <button @click="openDeleteModal(item)" class="text-red-500 hover:text-red-700 text-sm font-medium">Удалить</button>
            </td>
          </tr>
          <tr v-if="items.length === 0">
             <td colspan="5" class="p-4 text-center py-10 text-gray-500">Товары по вашему запросу не найдены.</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr><td colspan="5" class="p-4 text-center text-gray-400 py-10">Загрузка данных...</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Модалки -->
    <AdminProductModal 
      v-model="showProductModal" 
      :product="selectedProduct" 
      @saved="loadProducts" 
    />
    
    <ConfirmModal 
      v-model="showDeleteModal" 
      :loading="deleteLoading"
      title="Удаление товара"
      :message="`Вы действительно хотите удалить товар «${productToDelete?.name}»? Это действие необратимо и товар будет стерт из базы.`"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminProductApi, type AdminProductResponse } from '@/entities/product/index'
import AdminProductModal from '@/components/AdminProductModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const items = ref<AdminProductResponse[]>([])
const loading = ref(true)
const searchQuery = ref('')

// Управление состоянием модальных окон
const showProductModal = ref(false)
const selectedProduct = ref<AdminProductResponse | null>(null)

const showDeleteModal = ref(false)
const productToDelete = ref<AdminProductResponse | null>(null)
const deleteLoading = ref(false)

const loadProducts = async () => {
  loading.value = true
  try {
    const data = await adminProductApi.getList(50, null, searchQuery.value)
    items.value = data.items
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  loadProducts()
}

const openCreateModal = () => {
  selectedProduct.value = null
  showProductModal.value = true
}

const openEditModal = (item: AdminProductResponse) => {
  selectedProduct.value = item
  showProductModal.value = true
}

const openDeleteModal = (item: AdminProductResponse) => {
  productToDelete.value = item
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!productToDelete.value) return;
  deleteLoading.value = true
  try {
    const id = productToDelete.value.id
    await adminProductApi.delete(id)
    items.value = items.value.filter(i => i.id !== id)
    showDeleteModal.value = false
  } catch (e) {
    alert('Возникла ошибка при удалении')
  } finally {
    deleteLoading.value = false
  }
}

onMounted(() => {
  loadProducts()
})
</script>
