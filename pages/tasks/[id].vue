<template>
  <v-container>
    <v-btn text class="mb-4" @click="$router.back()">Volver al listado</v-btn>
    
    <v-card v-if="task && !loading" class="mt-4">
      <v-card-title class="d-flex align-center">
        <div>
          <h3 class="text-h5">{{ task.title }}</h3>
          <div class="text-subtitle-1 text-medium-emphasis">
            {{ dateString || 'Sin fecha de vencimiento' }}
          </div>
        </div>
        <v-spacer />
        
        <v-chip 
          :color="isCompleted ? 'success' : 'orange'" 
          label 
          size="small"
          class="hidden-sm-and-down"
        >
          {{ isCompleted ? 'Completada' : 'Pendiente' }}
        </v-chip>
      </v-card-title>

      <v-card-text>
        <v-divider class="my-3" />
        <p class="mb-2"><strong>Descripción:</strong></p>
        <p class="text-body-1">{{ task.description || 'No hay descripción.' }}</p>
        
        <v-divider class="my-3" />
        <p class="mb-2"><strong>Comentarios:</strong></p>
        <p class="text-body-1">{{ task.comments || 'No hay comentarios.' }}</p>

        <v-divider class="my-3" />
        <div v-if="tagsArray.length"> 
          <strong>Tags:</strong>
          <v-chip v-for="t in tagsArray" :key="t" class="ma-1">{{ t }}</v-chip>
        </div>
        <p v-else><strong>Tags:</strong> -</p>
      </v-card-text>
    </v-card>

    <v-alert v-else-if="!task && !loading" type="error" class="mt-4">
      No se encontró la tarea con ID: {{ id }}.
    </v-alert>

    <v-skeleton-loader v-if="loading" type="article, actions" class="mt-4" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTasks } from '@/composables/useTasks' // si cambia tu ruta real se debe ajustar

const route = useRoute()
const id = route.params.id as string
const tasksApi = useTasks()
const task = ref<any>(null)
const loading = ref(true)

// Fecha de vencimiento o fecha alternativa
const dateString = computed(() => task.value?.due_date || task.value?.date)

// Procesar tags si existen
const tagsArray = computed(() => {
  if (!task.value) return []
  const tags = task.value.tags || task.value.tag
  if (typeof tags === 'string') {
    return tags.split(',').map((s: string) => s.trim()).filter(Boolean)
  }
  return Array.isArray(tags) ? tags : []
})

const isCompleted = computed(() => {
  if (!task.value) return false
  return task.value.is_completed === 1 || task.value.is_completed === '1'
})

onMounted(async () => {
  try {
    const apiResponse: any = await tasksApi.getOne(id)

    //  si la respuesta viene en un array o dentro de índice 0
    const data = Array.isArray(apiResponse)
      ? apiResponse[0]
      : apiResponse[0] || apiResponse // soporta ambas estructuras

    //  Normalizar el valor a número
    const isCompletedValue = Number(data.is_completed)

    task.value = {
      ...data,
      is_completed: isCompletedValue,
      date: data.due_date || data.date || ''
    }
  } catch (e) {
    console.error(`Error al cargar la tarea ${id}:`, e)
    task.value = null
  } finally {
    loading.value = false
  }
})
</script>
