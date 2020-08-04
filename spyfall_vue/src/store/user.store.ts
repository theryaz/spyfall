import store from '../store/store';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { UserIdentity } from '@/../../types/interfaces';
import localforage from 'localforage';
import { LocalStorageKeys, SocketEvents } from '@/config/constants';
import api from '@/services/backend.service';

const Mutations = {
	SET_USER: 'SET_USER',
}
const name = 'UserStore';

const getDefaultUser = (): UserIdentity => ({
	name: '',
	color: 'primary',
	icon: 'fa-user-secret',
	iconColor: 'secondary',
})

@Module({
	namespaced: true,
	dynamic: true,
	name,
	store: store
})
export default class UserModule extends VuexModule {

	get HasName(){
		return this.user.name !== '';
	}

	user: UserIdentity = getDefaultUser();
	@Mutation [Mutations.SET_USER](user: UserIdentity){
		this.user = user;
	}

	@Action({ rawError: true })
	async saveUser(user?: UserIdentity){
		if (user){
			this.context.commit(Mutations.SET_USER, user);
		}
		await localforage.setItem<UserIdentity>(LocalStorageKeys.User, this.user);
		api.Socket.emit(SocketEvents.UPDATE_IDENTITY, { identity: user });
	}
	@Action({ rawError: true })
	async loadUser(): Promise<UserIdentity | null>{
		const user = await localforage.getItem<UserIdentity>(LocalStorageKeys.User);
		if (user !== null){
			this.context.commit(Mutations.SET_USER, user);
		}
		return user;
	}
	@Action({ rawError: true })
	async reset(){
		this.saveUser(getDefaultUser());
	}
}
