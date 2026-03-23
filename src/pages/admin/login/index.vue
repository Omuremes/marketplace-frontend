<template>
  <div class="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow min-h-[300px]">
    <h2 class="text-2xl font-bold text-center mb-6">Вход для администраторов</h2>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Username (Email)</label>
        <input v-model="form.username" type="text" class="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Пароль</label>
        <input v-model="form.password" type="password" class="w-full border rounded px-3 py-2" required />
      </div>
      
      <button :disabled="loading" class="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition">
        {{ loading ? '...' : 'Войти' }}
      </button>
      <p v-if="errorMsg" class="text-red-500 text-sm text-center mt-2">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAdminApi } from '@/features/auth-admin'

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')

const form = ref({ username: '', password: '' })

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    const data = await authAdminApi.login(form.value.username, form.value.password)
    localStorage.setItem('access_token', data.access_token)
    router.push('/admin/products')
  } catch (err: any) {
    errorMsg.value = err.response?.data?.detail || 'Ошибка авторизации'
  } finally {
    loading.value = false
  }
}
</script>
