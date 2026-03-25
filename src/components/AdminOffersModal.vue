<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <div class="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
        <div>
          <h2 class="text-xl font-bold">Управление предложениями</h2>
          <p class="text-sm text-gray-500 mt-1" v-if="product">Товар: {{ product.name }}</p>
        </div>
        <button @click="close" class="text-gray-500 hover:text-black font-bold text-xl">&times;</button>
      </div>

      <div class="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
        <div class="border rounded-lg p-4 bg-gray-50">
          <h3 class="font-semibold mb-3">{{ editOfferId ? 'Редактировать предложение' : 'Создать предложение' }}</h3>
          <form class="grid grid-cols-1 md:grid-cols-4 gap-3 items-end" @submit.prevent="saveOffer">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1">Продавец</label>
              <select v-model="form.seller_id" class="w-full border rounded px-3 py-2" required>
                <option value="" disabled>Выберите продавца</option>
                <option v-for="seller in sellers" :key="seller.id" :value="seller.id">
                  {{ seller.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Цена</label>
              <input v-model.number="form.amount" type="number" min="0" step="0.01" class="w-full border rounded px-3 py-2" required />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Валюта</label>
              <select v-model="form.currency" class="w-full border rounded px-3 py-2 bg-white">
                <option v-for="currency in currencyOptions" :key="currency" :value="currency">
                  {{ currency }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Дата доставки</label>
              <input v-model="form.delivery_date" type="date" class="w-full border rounded px-3 py-2" required />
            </div>

            <div class="md:col-span-3 flex gap-2 justify-end">
              <button
                v-if="editOfferId"
                type="button"
                @click="resetForm"
                class="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Отмена
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {{ saving ? 'Сохранение...' : editOfferId ? 'Сохранить' : 'Создать' }}
              </button>
            </div>
          </form>
          <p v-if="formError" class="text-red-600 text-sm mt-2">{{ formError }}</p>
        </div>

        <div class="border rounded-lg overflow-hidden">
          <div class="p-3 bg-gray-50 border-b font-semibold">Список предложений</div>

          <div v-if="loading" class="p-6 text-center text-gray-500">Загрузка предложений...</div>
          <div v-else-if="offers.length === 0" class="p-6 text-center text-gray-500">Для этого товара пока нет предложений.</div>

          <table v-else class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b">
                <th class="p-3">Продавец</th>
                <th class="p-3">Цена</th>
                <th class="p-3">Доставка</th>
                <th class="p-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="offer in offers" :key="offer.id" class="border-b hover:bg-gray-50">
                <td class="p-3 text-sm text-gray-700">{{ offer.seller_name || offer.seller_id.slice(0, 8) + '...' }}</td>
                <td class="p-3">{{ offer.price.amount }} {{ offer.price.currency }}</td>
                <td class="p-3">{{ offer.delivery_date }}</td>
                <td class="p-3 space-x-3">
                  <button class="text-blue-600 hover:text-blue-800 text-sm" @click="startEdit(offer)">Изменить</button>
                  <button class="text-red-600 hover:text-red-800 text-sm" @click="removeOffer(offer.id)">Удалить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="p-4 border-t bg-gray-50 flex justify-end rounded-b-lg">
        <button @click="close" class="px-5 py-2 text-gray-700 border rounded hover:bg-gray-100 font-medium transition">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  adminProductApi,
  type AdminOfferPayload,
  type AdminOfferResponse,
  type AdminProductResponse,
  type AdminSellerResponse,
} from '@/entities/product'

const props = defineProps<{
  modelValue: boolean
  product: AdminProductResponse | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const offers = ref<AdminOfferResponse[]>([])
const sellers = ref<AdminSellerResponse[]>([])
const loading = ref(false)
const saving = ref(false)
const formError = ref('')
const editOfferId = ref<string | null>(null)
const currencyOptions = ['RUB', 'USD', 'EUR', 'KZT', 'CNY']

const form = ref({
  seller_id: '',
  amount: 0,
  currency: 'RUB',
  delivery_date: '',
})

const resetForm = () => {
  editOfferId.value = null
  form.value = {
    seller_id: '',
    amount: 0,
    currency: 'RUB',
    delivery_date: '',
  }
  formError.value = ''
}

const loadData = async () => {
  if (!props.product) return
  loading.value = true
  formError.value = ''

  try {
    const [offersData, sellersData] = await Promise.all([
      adminProductApi.listOffers(props.product.id),
      adminProductApi.listSellers(),
    ])
    offers.value = offersData
    sellers.value = sellersData
  } catch (e: any) {
    formError.value = e?.response?.data?.detail || 'Не удалось загрузить предложения'
  } finally {
    loading.value = false
  }
}

const saveOffer = async () => {
  if (!props.product) return

  saving.value = true
  formError.value = ''

  const payload: AdminOfferPayload = {
    seller_id: form.value.seller_id,
    price: {
      amount: Number(form.value.amount),
      currency: form.value.currency,
    },
    delivery_date: form.value.delivery_date,
  }

  try {
    if (editOfferId.value) {
      await adminProductApi.updateOffer(editOfferId.value, payload)
    } else {
      await adminProductApi.createOffer(props.product.id, payload)
    }

    await loadData()
    resetForm()
  } catch (e: any) {
    formError.value = e?.response?.data?.detail || 'Ошибка сохранения предложения'
  } finally {
    saving.value = false
  }
}

const startEdit = (offer: AdminOfferResponse) => {
  editOfferId.value = offer.id
  form.value = {
    seller_id: offer.seller_id,
    amount: offer.price.amount,
    currency: offer.price.currency,
    delivery_date: offer.delivery_date,
  }
  formError.value = ''
}

const removeOffer = async (offerId: string) => {
  if (!confirm('Удалить это предложение?')) return

  try {
    await adminProductApi.deleteOffer(offerId)
    offers.value = offers.value.filter((offer) => offer.id !== offerId)
  } catch (e: any) {
    formError.value = e?.response?.data?.detail || 'Ошибка удаления предложения'
  }
}

const close = () => {
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (!isOpen) return
    resetForm()
    await loadData()
  }
)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
</style>
