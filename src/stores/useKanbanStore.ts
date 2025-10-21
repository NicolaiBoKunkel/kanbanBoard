import { reactive } from 'vue'
import type { KanbanCard, Status } from '@/types/kanban'

function uid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

type Lists = Record<Status, KanbanCard[]>

const state = reactive<{
  lists: Lists
}>({
  lists: {
    todo: [
    ],
    in_progress: [
    ],
    done: [
      { id: '2', title: 'Vuetify shell',  description: 'Add Vuetify and base layout',           status: 'done' },
      { id: '1', title: 'Setup repo',     description: 'Initialize project and push to GitHub', status: 'done' },
      { id: '4', title: 'Drag & Drop',    description: 'Move cards between columns',            status: 'done' },
      { id: '5', title: 'CRUD',           description: 'Add, edit, delete cards',               status: 'done' },
      { id: '3', title: 'Board layout',   description: 'Create 3 columns',                      status: 'done' },
    ],
  },
})

export function useKanbanStore() {
  function addCard(partial: Pick<KanbanCard, 'title' | 'description' | 'status'>) {
    const card: KanbanCard = { id: uid(), ...partial }
    state.lists[card.status].unshift(card)
    return card
  }

  function updateCard(updated: KanbanCard) {
    const lists = state.lists
    const all: KanbanCard[] = [...lists.todo, ...lists.in_progress, ...lists.done]
    const idx = all.findIndex(c => c.id === updated.id)
    if (idx === -1) return

    let oldList: KanbanCard[] | undefined
    for (const key of Object.keys(lists) as Status[]) {
      const i = lists[key].findIndex(c => c.id === updated.id)
      if (i !== -1) {
        oldList = lists[key]
        oldList.splice(i, 1)
        break
      }
    }
    state.lists[updated.status].unshift(updated)
  }

  function removeCard(id: string) {
    for (const key of Object.keys(state.lists) as Status[]) {
      const i = state.lists[key].findIndex(c => c.id === id)
      if (i !== -1) {
        state.lists[key].splice(i, 1)
        return true
      }
    }
    return false
  }

  return {
    state,
    addCard,
    updateCard,
    removeCard,
  }
}
