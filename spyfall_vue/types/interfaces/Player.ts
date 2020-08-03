import { UserIdentity } from './UserIdentity';
export interface Player{
	id: string;
	role: string;
	identity: UserIdentity;
	clientId?: string;
}