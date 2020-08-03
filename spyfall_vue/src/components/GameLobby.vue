<template>
	<div>
		<v-row>
			<v-col class="text-center">
				Waiting for players.
			</v-col>
		</v-row>
		<v-row>
			<v-col class="text-center">
				GameId: <strong class="monospace">{{GameId}}</strong>
			</v-col>
		</v-row>
		<v-list>
			<v-scroll-y-transition group>
				<v-list-item v-for="(player, index) of Players" :key="index">
					<v-list-item-content>
						<UserChip :user="player.identity" :away="player.clientId === undefined" />
					</v-list-item-content>
				</v-list-item>
			</v-scroll-y-transition>
		</v-list>

		<v-footer fixed>
			<v-row dense>
				<v-col :cols="PlayerIsHost ? 6 : 12">
					<v-btn
						@click="exitGame"
						:loading="StartGameLoading"
						outlined
						large block color="error"
					>
						Exit
					</v-btn>
				</v-col>
				<v-col cols="6" v-if="PlayerIsHost">
					<v-btn
						@click="startGame"
						:loading="StartGameLoading"
						large block color="primary"
					>
						Start Game
					</v-btn>
				</v-col>
			</v-row>
		</v-footer>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import UserChip from './UserChip.vue';
import { GameState, Player } from '../../types/interfaces';
import { gameStore } from '../store';
@Component({
	components: { UserChip },
})
export default class GameLobby extends Vue{
	@Prop() playerId: string;
	@Prop() gameState: GameState;

	get GameId(): string{
		return this.gameState.id;
	}
	get Players(): Player[]{
		return this.gameState.players;
	}

	get PlayerIsHost(): boolean{
		return this.gameState.hostId === this.playerId;
	}
	get StartGameLoading(): boolean{
		return gameStore.startGameLoading;
	}

	startGame(){
		gameStore.startGame();
	}

	exitGame(){
		gameStore.exitGame();
	}

}
</script>
