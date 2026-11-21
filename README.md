Ad Soyad: [İsim Soyisim]
Öğrenci No: [Öğrenci Numarası]

# Assignment 3 starter (sample Task Manager)

A complete Vite + React + TypeScript project. Nothing to copy or generate.

```
npm install
npm run dev       # open the address it prints
npm run build     # type check and build; must pass when you hand in
```

Needs Node.js 20.19 or newer (22 or 24 also work).

- `src/taskReducer.ts`: the reducer. You change it: the state becomes `{ tasks, filter }`
  and it gets two new actions (see the handout).
- `src/App.tsx`: keeps the state with `useReducer` and passes it down as props.
- `src/filter.ts`: the file you fill in.


---

## Bonus 1: Undo

The state keeps a `past: Task[][]` history next to `tasks` and `filter`. Every action that changes `tasks` pushes the previous task list onto `past`; a `{ type: 'undo' }` action pops the last entry back into `tasks`. Changing the filter is not undoable, so undo after `clearDone` brings the cleared tasks back while the filter stays where it was. The Undo button is disabled when `past` is empty.

## Bonus 2: Tests

```
> npm test

RUN  v5.1.1 ...
 ✓ src/filter.test.ts (6 tests)
 ✓ src/taskReducer.test.ts (13 tests)

 Test Files  2 passed (2)
      Tests  19 passed (19)
```

The suite covers every reducer action (`add`, `advance` cycling three times back to `todo`, `remove`, `setFilter`, `clearDone`, `undo`), immutability of the old state (`Object.freeze`), edge cases (unknown id, empty list, `clearDone` with nothing done), and both filter functions (`filterTasks`, `countByFilter`, including empty-list counts).

## Bonus 3: Explain your reducer

A reducer must be pure because React (via `useReducer`) detects state changes by referential equality: if the reducer mutated the old state object or array and returned it, React would not see a difference, would not re-render, and the screen would show stale data. Mutating state also corrupts anything still holding a reference to the old state, producing bugs that are very hard to reproduce.

The caller creates the id (`crypto.randomUUID()`), not the reducer, because a reducer must be deterministic: given the same state and action it must always return the same next state. If the reducer generated ids or timestamps itself, identical actions would give different results, tests would be flaky, and features like the Undo bonus would be impossible to implement reliably.

The filtered list and the counts are derived while rendering with `filterTasks` and `countByFilter` instead of being stored in state, because stored derived state goes stale: after an add, delete, or status change, a separately stored `filteredTasks` or `counts` value no longer matches `state.tasks` until something remembers to refresh it. One concrete bug this causes: with the "done" filter active, clearing done tasks would empty the list, but a cached count would still show a nonzero number, so the UI would lie about how many tasks match the filter.

Keeping the filter inside the reducer state instead of a separate `useState` made Undo easier: all state transitions live in one pure function, so `undo` can restore a complete snapshot of `{ tasks, filter }`. The trade-off is a slightly more complex state shape, since every task-changing action must also maintain the undo history.

## Bonus 4: Git repository

The project is kept in a Git repository with at least five commits describing each step (for example `Add setFilter action`, `Add Clear done button`, `Add Vitest tests`). Repository link: `https://github.com/<kullanici-adi>/assignment3`

Replace `<kullanici-adi>` with your own username, create the repository, push the code (without `node_modules`), and give the instructor access as announced on Moodle.
Zip the whole folder without `node_modules` when you hand in.
