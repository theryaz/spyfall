<template>
	<div class="pa-4 d-flex flex-column">
		<div>
			<v-row>
				<v-col cols="12" class="d-flex">
					<UserChip
						class="mx-auto"
						@click="$emit('show:identity-dialog')"
						:user="User"
					>
						<template v-slot:name="{userName}">
							<v-text-field
								solo disabled
								:value="userName"
								append-icon="fal fa-edit"
							/>
						</template>
					</UserChip>
				</v-col>
				<v-col cols="12" v-if="!UserHasName">
					<v-alert class="text-center white--text" color="secondary">
						<v-icon class="mr-2" color="white">
							fal fa-lightbulb-on
						</v-icon>
						Choose a name to get started!
					</v-alert>
				</v-col>
				<v-col cols="12">
					<JoinGameForm :disabled="!UserHasName" @submit="joinGame" :formValue.sync="joinGameFormValue"/>
				</v-col>
			</v-row>
		</div>
		<v-spacer></v-spacer>
		<v-footer fixed>
			<v-btn
				v-if="joinGameFormValue.valid === false"
				:disabled="!UserHasName"
				:loading="CreateGameLoading"
				@click="createGame"
				large block color="primary"
			>
				Create Game
			</v-btn>
			<v-btn
				v-else
				:loading="JoinGameLoading"
				@click="joinGame"
				large block color="secondary"
			>
				Join Game
			</v-btn>
		</v-footer>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import JoinGameForm from '../components/JoinGameForm.vue';
import UserChip from '../components/UserChip.vue';
import { gameStore, userStore } from '../store';
import { JoinGameFormValue } from '../../types/interfaces';

@Component({
	components: { JoinGameForm, UserChip },
})
export default class Home extends Vue{
	get JoinGameLoading(): boolean{
		return gameStore.joinGameLoading;
	}
	get CreateGameLoading(): boolean{
		return gameStore.createGameLoading;
	}
	get InGame(): boolean{
		return gameStore.gameState.id && gameStore.gameState.id.length > 0;
	}
	get User(){
		return userStore.user;
	}
	get UserHasName(){
		return userStore.HasName;
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

	joinGameFormValue: JoinGameFormValue = {
		valid: false,
		gameId: "",
	};

	created(){
		if(this.$route.query.gameId && !Array.isArray(this.$route.query.gameId)){
			this.joinGameFormValue.gameId = this.$route.query.gameId;
			setTimeout(() => {
				this.joinGame({ gameId: this.joinGameFormValue.gameId });
			}, 1000);
		}
	}
}
</script>
<style lang="scss" scoped>
.hr-middle{
	margin: 0.5em 0;
	color: #C6C6C6 !important;
}
</style>