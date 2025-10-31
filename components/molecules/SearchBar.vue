<template>
  <v-text-field
    v-model="q"
    :label="label"
    clearable
    append-icon="mdi-magnify"
    variant="solo-filled"
    density="comfortable"
    @keyup.enter="submit"
    @click:append="submit"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Buscar tareas por título, descripción o tags...' }
})
const emit = defineEmits(['update:modelValue', 'search'])

const q = ref(props.modelValue)
watch(q, (v) => emit('update:modelValue', v))
watch(() => props.modelValue, (v) => q.value = v)

const submit = () => {
  emit('search', q.value || '')
}
</script>