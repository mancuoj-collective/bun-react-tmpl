import { serve, sql } from 'bun'
import index from './index.html'
import { db } from './db/setup.ts'
import type { Todo } from './types.ts'

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/todos': {
      GET() {
        const todos = db.query('SELECT * FROM todos').all()
        return Response.json(todos)
      },

      async POST(req) {
        const todo: Pick<Todo, 'title'> = await req.json()
        const { lastInsertRowid } = db.query(`INSERT INTO todos (title) VALUES (?)`).run(todo.title)
        return Response.json({
          id: lastInsertRowid,
          success: true,
        })
      },
    },

    '/api/todos/:id': {
      async PUT(req) {
        const todo: Todo = await req.json()
        db.query(`UPDATE todos SET title = ?, completed = ? WHERE id = ?`).run(
          todo.title,
          todo.completed,
          todo.id,
        )
        return Response.json({ success: true })
      },

      DELETE(req) {
        const { id } = req.params
        db.query(`DELETE FROM todos WHERE id = ?`).run(id)
        return Response.json({ success: true })
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
