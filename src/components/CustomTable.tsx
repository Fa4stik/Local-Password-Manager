import { Button, Form, Input, notification, Popconfirm, Table, Typography } from 'antd';
import { useState } from "react";
import { PasswordRecord } from "../store/usePasswordsStore.ts";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { decryptData, encryptData } from "../lib/cryptData.ts";

interface DataType {
	key: string;
	service: string;
	login: string;
	password: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	title: never;
	record: DataType;
	index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
	editing,
	dataIndex,
	title,
	children,
	...restProps
}) => {
	const editableFields = ['service', 'login', 'password'];

	return (
		<td {...restProps}>
			{editing && editableFields.includes(dataIndex) ? (
				<Form.Item
					name={dataIndex as never}
					style={{margin: 0}}
					rules={[
						{
							required: true,
							message: `Пожалуйста введите ${title}!`,
						},
					]}
				>
					{dataIndex === 'password' ? (
						<Input.Password
							placeholder="Введите пароль..."
							iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
						/>
					) : (
						<Input />
					)}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

interface BaseColumn {
	dataIndex: string;
	title: string;
	editable?: boolean;
	width?: string;
}

interface EditableColumn extends BaseColumn {
	onCell: (record: DataType) => {
		dataIndex: string;
		record: DataType;
		inputType: string;
		title: string;
		editing: boolean;
	};
}

type ColumnType = BaseColumn | EditableColumn;

type CustomTableProps = {
	dataSource: DataType[]
	onAdd: (newRecord: PasswordRecord) => void
	onRemove: (id: number) => void
	onUpdate: (id: number, updatedRecord: PasswordRecord) => void
	onImport: (records: PasswordRecord[]) => void
}
export const CustomTable = ({ dataSource, onAdd, onRemove, onUpdate, onImport }: Readonly<CustomTableProps>) => {
	const [form] = Form.useForm();
	const [api, contextHolder] = notification.useNotification();

	const [data, setData] = useState<DataType[]>(dataSource);
	const [editingKey, setEditingKey] = useState('');

	const isEditing = (record: DataType) => record.key === editingKey;

	const edit = (record: Partial<DataType> & { key: React.Key }) => {
		form.setFieldsValue({ service: '', login: '', password: '', ...record });
		setEditingKey(record.key);
	};

	const remove = (record: Partial<DataType> & { key: React.Key }) => {
		const index = data.findIndex((item) => record.key === item.key);
		const newData = data.filter(item => item.key !== record.key);
		onRemove(index);
		setData(newData);
	}

	const cancel = () => {
		setEditingKey('');
	};

	const save = async (key: React.Key) => {
		try {
			const row = (await form.validateFields()) as DataType;
			const newData = [...data];
			const index = newData.findIndex((item) => key === item.key);
			if (index > -1) {
				const item = newData[index];
				onUpdate(index, {...item, ...(row as PasswordRecord)});
				newData.splice(index, 1, {
					...item,
					...row,
				});
				setData(newData);
				setEditingKey('');
			} else {
				newData.push(row);
				setData(newData);
				setEditingKey('');
			}
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo);
		}
	};

	const handleAdd = () => {
		const newData: DataType = {
			key: Date.now().toString(),
			service: 'Новый сервис',
			login: 'Логин',
			password: 'Пароль'
		};
		onAdd(newData);
		setData([...dataSource, newData]);
	};

	const handleExport = () => {
		const dw = document.createElement('a')
		dw.download = 'passwords.txt'
		dw.href = URL.createObjectURL(new Blob([encryptData(data, sessionStorage.getItem('masterPassword') ?? '')]))
		document.body.appendChild(dw)
		dw.click()
		document.body.removeChild(dw)
	}

	const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) {
			return
		}

		const records = decryptData(await e.target.files[0].text(), sessionStorage.getItem('masterPassword') ?? '')
		if (!records) {
			api.error({
				message: 'Ошибка. Введён неверный пароль или файл повреждён',
				placement: 'bottomRight'
			})
			return
		}

		onImport(records)
		setData(records)
	}

	const columns = [
		{
			title: 'Название сервиса',
			dataIndex: 'service',
			width: '25%',
			editable: true,
		},
		{
			title: 'Имя пользователя или e-mail',
			dataIndex: 'login',
			width: '25%',
			editable: true,
		},
		{
			title: 'Пароль для входа',
			dataIndex: 'password',
			width: '25%',
			editable: true,
			render: (_: never, record: DataType) => {
				return <>{new Array(record.password.length).fill(null).map(() => '*')}</>
			}
		},
		{
			title: 'Действие',
			dataIndex: 'operation',
			render: (_: never, record: DataType) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
            <Typography.Link onClick={() => save(record.key)} style={{marginInlineEnd: 8}}>
              Сохранить
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Отменить</a>
            </Popconfirm>
          </span>
				) : (
					<span className="flex gap-4">
						<Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
							Редактировать
						</Typography.Link>
						<Typography.Link disabled={editingKey !== ''} onClick={() => remove(record)}>
							Удалить
						</Typography.Link>
					</span>
				);
			},
		},
	];

	const mergedColumns: ColumnType[] = columns.map(col => {
		if ('editable' in col && !col.editable) {
			return col as BaseColumn;
		}

		return {
			...col,
			onCell: (record: DataType) => ({
				record,
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		} as EditableColumn;
	});

	return (
		<div className="w-full h-full">
			<Form form={form} component={false}>
				<div className="flex gap-2 mb-4">
					<Button onClick={handleAdd} type="primary">
						Добавить запись
					</Button>
					<Button onClick={handleExport} type="primary" color="default">
						Экспорт
					</Button>
					<Button onClick={() => {}} type="primary">
						<label htmlFor="import-passwords">Импорт</label>
						<input
							id="import-passwords"
							type="file"
							accept="text/plain"
							hidden
							onChange={handleImport}
						/>
					</Button>
				</div>
				<Table<DataType>
					components={{
						body: { cell: EditableCell },
					}}
					bordered
					dataSource={data}
					columns={mergedColumns}
					rowClassName="editable-row"
				/>
			</Form>
			{contextHolder}
		</div>
	);
};