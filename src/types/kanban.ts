export type Status = 'todo' | 'in_progress' | 'done'

export interface KanbanCard {
  id: string
  title: string
  description: string
  status: Status
}
