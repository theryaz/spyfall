import crypto from 'crypto';

export function sha512(password: string , salt: string){
	let hash = crypto.createHmac('sha512',salt);
	hash.update(password);
	return hash.digest('hex');
}
