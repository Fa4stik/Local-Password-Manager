import { decryptData, encryptData } from "../../src/lib/cryptData";

it('correct encrypt and decrypt data', () => {
	const services = [{ key: '1', login: "1", service: '1', password: '1' }]
	const secureKey = '123'
	const data = encryptData(services, secureKey)
	const decryptedDataCorrect = decryptData(data, '123')
	expect(decryptedDataCorrect).toEqual(services)
	const decryptedDataIncorrect = decryptData(data, '51q')
	expect(decryptedDataIncorrect).toBeNull()
})