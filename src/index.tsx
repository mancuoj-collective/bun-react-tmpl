import { serve } from 'bun'
import index from './index.html'
import { db } from './db/setup.ts'
import type { Todo } from './types.ts'

const queries = {
  getAll: db.query('SELECT * FROM todos'),
  getById: db.query('SELECT * FROM todos WHERE id = ?'),
  create: db.query('INSERT INTO todos (title) VALUES (?)'),
  update: db.query('UPDATE todos SET title = ?, completed = ? WHERE id = ?'),
  delete: db.query('DELETE FROM todos WHERE id = ?'),
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/todos': {
      GET() {
        const todos = queries.getAll.all()
        return Response.json(todos)
      },

      async POST(req) {
        const todo: Pick<Todo, 'title'> = await req.json()
        const { lastInsertRowid } = queries.create.run(todo.title)
        return Response.json({ id: lastInsertRowid, completed: 0, ...todo }, { status: 201 })
      },
    },

    '/api/todos/:id': {
      async PUT(req) {
        const todo: Todo = await req.json()
        queries.update.run(todo.title, todo.completed, todo.id)
        return Response.json(todo)
      },

      DELETE(req) {
        const { id } = req.params
        queries.delete.run(id)
        return new Response(null, { status: 204 })
      },
    },
  },

  error(error) {
    console.error(error)
    return Response.json(
      {
        code: error.code,
        message: error.message,
      },
      { status: 500 },
    )
  },

  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
    console: true,
  },
})

console.log(`🚀 Server running at ${server.url}`)
