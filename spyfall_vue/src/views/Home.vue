<template>
	<div class="pa-4 fill-height d-flex flex-column">
		<div>
			<v-row>
				<v-col cols="12" class="d-flex">
					<UserChip
						class="mx-auto"
						@click="$emit('show:identity-dialog')"
						:user="User"
					/>
				</v-col>
				<v-col cols="12">
					<JoinGameForm @submit="joinGame"/>
				</v-col>
			</v-row>
		</div>
		<v-spacer></v-spacer>
		<v-footer fixed>
			<v-btn :loading="CreateGameLoading" @click="createGame" large block color="primary">
				Create Game
			</v-btn>
		</v-footer>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import JoinGameForm from '../components/JoinGameForm.vue';
import UserChip from '../components/UserChip.vue';
import { gameStore, userStore } from '../store';

@Component({
	components: { JoinGameForm, UserChip },
})
export default class Home extends Vue{
	get CreateGameLoading(): boolean{
		return gameStore.createGameLoading;
	}
	get InGame(): boolean{
		return gameStore.gameState.id && gameStore.gameState.id.length > 0;
	}
	get User(){
		return userStore.user;
	}
	async createGame(){
		await gameStore.createGame();
	}
	async joinGame({ gameId }: {gameId: string}){
		await gameStore.joinGame({ gameId });
	}
	get PlayerId(){
		return gameStore.playerId;
	}
	get Game(){
		return gameStore.gameState;
	}
}
</script>
<style lang="scss" scoped>
.hr-middle{
	margin: 0.5em 0;
	color: #C6C6C6 !important;
}
</style>