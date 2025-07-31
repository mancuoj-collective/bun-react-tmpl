import { ofetch } from 'ofetch'
import type { Todo } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const apiFetch = ofetch.create({ baseURL: '/api' })

export function getTodos() {
  return apiFetch<Todo[]>('/todos')
}

export function createTodo(title: string) {
  return apiFetch('/todos', { method: 'POST', body: { title } })
}

function updateTodo(todo: Todo) {
  return apiFetch(`/todos/${todo.id}`, { method: 'PUT', body: todo })
}

export function deleteTodo(id: number) {
  return apiFetch(`/todos/${id}`, { method: 'DELETE' })
}

export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
