<template>
  <div class="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow">
    <div class="flex border-b mb-6">
      <button 
        class="w-1/2 py-2 font-bold" 
        :class="isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'"
        @click="isLogin = true"
      >Вход</button>
      <button 
        class="w-1/2 py-2 font-bold" 
        :class="!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'"
        @click="isLogin = false"
      >Регистрация</button>
    </div>

    <!-- Общая форма входа и регистрации -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="!isLogin">
        <label class="block text-sm font-medium mb-1">Имя (Название магазина)</label>
        <input v-model="form.name" type="text" class="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input v-model="form.email" type="email" class="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Пароль</label>
        <input v-model="form.password" type="password" class="w-full border rounded px-3 py-2" required />
      </div>
      
      <button class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" :disabled="loading">
        {{ loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться') }}
      </button>
      
      <p v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authSellerApi } from '@/features/auth-seller'
import { useSessionStore } from '@/entities/session/model/store'

const router = useRouter()
const session = useSessionStore()
const isLogin = ref(true)
const loading = ref(false)
const errorMsg = ref('')

const form = ref({
  name: '',
  email: '',
  password: ''
})

const handleSubmit = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    if (isLogin.value) {
      const data = await authSellerApi.login(form.value.email, form.value.password)
      session.setAuth(data.access_token)
    } else {
      const data = await authSellerApi.register(form.value.name, form.value.email, form.value.password)
      session.setAuth(data.access_token)
    }
    router.push('/')
  } catch (err: any) {
    errorMsg.value = err.response?.data?.detail || 'Ошибка авторизации'
  } finally {
    loading.value = false
  }
}
</script>
