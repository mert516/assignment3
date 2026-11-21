import type { Task } from './taskReducer'

type TaskRowProps = { task: Task; onNext: () => void; onDelete: () => void }

const STATUS_BG: Record<Task['status'], string> = {
  todo: '#e4eaf2',
  'in-progress': '#ffedc7',
  done: '#d6f0de',
}

const STATUS_INK: Record<Task['status'], string> = {
  todo: '#3c4d64',
  'in-progress': '#6e3c00',
  done: '#115228',
}

export default function TaskRow({ task, onNext, onDelete }: TaskRowProps) {
  return (
    <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ flex: 1 }}>{task.title}</span>
      <em
        style={{
          background: STATUS_BG[task.status],
          color: STATUS_INK[task.status],
          padding: '2px 8px',
          borderRadius: 12,
          fontSize: '0.85rem',
          fontStyle: 'normal',
          fontWeight: 600,
        }}
      >
        {task.status}
      </em>
      <button onClick={onNext}>Next</button>
      <button onClick={onDelete}>Delete</button>
    </li>
  )
}
