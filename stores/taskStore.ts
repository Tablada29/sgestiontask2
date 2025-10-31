import { defineStore } from 'pinia';
import { useTasks } from '@/composables/useTasks';

const ITEMS_PER_PAGE = 6;

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [] as any[],
    allTasksCache: [] as any[],
    loading: false,
    q: '',
    page: 1,
    totalPages: 1,
  }),

  actions: {
    async fetchList() {
      this.loading = true;
      try {
        const tasksApi = useTasks();
        const allTasks = await tasksApi.list();

        //Actualiza reactivo
        this.allTasksCache.splice(0, this.allTasksCache.length, ...allTasks); 

        const filteredTasks = this.q
          ? this.allTasksCache.filter((t: any) =>
              t.title.toLowerCase().includes(this.q.toLowerCase()) ||
              t.description?.toLowerCase().includes(this.q.toLowerCase()) ||
              t.tags?.toLowerCase().includes(this.q.toLowerCase())
            )
          : this.allTasksCache;

        this.totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
        if (this.page > this.totalPages && this.totalPages > 0) this.page = this.totalPages;
        if (this.totalPages === 0) this.page = 1;

        const startIndex = (this.page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        // Reactivo
        this.tasks.splice(0, this.tasks.length, ...filteredTasks.slice(startIndex, endIndex));
      } catch (e) {
        console.error('Error al cargar la lista de tareas:', e);
        this.tasks.splice(0, this.tasks.length);
      } finally {
        this.loading = false;
      }
    },





    //Maneja el cambio de página
    onPage(newPage: number) {
        this.page = newPage;
        this.fetchList();
    },
// Maneja el evento de búsqueda
    onSearch() {
      this.page = 1; // 1. Reiniciar la paginación al buscar
      this.fetchList(); // 2. Recargar la lista aplicando el filtro 'this.q'
    },

    async onDelete(task: any) {
      if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
      const tasksApi = useTasks();
      try {
        await tasksApi.remove(task.id);
        await this.fetchList();
      } catch (e) {
        console.error('Error al eliminar la tarea:', e);
      }
    },


    async onSave(payload: any, editingTask: any) {
    const tasksApi = useTasks(); 
    try {
        if (editingTask) {
            await tasksApi.update(editingTask.id, payload);
            const index = this.tasks.findIndex(t => t.id === editingTask.id);
            if (index !== -1) this.tasks.splice(index, 1, { ...this.tasks[index], ...payload });
        } else {
            const newTask = await tasksApi.create(payload);
            this.tasks.unshift(newTask);
        }
    } catch (e) { 
        console.error('Error al guardar la tarea:', e); 
    }
},

async onToggle(task: any) {
    const tasksApi = useTasks(); 
    try {
        const payload = { ...task, completed: !task.completed };
        await tasksApi.update(task.id, payload);
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) this.tasks.splice(index, 1, { ...this.tasks[index], ...payload });
    } catch (e) { 
        console.error('Error al cambiar estado:', e); 
    }
},
    async init() {
      if (this.tasks.length === 0) {
        await this.fetchList();
      }
    },
  },
});
