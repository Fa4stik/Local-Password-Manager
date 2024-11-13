import * as React from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Login } from '../pages/Login.tsx'

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Login />
}
