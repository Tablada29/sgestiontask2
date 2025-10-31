<template>
  <v-card class="mb-4" :color="isCompleted ? 'green-lighten-5' : ''">
    <v-card-title class="d-flex align-center">
      <div class="d-flex align-center flex-grow-1" @click="$emit('open', task.id)">
        <v-checkbox 
          :model-value="isCompleted" 
          @click.stop="onToggle" 
          hide-details 
          class="mr-3" 
          density="compact"
        />
        <div class="flex-grow-1 text-truncate">
          <div :class="['text-subtitle-1 font-weight-bold', { 'text-decoration-line-through': isCompleted }]">
            {{ task.title }}
          </div>
          <div class="text-caption text-medium-emphasis" v-if="dateString">
            {{ dateString }}
          </div>
        </div>
      </div>
      
      <v-spacer class="hidden-xs-only" />

      <v-chip 
        :color="isCompleted ? 'success' : 'orange'" 
        label 
        size="small"
        class="hidden-sm-and-down"
      >
        {{ isCompleted ? 'Completada' : 'Pendiente' }}
      </v-chip>

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon v-bind="props" size="small" variant="text">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item @click="$emit('edit', task)" prepend-icon="mdi-pencil">
            <v-list-item-title>Editar</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$emit('delete', task)" prepend-icon="mdi-delete">
            <v-list-item-title>Eliminar</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$emit('open', task.id)" prepend-icon="mdi-eye">
            <v-list-item-title>Ver Detalle</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text v-if="task.description" class="text-body-2 pt-0">
      {{ task.description.substring(0, 100) }}...
    </v-card-text>

    <v-card-actions v-if="tagsArray.length" class="pt-0">
      <div class="d-flex flex-wrap">
        <v-chip v-for="t in tagsArray" :key="t" class="ma-1" size="small">{{ t }}</v-chip>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch, PropType } from 'vue'; // importar PropType

const props = defineProps({
  task: { type: Object as PropType<any>, required: true }
});
const emit = defineEmits(['open', 'edit', 'delete', 'toggle']);

// traduce el string/number de la API a booleano reactivo.
const isCompleted = computed(() => {
    // Si la API devuelve '1' o el store ya lo mapeó a true, es completada.
    return props.task.is_completed === '1' || props.task.is_completed === 1 || props.task.completed === true;
});

const dateString = computed(() => props.task.due_date || props.task.date);



const onToggle = () => {
    // Invertir el estado real (isCompleted.value)
    emit('toggle', { ...props.task, completed: !isCompleted.value });
};

const tagsArray = computed(() => {
  if (typeof props.task.tags === 'string') {
    return props.task.tags.split(',').map((s: string) => s.trim()).filter(Boolean);
  }
  return Array.isArray(props.task.tags) ? props.task.tags : [];
});
</script>