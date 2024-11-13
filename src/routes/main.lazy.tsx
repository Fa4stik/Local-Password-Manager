import * as React from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Main } from "../pages/Main.tsx";

export const Route = createLazyFileRoute('/main')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Main/>
}
