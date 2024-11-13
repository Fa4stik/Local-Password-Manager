import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { getCookie, setCookie } from "../lib/cookie.ts";
import { Button, Form, Input, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { decryptData } from "../lib/cryptData.ts";
import { usePasswordsStore } from "../store/usePasswordsStore.ts";

type FieldType = {
	masterPassword?: string;
};

export const Login = () => {
	const [api, contextHolder] = notification.useNotification();
	const [isFirstVisit, setIsFirstVisit] = useState(false)

	const navigate = useNavigate({ from: '/' })

	const cryptedRecords = usePasswordsStore(state => state.cryptedRecords)
	const importRecords = usePasswordsStore(state => state.importRecords)
	const updatedCryptedRecords = usePasswordsStore(state => state.updatedCryptedRecords)

	const handleSign = useCallback(({ masterPassword }: { masterPassword: string }) => {
		sessionStorage.setItem('masterPassword', masterPassword)
		if (isFirstVisit) {
			setCookie('isFirstVisit', String(false), 999)
			navigate({ to: '/main' })
			return
		}

		const data = decryptData(cryptedRecords, masterPassword)
		if (!data) {
			api.error({
				message: 'Ошибка. Введён неверный пароль',
				placement: 'bottomRight'
			})
			return;
		}

		navigate({ to: '/main' })
		importRecords(data)
	}, [isFirstVisit]);

	const handleReset = useCallback(() => {
		setCookie('isFirstVisit', '', 0)
		setIsFirstVisit(true)
		importRecords([])
		updatedCryptedRecords('')
	}, []);

	useEffect(() => {
		const isFirst = getCookie('isFirstVisit')
		if (isFirst) {
			return
		}

		setIsFirstVisit(true)
	}, [])

	return <div className="max-w-screen min-h-screen flex flex-col justify-center items-center">
		<Form
			name="basic"
			layout={'vertical'}
			initialValues={{ remember: true }}
			onFinish={handleSign}
			autoComplete="off"
		>
			<Form.Item<FieldType>
				label="Мастер-пароль"
				name="masterPassword"
				rules={[{ required: true, message: 'Введите мастер-пароль более 3 символов!', min: 3 }]}
			>
				<Input.Password
					placeholder="Введите пароль..."
					iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
				/>
			</Form.Item>

			<Form.Item label={null} >
				<div className="flex gap-2">
					<Button type="primary" htmlType="submit">
						{isFirstVisit ? 'Создать' : 'Вход'}
					</Button>
					{!isFirstVisit && (
						<Button type="default" htmlType="button" onClick={handleReset}>
							Сбросить
						</Button>
					)}
				</div>
			</Form.Item>
		</Form>
		{contextHolder}
	</div>
};