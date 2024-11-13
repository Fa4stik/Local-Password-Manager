import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useEffect } from "react";
import { usePasswordsStore } from "../store/usePasswordsStore.ts";
import { decryptData, encryptData } from "../lib/cryptData.ts";

export const Route = createRootRoute({
	component: RootPage
})

function RootPage () {
	const record = usePasswordsStore(state => state.records)
	const cryptedRecords = usePasswordsStore(state => state.cryptedRecords)
	const updatedCryptedRecords = usePasswordsStore(state => state.updatedCryptedRecords)
	const importRecords = usePasswordsStore(state => state.importRecords)

	const navigate = useNavigate()

	useEffect(() => {
		const handleBeforeUnload = () => {
			const masterPassword = sessionStorage.getItem('masterPassword')
			if (!masterPassword) {
				return
			}

			const cryptedRecord = encryptData(record, masterPassword)
			updatedCryptedRecords(cryptedRecord)
			importRecords([])
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [record]);

	useEffect(() => {
		const masterPassword = sessionStorage.getItem('masterPassword')
		if (!masterPassword) {
			console.log('masterPassword is not set')
			navigate({ to: '/' })
			return
		}

		const data = decryptData(cryptedRecords, masterPassword)
		if (!data) {
			console.log('cant decrypt data', data)
			navigate({ to: '/' })
			return;
		}

		importRecords(data)
		navigate({ to: '/main' })
	}, []);

	return <>
		<Outlet />
		<TanStackRouterDevtools />
	</>
}