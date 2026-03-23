<template>
  <div class="public-layout">
    <Header />
    <main class="container mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
</script>
