export const getCookie = (name: string) => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
	return null
}

export const setCookie = (key: string, value: string, daysToExpire: number)=> {
	const date = new Date();
	date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
	const expires = "expires=" + date.toUTCString();
	document.cookie = `${key}=${value}; ` + expires + "; path=/";
}