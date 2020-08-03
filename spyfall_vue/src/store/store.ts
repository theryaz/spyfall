import Vue from 'vue';
import Vuex from 'vuex';
import UserModule from './user.store';
import GameModule from './game.store';

Vue.use(Vuex)

interface AppState{
	UserStore: UserModule;
	GameStore: GameModule;
}

export default new Vuex.Store<AppState>({})