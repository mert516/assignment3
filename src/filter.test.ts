import { describe, expect, test } from 'vitest'
import type { Task } from './taskReducer'
import { countByFilter, filterTasks, FILTERS } from './filter'

const task = (id: string, status: Task['status'] = 'todo'): Task => ({
  id,
  title: 'Task ' + id,
  status,
})

describe('filterTasks', () => {
  test("'all' returns every task", () => {
    const tasks = [task('1', 'todo'), task('2', 'done'), task('3', 'in-progress')]
    expect(filterTasks(tasks, 'all')).toEqual(tasks)
  })

  test('filters by status', () => {
    const tasks = [task('1', 'todo'), task('2', 'done'), task('3', 'todo')]
    expect(filterTasks(tasks, 'todo')).toEqual([tasks[0], tasks[2]])
    expect(filterTasks(tasks, 'done')).toEqual([tasks[1]])
    expect(filterTasks(tasks, 'in-progress')).toEqual([])
  })

  test('empty list stays empty', () => {
    expect(filterTasks([], 'todo')).toEqual([])
    expect(filterTasks([], 'all')).toEqual([])
  })
})

describe('countByFilter', () => {
  test('counts every bucket', () => {
    const tasks = [task('1', 'todo'), task('2', 'todo'), task('3', 'done')]
    expect(countByFilter(tasks)).toEqual({
      all: 3,
      todo: 2,
      'in-progress': 0,
      done: 1,
    })
  })

  test('empty list gives zero counts', () => {
    expect(countByFilter([])).toEqual({ all: 0, todo: 0, 'in-progress': 0, done: 0 })
  })

  test('FILTERS contains all four filters', () => {
    expect(FILTERS).toEqual(['all', 'todo', 'in-progress', 'done'])
  })
})