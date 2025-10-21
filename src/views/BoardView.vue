<script setup lang="ts">
import draggable from 'vuedraggable'
import { ref } from 'vue'
import CardDialog from '@/components/CardDialog.vue'
import { useKanbanStore } from '@/stores/useKanbanStore'
import type { KanbanCard, Status } from '@/types/kanban'

const { state, addCard, updateCard, removeCard } = useKanbanStore()

const columns: { key: Status; label: string }[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

const dialogOpen = ref(false)
const dialogInitial = ref<(Partial<KanbanCard> & { status: Status }) | undefined>()

function openAdd(col: Status) {
  dialogInitial.value = { status: col, title: '', description: '' }
  dialogOpen.value = true
}

function openEdit(card: KanbanCard) {
  dialogInitial.value = { ...card }
  dialogOpen.value = true
}

function onSave(payload: { id?: string; title: string; description: string; status: Status }) {
  if (!payload.id) {
    addCard({ title: payload.title, description: payload.description, status: payload.status })
  } else {
    const updated: KanbanCard = {
      id: payload.id,
      title: payload.title,
      description: payload.description,
      status: payload.status,
    }
    updateCard(updated)
  }
}

function onDelete(card: KanbanCard) {
  if (confirm(`Delete "${card.title}"?`)) {
    removeCard(card.id)
  }
}

function handleChange(col: Status) {
  return () => {
    for (const card of state.lists[col]) card.status = col
  }
}
</script>

<template>
  <v-container fluid class="py-6">
    <v-row dense>
      <v-col v-for="col in columns" :key="col.key" cols="12" md="4">
        <v-card border class="pa-2">
          <v-toolbar flat density="comfortable">
            <v-toolbar-title class="text-subtitle-1 font-weight-medium">
              {{ col.label }}
            </v-toolbar-title>
            <template #append>
              <v-btn
                icon
                variant="text"
                :aria-label="`Add card to ${col.label}`"
                @click="openAdd(col.key)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-toolbar>

          <v-divider />

          <div class="d-flex flex-column ga-2 pa-2">
            <v-alert v-if="state.lists[col.key].length === 0" variant="tonal" type="info">
              No cards here yet.
            </v-alert>

            <draggable
              :list="state.lists[col.key]"
              item-key="id"
              group="kanban"
              ghost-class="drag-ghost"
              drag-class="drag-dragging"
              @change="handleChange(col.key)"
            >
              <template #item="{ element: card }">
                <v-card class="elevation-1">
                  <v-card-title class="text-body-1 font-weight-medium">
                    {{ card.title }}
                  </v-card-title>
                  <v-card-text class="text-body-2">
                    {{ card.description }}
                  </v-card-text>
                  <v-card-actions>
                    <v-btn size="small" variant="text" @click="openEdit(card)">
                      <v-icon start>mdi-pencil</v-icon>Edit
                    </v-btn>
                    <v-btn size="small" variant="text" color="error" @click="onDelete(card)">
                      <v-icon start>mdi-delete</v-icon>Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </draggable>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <CardDialog v-model="dialogOpen" :initial="dialogInitial" @save="onSave" />
</template>

<style scoped>
.drag-ghost {
  opacity: 0.6;
}
.drag-dragging {
  cursor: grabbing;
}
</style>
