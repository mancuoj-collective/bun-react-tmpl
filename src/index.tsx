import { serve } from 'bun'
import index from './index.html'

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/hello': {
      async GET(req) {
        return Response.json({
          success: true,
          data: {
            message: 'Hello, world!',
            method: req.method,
          },
        })
      },
      async PUT(req) {
        return Response.json({
          success: true,
          data: {
            message: 'Hello, world!',
            method: req.method,
          },
        })
      },
    },

    '/api/hello/:name': async (req) => {
      const name = req.params.name
      return Response.json({
        success: true,
        data: {
          message: `Hello, ${name}!`,
        },
      })
    },
  },

  error(error) {
    console.error(error)
    return Response.json(
      {
        success: false,
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message,
        },
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
