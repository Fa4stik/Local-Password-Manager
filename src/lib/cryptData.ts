import * as CryptoJS from 'crypto-js';
import { PasswordRecord, PasswordRecordSchema } from "../store/usePasswordsStore";

export const encryptData = (data: PasswordRecord[], secretKey: string) =>
	CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();

export const decryptData = (ciphertext: string, secretKey: string) => {
	try {
		const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
		const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
		return PasswordRecordSchema.array().parse(JSON.parse(decryptedData));
	} catch (_e: unknown) {
		console.log(_e)
		return null
	}
};