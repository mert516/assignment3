import { describe, expect, test } from 'vitest'
import {
  taskReducer,
  type State,
  type Task,
  initialState,
} from './taskReducer'

const aTask = (
  id: string,
  status: Task['status'] = 'todo',
  title = 'Task',
): Task => ({ id, title, status })

function stateWith(tasks: Task[], filter: State['filter'] = 'all'): State {
  return { tasks, filter, past: [] }
}

describe('taskReducer', () => {
  test('initial state has no tasks and filter all', () => {
    expect(initialState).toEqual({ tasks: [], filter: 'all', past: [] })
  })

  test('add appends a task with status todo', () => {
    const next = taskReducer(initialState, {
      type: 'add',
      id: '1',
      title: 'Buy milk',
    })
    expect(next.tasks).toEqual([{ id: '1', title: 'Buy milk', status: 'todo' }])
    expect(next.filter).toBe('all')
  })

  test('advance cycles todo -> in-progress -> done -> todo', () => {
    let state = taskReducer(initialState, { type: 'add', id: '1', title: 't' })
    state = taskReducer(state, { type: 'advance', id: '1' })
    expect(state.tasks[0].status).toBe('in-progress')
    state = taskReducer(state, { type: 'advance', id: '1' })
    expect(state.tasks[0].status).toBe('done')
    state = taskReducer(state, { type: 'advance', id: '1' })
    expect(state.tasks[0].status).toBe('todo')
  })

  test('advance with an unknown id changes nothing', () => {
    const state = taskReducer(initialState, { type: 'add', id: '1', title: 't' })
    const next = taskReducer(state, { type: 'advance', id: 'missing' })
    expect(next.tasks).toEqual(state.tasks)
  })

  test('remove deletes the task with the given id', () => {
    const state = stateWith([aTask('1'), aTask('2', 'done')])
    const next = taskReducer(state, { type: 'remove', id: '1' })
    expect(next.tasks).toEqual([aTask('2', 'done')])
    expect(next.tasks).toHaveLength(1)
  })

  test('remove with an unknown id changes nothing', () => {
    const state = stateWith([aTask('1')])
    const next = taskReducer(state, { type: 'remove', id: 'missing' })
    expect(next.tasks).toEqual(state.tasks)
  })

  test('setFilter stores the chosen filter and keeps the tasks', () => {
    const state = stateWith([aTask('1')])
    const next = taskReducer(state, { type: 'setFilter', filter: 'done' })
    expect(next.filter).toBe('done')
    expect(next.tasks).toEqual(state.tasks)
  })

  test('clearDone removes every done task and keeps the filter', () => {
    const state = stateWith(
      [aTask('1', 'todo'), aTask('2', 'done'), aTask('3', 'done')],
      'done',
    )
    const next = taskReducer(state, { type: 'clearDone' })
    expect(next.tasks).toEqual([aTask('1', 'todo')])
    expect(next.filter).toBe('done')
  })

  test('clearDone with nothing done changes nothing', () => {
    const state = stateWith([aTask('1', 'todo'), aTask('2', 'in-progress')])
    const next = taskReducer(state, { type: 'clearDone' })
    expect(next).toBe(state)
  })

  test('undo restores the previous task list', () => {
    let state = taskReducer(initialState, { type: 'add', id: '1', title: 'a' })
    state = taskReducer(state, { type: 'add', id: '2', title: 'b' })
    expect(state.tasks).toHaveLength(2)
    state = taskReducer(state, { type: 'undo' })
    expect(state.tasks).toEqual([{ id: '1', title: 'a', status: 'todo' }])
  })

  test('undo after clearDone brings the cleared tasks back', () => {
    let state = stateWith([
      aTask('1', 'todo'),
      aTask('2', 'done'),
    ])
    state = taskReducer(state, { type: 'clearDone' })
    expect(state.tasks).toHaveLength(1)
    state = taskReducer(state, { type: 'undo' })
    expect(state.tasks).toHaveLength(2)
  })

  test('undo does nothing when there is nothing to undo', () => {
    const next = taskReducer(initialState, { type: 'undo' })
    expect(next).toBe(initialState)
  })

  test('the old state is never mutated', () => {
    const state = stateWith([aTask('1', 'todo'), aTask('2', 'done')])
    Object.freeze(state)
    Object.freeze(state.tasks)
    for (const task of state.tasks) Object.freeze(task)
    const next = taskReducer(state, { type: 'remove', id: '1' })
    expect(state.tasks).toHaveLength(2)
    expect(state.tasks[0].status).toBe('todo')
    expect(next.tasks).toHaveLength(1)
  })
})