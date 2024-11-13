import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
	component: RootPage
})

function RootPage () {
	return <>
		<div className="max-w-screen min-h-screen p-10">
			<Link to="/">Login</Link>
			<Link to="/main">Main</Link>
			<Outlet />
		</div>
		<TanStackRouterDevtools />
	</>
}