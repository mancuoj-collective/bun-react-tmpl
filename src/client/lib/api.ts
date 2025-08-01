import { ofetch } from 'ofetch'
import type { Todo } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const apiFetch = ofetch.create({ baseURL: '/api' })
const TODOS_QUERY_KEY = ['todos']

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
    queryKey: TODOS_QUERY_KEY,
    queryFn: getTodos,
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTodo,
    onMutate: async (newTodoTitle) => {
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY })
      const previousTodos = queryClient.getQueryData<Todo[]>(TODOS_QUERY_KEY)
      queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old) => [
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
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY })
    },
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTodo,
    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY })
      const previousTodos = queryClient.getQueryData<Todo[]>(TODOS_QUERY_KEY)
      queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old) =>
        old?.map((todo) => (todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo)),
      )
      return { previousTodos }
    },
    onError: (error, _variables, context) => {
      toast.error('Failed to update todo', { description: error.message })
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY })
    },
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (idToDelete) => {
      await queryClient.cancelQueries({ queryKey: TODOS_QUERY_KEY })
      const previousTodos = queryClient.getQueryData<Todo[]>(TODOS_QUERY_KEY)
      queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (old) =>
        old?.filter((todo) => todo.id !== idToDelete),
      )
      return { previousTodos }
    },
    onError: (error, _variables, context) => {
      toast.error('Failed to delete todo', { description: error.message })
      if (context?.previousTodos) {
        queryClient.setQueryData(TODOS_QUERY_KEY, context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY })
    },
  })
}
