import crypto from 'crypto';
import { logger } from './winston-logger';

export function randomAlphaString(length: number){
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let str = '';
	for(let i = 0; i < length; i++){
		str += chars[randomNumber(0,chars.length)];
	}
	return str;
}

export function randomString(length: number){
	let s = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0,length);
	return s;
}

export function randomNumber(min: number, max: number){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomElement<T>(arr: T[]): T{
	return arr[randomNumber(0,arr.length - 1)];
}
