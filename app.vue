<template>
  <VApp>
    <OrganismsNavbar /> 
    <br>
    <br>

    <NuxtLayout>
      <br>
      <NuxtPage />
    </NuxtLayout>
  </VApp>
</template>

<script setup lang="ts">
// Asegura que los íconos de Vuetify (MDI) estén cargados globalmente
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
    },
  ],
})
</script>