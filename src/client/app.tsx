import { APITester } from '@/client/components/api-tester'
import '@fontsource-variable/dm-sans'
import '@fontsource/dm-mono'
import '@/client/styles/globals.css'

export function App() {
  return (
    <div className="font-sans antialiased relative">
      <div className="mx-auto max-w-3xl p-20">
        <APITester />
      </div>
    </div>
  )
}
