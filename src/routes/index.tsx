import { createFileRoute } from '@tanstack/react-router'
import { Login } from '../pages/Login.tsx'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Login />
}
