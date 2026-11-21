// STARTING POINT: the sample Task Manager (state in App with useReducer, passed down as props).
// Assignment 3: change the state shape, add actions, add a filter bar (see the handout).
import { useReducer } from 'react'
import {
  taskReducer,
  type Action,
  type State,
  type Task,
  initialState,
} from './taskReducer'
import { FILTERS, countByFilter, filterTasks, filterLabel, type Filter } from './filter'
import TaskRow from './TaskRow'
import type { Dispatch } from 'react'

function AddForm({ dispatch }: { dispatch: Dispatch<Action> }) {
  function addTask(formData: FormData) {
    const title = String(formData.get('title') ?? '').trim()
    if (title) dispatch({ type: 'add', id: crypto.randomUUID(), title })
  }
  return (
    <form action={addTask}>
      <input name="title" placeholder="New task" />
      <button type="submit">Add</button>
    </form>
  )
}

function FilterBar({
  filter,
  dispatch,
  counts,
  past,
}: {
  filter: Filter
  dispatch: Dispatch<Action>
  counts: Record<Filter, number>
  past: State['past']
}) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => dispatch({ type: 'setFilter', filter: f })}
          aria-pressed={f === filter}
          style={{
            padding: '4px 10px',
            border: f === filter ? '2px solid #1a58a5' : '1px solid #9db2c8',
            background: f === filter ? '#e7f0fb' : '#ffffff',
            fontWeight: f === filter ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          {filterLabel(f)} ({counts[f]})
        </button>
      ))}
      <button
        onClick={() => dispatch({ type: 'clearDone' })}
        style={{ marginLeft: 8, padding: '4px 10px', cursor: 'pointer' }}
      >
        Clear done
      </button>
      <button
        onClick={() => dispatch({ type: 'undo' })}
        disabled={past.length === 0}
        style={{ marginLeft: 8, padding: '4px 10px', cursor: 'pointer' }}
      >
        Undo
      </button>
    </div>
  )
}

function TaskList({ tasks, dispatch }: { tasks: Task[]; dispatch: Dispatch<Action> }) {
  return (
    <ul>
      {tasks.map((t) => (
        <TaskRow
          key={t.id}
          task={t}
          onNext={() => dispatch({ type: 'advance', id: t.id })}
          onDelete={() => dispatch({ type: 'remove', id: t.id })}
        />
      ))}
    </ul>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  const visible = filterTasks(state.tasks, state.filter)
  const counts = countByFilter(state.tasks)
  return (
    <main>
      <h1>Task Manager</h1>
      <AddForm dispatch={dispatch} />
      <FilterBar filter={state.filter} dispatch={dispatch} counts={counts} past={state.past} />
      <TaskList tasks={visible} dispatch={dispatch} />
      {visible.length === 0 && <p style={{ fontStyle: 'italic' }}>No tasks here.</p>}
    </main>
  )
}
