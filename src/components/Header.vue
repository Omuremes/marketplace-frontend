<template>
  <header class="bg-blue-600 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">Магазин</h1>
      <nav class="flex items-center">
        <router-link to="/" class="mr-4 hover:underline">Товары</router-link>
        
        <template v-if="session.isAuth">
          <button @click="handleLogout" class="text-sm border px-2 py-1 rounded hover:bg-white hover:text-blue-600 transition">Выход</button>
        </template>
        <template v-else>
          <router-link to="/auth" class="text-sm border px-2 py-1 rounded hover:bg-white hover:text-blue-600 transition">Для продавцов</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/entities/session/model/store'
import { useRouter } from 'vue-router'

const session = useSessionStore()
const router = useRouter()

const handleLogout = () => {
  session.logout()
  router.push('/')
}
</script>
