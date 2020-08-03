import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import GameView from '../components/GameView.vue'
import GameLobby from '../components/GameLobby.vue'

import { gameStore } from '../store';

// component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		props: true,
	},
	{
		path: '/game',
		component: Game,
		props: true,
		children:[
			{
				path: '',
				name: 'GameLobby',
				component: GameLobby,
				props: () => ({
					playerId: gameStore.playerId,
					gameState: gameStore.gameState,
				}),
			},
			{
				path: 'in-progress',
				name: 'GameInProgress',
				component: GameView,
				props: () => ({
					playerId: gameStore.playerId,
					gameState: gameStore.gameState,
				}),
			}
		]
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
