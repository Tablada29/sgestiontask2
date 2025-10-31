<template>
  <v-container fluid class="py-6">
    <v-row>
      <v-col cols="12" sm="8" md="9">
        <MoleculesSearchBar v-model="store.q" @search="store.onSearch" />
      </v-col>

      <v-col cols="12" sm="4" md="3" class="d-flex justify-sm-end">
        <OrganismsTaskForm v-model="formOpen" :task="editing" @save="onSaveWrapper">
          <template #activator="{ props }">
            <v-btn color="primary" v-bind="props" block @click="onNewTask">Nueva Tarea</v-btn>
          </template>
        </OrganismsTaskForm>
      </v-col>

      <v-col cols="12">
        <v-skeleton-loader v-if="store.loading" type="list-item-two-line, list-item-two-line" class="mt-4" />
        <div v-else>
          <OrganismsTaskCard
            v-for="t in store.tasks"
            :key="t.id"
            :task="t"
            @open="openTask"
            @edit="onEdit"
            @delete="store.onDelete"
            @toggle="store.onToggle"
          />
          <v-alert v-if="!store.tasks.length && !store.loading" type="info" prominent>
            No hay tareas que mostrar o que coincidan con la búsqueda.
          </v-alert>
        </div>
      </v-col>
      
      <v-col v-if="store.totalPages > 1" cols="12" class="d-flex justify-center mt-4">
        <MoleculesPagination 
          :page="store.page" 
          :pages="store.totalPages" 
          @update:page="store.onPage" 
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'; 
import { useRouter } from 'vue-router';
import { useTaskStore } from '@/stores/taskStore';

const store = useTaskStore();
const router = useRouter();

const formOpen = ref(false);
const editing = ref<any>(undefined);

// Polling para actualizar lista cada 10s
const refreshInterval = ref<NodeJS.Timeout | null>(null);

onMounted(() => {
  store.init();
  refreshInterval.value = setInterval(() => {
    if (!store.q) store.fetchList();
  }, 10000);
});

onUnmounted(() => {
  if (refreshInterval.value) clearInterval(refreshInterval.value);
});

const openTask = (id: string) => router.push(`/tasks/${id}`);

const onNewTask = () => {
  editing.value = null; 
  formOpen.value = true;
};

const onEdit = (task: any) => { 
  editing.value = { ...task, completed: task.is_completed === '1', date: task.due_date || task.date };
  formOpen.value = true;
};

const onSaveWrapper = async (payload: any) => {
  await store.onSave(payload, editing.value);
  editing.value = null;
  formOpen.value = false;
};
</script>
