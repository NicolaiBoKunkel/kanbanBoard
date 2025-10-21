<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import type { KanbanCard, Status } from '@/types/kanban'

const props = defineProps<{
  modelValue: boolean
  initial?: Partial<KanbanCard> & { status?: Status }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: { id?: string; title: string; description: string; status: Status }): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const DEFAULT_STATUS: Status = 'todo'

const form = reactive({
  id: props.initial?.id,
  title: props.initial?.title ?? '',
  description: props.initial?.description ?? '',
  status: (props.initial?.status ?? DEFAULT_STATUS) as Status,
})

watch(
  () => props.initial,
  (val) => {
    form.id = val?.id
    form.title = val?.title ?? ''
    form.description = val?.description ?? ''
    form.status = (val?.status ?? DEFAULT_STATUS) as Status
  },
  { immediate: true }
)

function submit() {
  if (!form.title.trim()) return
  emit('save', {
    id: form.id,
    title: form.title.trim(),
    description: form.description.trim(),
    status: form.status,
  })
  open.value = false
}
</script>

<template>
  <v-dialog v-model="open" max-width="520">
    <v-card>
      <v-card-title class="text-subtitle-1">{{ form.id ? 'Edit Card' : 'Add Card' }}</v-card-title>
      <v-card-text>
        <div class="d-flex flex-column ga-4">
          <v-text-field
            v-model="form.title"
            label="Title"
            :rules="[(v:string)=>!!v || 'Title is required']"
            autofocus
            hide-details="auto"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
            auto-grow
            hide-details
          />
          <v-select
            v-model="form.status"
            :items="[
              { value: 'todo', title: 'To Do' },
              { value: 'in_progress', title: 'In Progress' },
              { value: 'done', title: 'Done' },
            ]"
            label="Status"
            hide-details
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="open = false">Cancel</v-btn>
        <v-btn color="primary" @click="submit">
          {{ form.id ? 'Save changes' : 'Add card' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
