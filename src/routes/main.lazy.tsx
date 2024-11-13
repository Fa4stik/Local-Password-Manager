import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Main } from '../pages/Main.tsx'
import { useEffect } from "react";

export const Route = createLazyFileRoute('/main')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate({ from: '/main' })

  useEffect(() => {
    if (!sessionStorage.getItem('masterPassword')) {
      navigate({ to: '/' })
    }
  }, [])

  if (!sessionStorage.getItem('masterPassword')) {
    return null
  }

  return <Main />
}
