
<template>
  <v-pagination  
    v-model="pageLocal" 
    :length="pages" 
    :total-visible="6"
    @update:model-value="change" 
  />
</template>

<script setup lang="ts">
const props = defineProps({
  page: { type: Number, required: true },
  pages: { type: Number, required: true }
})
const emit = defineEmits(['update:page'])

const pageLocal = ref(props.page)

watch(() => props.page, (v) => (pageLocal.value = v))

const change = (p: number) => {
  emit('update:page', p)
}
</script>