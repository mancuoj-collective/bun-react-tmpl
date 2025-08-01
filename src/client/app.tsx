import { useState } from 'react'
import { GithubIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { Input } from '@/client/components/ui/input'
import { Button } from '@/client/components/ui/button'
import { Checkbox } from '@/client/components/ui/checkbox'
import { ThemeToggle } from '@/client/components/theme-toggle'
import { useCreateTodo, useDeleteTodo, useTodos, useUpdateTodo } from '@/client/lib/api'
import { cn } from '@/client/lib/utils'

export function App() {
  const [newTodo, setNewTodo] = useState('')
  const { data: todos } = useTodos()
  const { mutate: createTodo } = useCreateTodo()
  const { mutate: updateTodo } = useUpdateTodo()
  const { mutate: deleteTodo } = useDeleteTodo()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    createTodo(newTodo)
    setNewTodo('')
  }

  return (
    <div className="font-sans antialiased relative">
      <div className="mx-auto max-w-xl p-12 md:p-20 flex flex-col gap-4 text-sm">
        <form className="flex gap-2.5" onSubmit={handleSubmit}>
          <Input
            className="flex-1 h-8"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <Button size="sm" disabled={!newTodo.trim()}>
            <PlusIcon className="size-4" />
          </Button>
        </form>
        <div className="border">
          {todos?.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">No todos yet</div>
          )}
          {todos?.map((todo) => (
            <div
              key={todo.id}
              className="flex justify-between items-center gap-2.5 pl-2.5 not-last:border-b"
            >
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed === 1}
                onCheckedChange={(checked) =>
                  updateTodo({ id: todo.id, completed: checked ? 1 : 0, title: todo.title })
                }
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={cn(
                  'flex-1',
                  todo.completed === 1 && 'line-through text-muted-foreground',
                )}
              >
                {todo.title}
              </label>
              <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                <TrashIcon className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com/mancuoj-collective/bun-react-tmpl" target="_blank">
              <GithubIcon className="size-4" />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
