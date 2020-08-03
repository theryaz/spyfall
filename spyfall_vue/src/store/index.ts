import { getModule } from 'vuex-module-decorators';

import UserModule from './user.store';
export const userStore = getModule(UserModule);

import GameModule from './game.store';
export const gameStore = getModule(GameModule);
