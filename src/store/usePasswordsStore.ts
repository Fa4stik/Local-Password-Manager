import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from 'zod'

export const PasswordRecordSchema = z.object({
	key: z.string(),
	service: z.string(),
	login: z.string(),
	password: z.string(),
})
export type PasswordRecord = z.infer<typeof PasswordRecordSchema>

type State = {
	records: PasswordRecord[]
	cryptedRecords: string
}

type Actions = {
	addRecord: (newRecord: PasswordRecord) => void
	removeRecord: (id: number) => void
	updateRecord: (id: number, updatedRecord: PasswordRecord) => void
	importRecords: (records: PasswordRecord[]) => void
	updatedCryptedRecords: (cryptedRecords: string) => void
}

export const usePasswordsStore = create<State & Actions>()(
	persist(
		set => ({
			records: [],
			cryptedRecords: '',
			addRecord: (newRecord) => set(state => ({
				records: [...state.records, newRecord]
			})),
			removeRecord: (id) => set(state => ({
				records: state.records.filter((_r, rId) => rId !== id)
			})),
			updateRecord: (id, updatedRecord) => set(state => ({
				records: state.records.map((r, rId) => rId === id ? updatedRecord : r)
			})),
			importRecords: (records) => set({ records }),
			updatedCryptedRecords: (cryptedRecords) => set(() => ({
				cryptedRecords
			}))
		}), { name: 'usePasswordsStore' }
	)
)