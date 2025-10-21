import { describe, it, expect } from 'vitest'
import type { KanbanCard } from '@/types/kanban'

function assertDefined<T>(val: T | null | undefined, msg?: string): asserts val is T {
  if (val == null) throw new Error(msg ?? 'Expected value to be defined')
}

describe('useKanbanStore', () => {
  async function freshStore() {
    const mod = await import('@/stores/useKanbanStore')
    return mod.useKanbanStore()
  }

  it('addCard() adds a card to the correct list (unshift at top)', async () => {
    const { state, addCard } = await freshStore()

    const beforeLen = state.lists.todo.length
    const newCard = addCard({
      title: 'New Task',
      description: 'Test add',
      status: 'todo',
    })

    expect(state.lists.todo.length).toBe(beforeLen + 1)
    expect(state.lists.todo[0]).toEqual(newCard)
    expect(newCard.title).toBe('New Task')
    expect(newCard.status).toBe('todo')
  })

  it('updateCard() updates and moves card between lists when status changes', async () => {
    const { state, addCard, updateCard } = await freshStore()

    const c = addCard({
      title: 'Move me',
      description: 'From todo to done',
      status: 'todo',
    })

    expect(state.lists.todo.find((x) => x.id === c.id)).toBeTruthy()

    const updated: KanbanCard = { ...c, title: 'Moved!', status: 'done' }
    updateCard(updated)

    expect(state.lists.todo.find((x) => x.id === c.id)).toBeFalsy()
    expect(state.lists.done.length).toBeGreaterThan(0)

    const firstDone = state.lists.done[0]
    assertDefined(firstDone, 'Expected at least one card in Done')
    expect(firstDone.id).toBe(c.id)
    expect(firstDone.title).toBe('Moved!')
  })

  it('removeCard() removes card from any list and returns true; false if missing', async () => {
    const { state, addCard, removeCard } = await freshStore()

    const c = addCard({
      title: 'Delete me',
      description: 'bye',
      status: 'in_progress',
    })

    expect(state.lists.in_progress.some((x) => x.id === c.id)).toBe(true)

    const ok = removeCard(c.id)
    expect(ok).toBe(true)
    expect(state.lists.in_progress.some((x) => x.id === c.id)).toBe(false)

    expect(removeCard(c.id)).toBe(false)
  })
})
