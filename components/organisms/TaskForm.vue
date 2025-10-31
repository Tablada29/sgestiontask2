<template>
  <v-dialog v-model="open" max-width="800">
    <template #activator="{ props }">
      <slot name="activator" v-bind="props" />
    </template>

    <v-card>
      <v-card-title>{{ isEdit ? 'Editar tarea' : 'Nueva tarea' }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid">
          <v-text-field v-model="form.title" label="Titulo" :rules="[v => !!v || 'Titulo es obligatorio']" required />
          <v-textarea v-model="form.description" label="Descripción" rows="3" />
          <v-text-field v-model="form.date" label="Fecha de Vencimiento (YYYY-MM-DD)" placeholder="YYYY-MM-DD" />
          <v-text-field v-model="tagsString" label="Tags (separados por comas)" />
          <v-textarea v-model="form.comments" label="Comentarios" rows="2" />
          <v-switch v-model="form.completed" label="Completada" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancelar</v-btn>
        <v-btn :disabled="!valid" color="primary" @click="submit">{{ isEdit ? 'Guardar Cambios' : 'Crear Tarea' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import type { PropType } from 'vue'; // PropType importado 

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  task: { type: Object as PropType<any>, default: null } // Usar PropType<any>
})
const emit = defineEmits(['update:modelValue', 'save'])

// Control del Diálogo (v-model)
const open = ref(props.modelValue)
watch(() => props.modelValue, (v) => (open.value = v))
watch(open, (v) => emit('update:modelValue', v))

const isEdit = computed(() => !!props.task)
const formRef = ref<any>(null)
const valid = ref(false)

const form = reactive({
  title: '',
  description: '',
  date: '',
  comments: '',
  tags: [] as string[],
  completed: false
})

const tagsString = computed({
  get: () => form.tags.join(', '),
  set: (v: string) => (form.tags = v.split(',').map(s => s.trim()).filter(Boolean))
})

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.date = ''
  form.comments = ''
  form.tags = []
  form.completed = false
  if (formRef.value) formRef.value.resetValidation()
}

// Carga los datos de la tarea a editar
watch(() => props.task, (t) => {
  if (t) {
    form.title = t.title || ''
    form.description = t.description || ''
    form.date = t.due_date || t.date || '' 
    form.comments = t.comments || ''
    // e tags siempre sea un array
    form.tags = Array.isArray(t.tags) 
        ? t.tags 
        : (typeof t.tags === 'string' && t.tags ? t.tags.split(',').map((s: string) => s.trim()) : [])
    // Mapeo correcto para '1'/'0'
    form.completed = t.is_completed === '1' || t.is_completed === 1 || !!t.completed;
  } else {
    form.completed = false;
    resetForm()
  }
}, { immediate: true })

const close = () => {
  open.value = false
  //  tiempo a la animación para que el formulario se borre
  setTimeout(resetForm, 300) 
}

const submit = async () => {
  // Asegurar que la validación ocurra
  const { valid: formValid } = await formRef.value.validate()
  if (!formValid) return
  
  const payload = {
    ...form,
    date: form.date || '', 
    completed: !!form.completed // Asegurar que es booleano
  }

  // evento 'save'. responsable de hacer la llamada a la API y recargar.
  emit('save', payload)
}
</script>