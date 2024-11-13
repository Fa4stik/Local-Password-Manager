import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { getCookie, setCookie } from "../lib/cookie.ts";
import * as React from "react";

type LoginProps = {

}

export const Login = ({

}: LoginProps) => {
	const navigate = useNavigate({ from: '/login' })

	const [masterPassword, setMasterPassword] = useState('')
	const [isFirstVisit, setIsFirstVisit] = useState(false)

	const handleChangePassword = useCallback(setMasterPassword, []);

	const handleSign = useCallback(() => {
		if (isFirstVisit) {
			setCookie('isFirstVisit', String(false), 999)
		}

		sessionStorage.setItem('masterPassword', masterPassword)
		navigate({ to: '/main' })
	}, [isFirstVisit]);

	useEffect(() => {
		const isFirst = getCookie('isFirstVisit')
		if (isFirst) {
			return
		}

		setIsFirstVisit(true)
	}, [])

	return <div className="w-full h-full flex flex-col justify-center items-center">
		<form className="flex flex-col items-start justify-center gap-2">
			<label htmlFor="" className="flex flex-col gap-2">
				Введите мастер-пароль:
				<input
					type="text"
					className="border-2 border-solid border-black/30"
					onChange={({target: {value}}) => handleChangePassword(value)}
					value={masterPassword}
				/>
			</label>
			<button onClick={handleSign}>{isFirstVisit ? 'Создать' : 'Вход'}</button>
		</form>
	</div>
};