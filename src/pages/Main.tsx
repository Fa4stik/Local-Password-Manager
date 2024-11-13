import { CustomTable } from "../components/CustomTable.tsx";
import { usePasswordsStore } from "../store/usePasswordsStore.ts";

export const Main = () => {
  const dataSource = usePasswordsStore(state => state.records)
  const addRecord = usePasswordsStore(state => state.addRecord)
  const removeRecord = usePasswordsStore(state => state.removeRecord)
  const updateRecord = usePasswordsStore(state => state.updateRecord)
  const importRecords = usePasswordsStore(state => state.importRecords)

	return (
		<div className="max-w-screen min-h-screen p-10">
			<CustomTable
				dataSource={dataSource}
				onAdd={addRecord}
				onRemove={removeRecord}
				onUpdate={updateRecord}
				onImport={importRecords}
			/>
		</div>
	);
};