<template>
  <div class="admin-layout flex h-screen bg-gray-100">
    <aside class="w-64 bg-gray-900 text-white p-4 flex flex-col">
      <h2 class="text-lg font-bold mb-6">Админ Панель</h2>
      <nav class="flex-1">
        <router-link to="/admin/products" class="block py-2 hover:bg-gray-800 rounded px-2">Товары</router-link>
      </nav>
      <button @click="logout" class="mt-auto py-2 text-left hover:text-red-400">Выход</button>
    </aside>
    <main class="flex-1 p-8 overflow-y-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('access_token')
  router.push('/admin/login')
}
</script>
