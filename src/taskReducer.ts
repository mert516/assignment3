// Ad Soyad: Mehmet Mert Kaya
// Öğrenci No: 2024502147

import type { Filter } from './filter'

export type Status = 'todo' | 'in-progress' | 'done'

export type Task = { id: string; title: string; status: Status }

export type State = { tasks: Task[]; filter: Filter; past: Task[][] }

export const initialState: State = { tasks: [], filter: 'all', past: [] }

export type Action =
  | { type: 'add'; id: string; title: string }
  | { type: 'advance'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'setFilter'; filter: Filter }
  | { type: 'clearDone' }
  | { type: 'undo' }

const NEXT: Record<Status, Status> = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
}

// Remember the old list so we can undo later.
function changed(state: State, nextTasks: Task[]): State {
  const same =
    nextTasks.length === state.tasks.length &&
    nextTasks.every((t, i) => t === state.tasks[i])
  if (same) return state
  return { ...state, past: [...state.past, state.tasks], tasks: nextTasks }
}

export function taskReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return changed(state, [
        ...state.tasks,
        { id: action.id, title: action.title, status: 'todo' },
      ])
    case 'advance':
      return changed(
        state,
        state.tasks.map((t) =>
          t.id === action.id ? { ...t, status: NEXT[t.status] } : t,
        ),
      )
    case 'remove':
      return changed(state, state.tasks.filter((t) => t.id !== action.id))
    case 'setFilter':
      return { ...state, filter: action.filter }
    case 'clearDone':
      return changed(state, state.tasks.filter((t) => t.status !== 'done'))
    case 'undo':
      if (state.past.length === 0) return state
      return {
        ...state,
        tasks: state.past[state.past.length - 1],
        past: state.past.slice(0, -1),
      }
  }
}
