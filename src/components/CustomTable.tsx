import { Button, Form, Input, Popconfirm, Table, Typography } from 'antd';
import { useState } from "react";

interface DataType {
	key: string;
	service: string;
	login: string;
	password: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	title: any;
	record: DataType;
	index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
	editing,
	dataIndex,
	title,
	record,
	index,
	children,
	...restProps
}) => {
	const editableFields = ['service', 'login', 'password'];

	return (
		<td {...restProps}>
			{editing && editableFields.includes(dataIndex) ? ( // Проверка на редактируемые поля
				<Form.Item
					name={dataIndex as any}
					style={{margin: 0}}
					rules={[
						{
							required: true,
							message: `Please Input ${title}!`,
						},
					]}
				>
					<Input/>
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
}
export const CustomTable = ({ dataSource }: Readonly<CustomTableProps>) => {
	const [form] = Form.useForm();
	const [data, setData] = useState<DataType[]>(dataSource);
	const [editingKey, setEditingKey] = useState('');

	const isEditing = (record: DataType) => record.key === editingKey;

	const edit = (record: Partial<DataType> & { key: React.Key }) => {
		form.setFieldsValue({ name: '', age: '', address: '', ...record });
		setEditingKey(record.key);
	};

	const remove = (record: Partial<DataType> & { key: React.Key }) => {
		const newData = data.filter(item => item.key !== record.key);
		setData(newData);
	}

	const handleAdd = () => {
		const newData: DataType = {
			key: (data.length+1).toString(),
			service: 'Новый сервис',
			login: 'Логин',
			password: 'Пароль'
		};
		setData([...dataSource, newData]);
	};

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
		},
		{
			title: 'Действие',
			dataIndex: 'operation',
			render: (_: any, record: DataType) => {
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
				<div className="flex gap-4 mb-4">
					<Button onClick={handleAdd} type="primary">
						Добавить запись
					</Button>
					<Button onClick={() => {}} type="primary" color="default">
						Экспорт
					</Button>
					<Button onClick={() => {}} type="primary">
						Импорт
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
		</div>
	);
};