import { ofetch } from 'ofetch'
import type { Todo } from '@/types'
import { toast } from 'sonner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const apiFetch = ofetch.create({ baseURL: '/api' })
const keys = { todos: ['todos'] }

export function getTodos() {
  return apiFetch<Todo[]>('/todos')
}

export function createTodo(title: string) {
  return apiFetch<Todo>('/todos', { method: 'POST', body: { title } })
}

function updateTodo(todo: Todo) {
  return apiFetch<Todo>(`/todos/${todo.id}`, { method: 'PUT', body: todo })
}

export function deleteTodo(id: number) {
  return apiFetch(`/todos/${id}`, { method: 'DELETE' })
}

export function useTodos() {
  return useQuery({
    queryKey: keys.todos,
    queryFn: getTodos,
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTodo,
    onMutate: async (newTodoTitle) => {
      await queryClient.cancelQueries({ queryKey: keys.todos })
      const previousTodos = queryClient.getQueryData<Todo[]>(keys.todos)
      queryClient.setQueryData<Todo[]>(keys.todos, (old) => [
        ...(old || []),
        {
          id: Date.now(),
          title: newTodoTitle,
          completed: 0,
        },
      ])
      return { previousTodos }
    },
    onError: (error, _variables, context) => {
      toast.error('Failed to create todo', { description: error.message })
      if (context?.previousTodos) {
        queryClient.setQueryData(keys.todos, context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keys.todos })
    },
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: keys.todos })
      const previousTodos = queryClient.getQueryData<Todo[]>(keys.todos)
      queryClient.setQueryData<Todo[]>(keys.todos, (old) =>
        old?.map((todo) => (todo.id === newTodo.id ? { ...todo, ...newTodo } : todo)),
      )
      return { previousTodos }
    },
    onError: (error, _variables, context) => {
      toast.error('Failed to update todo', { description: error.message })
      if (context?.previousTodos) {
        queryClient.setQueryData(keys.todos, context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keys.todos })
    },
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (idToDelete) => {
      await queryClient.cancelQueries({ queryKey: keys.todos })
      const previousTodos = queryClient.getQueryData<Todo[]>(keys.todos)
      queryClient.setQueryData<Todo[]>(keys.todos, (old) =>
        old?.filter((todo) => todo.id !== idToDelete),
      )
      return { previousTodos }
    },
    onError: (error, _variables, context) => {
      toast.error('Failed to delete todo', { description: error.message })
      if (context?.previousTodos) {
        queryClient.setQueryData(keys.todos, context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keys.todos })
    },
  })
}
