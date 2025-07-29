import { Button } from '@/client/components/ui/button'
import { Input } from '@/client/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/client/components/ui/select'
import { Textarea } from '@/client/components/ui/textarea'
import { useRef, type FormEvent } from 'react'

export function APITester() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null)

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      const endpoint = formData.get('endpoint') as string
      const url = new URL(endpoint, location.href)
      const method = formData.get('method') as string
      const res = await fetch(url, { method })

      const data = await res.json()
      responseInputRef.current!.value = JSON.stringify(data, null, 2)
    } catch (error) {
      responseInputRef.current!.value = String(error)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <form
        onSubmit={testEndpoint}
        className="flex items-center gap-3 bg-card p-3 rounded-xl border border-input w-full"
      >
        <Select name="method" defaultValue="GET">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          name="endpoint"
          defaultValue="/api/hello"
          placeholder="/api/hello"
          className="font-mono"
        />
        <Button type="submit">Send</Button>
      </form>

      <Textarea
        ref={responseInputRef}
        readOnly
        placeholder="Response will appear here..."
        className="p-3 font-mono rounded-xl min-h-[120px]"
      />
    </div>
  )
}
