import '@fontsource-variable/dm-sans'
import '@fontsource/dm-mono'
import '@/client/styles/globals.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { App } from '@/client/app'

const elem = document.getElementById('root')!
const queryClient = new QueryClient()
const app = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="bun-react-tmpl" attribute="class" disableTransitionOnChange>
        <App />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)

if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(elem))
  root.render(app)
} else {
  createRoot(elem).render(app)
}
