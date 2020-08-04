<template>
	<div>
		<v-expand-transition>
			<div v-show="!hideRoleInfo">
				<v-row dense>
					<v-col class="text-center" v-html="Role">
					</v-col>
				</v-row>
				<v-row dense>
					<v-col class="text-center" v-html="Location">
					</v-col>
				</v-row>
			</div>
		</v-expand-transition>
		<v-row dense class="mt-4">
			<v-col>
				<v-btn outlined @click="toggleHide" color="primary" small block>
					<v-icon x-small class="mr-4" :class="{'flip-icon-180': !hideRoleInfo}">
						fa-chevron-down
					</v-icon>
					{{ ToggleButtonText }}
				</v-btn>
			</v-col>
		</v-row>
		<h5 class="mt-4">
			Players
		</h5>
		<v-item-group multiple>
			<v-row dense>
				<v-col v-for="(player, index) of Players" :key="index">
					<v-item v-slot:default="{ active, toggle }">
						<v-btn
							:color="active ? 'accent' : 'primary'"
							outlined block
							:class="{'strike-through': active}"
							@click="toggle"
						>
							<UserChip
								:size="30"
								class="mx-auto my-2"
								:splat="FirstQuestionPlayer === player"
								splat-dot
								:user="player.identity"
							/>
						</v-btn>
					</v-item>
				</v-col>
			</v-row>
		</v-item-group>
		<h5 class="mt-4">
			Locations
		</h5>
		<v-item-group multiple>
			<v-row dense>
				<v-col cols="6" sm="4" v-for="(location, index) of gameState.locations" :key="index">
					<v-item v-slot:default="{ active, toggle }">
						<v-btn
							small
							block
							:color="active ? 'accent' : 'primary'"
							outlined
							:class="{'strike-through': active}"
							@click="toggle"
						>
							{{ location }}
						</v-btn>
					</v-item>
				</v-col>
			</v-row>
		</v-item-group>
		<v-row dense class="mt-6">
			<v-col cols="6" v-if="PlayerIsHost">
				<v-btn
					@click="resetGame"
					outlined
					large block color="error"
				>
					End Game
				</v-btn>
			</v-col>
			<v-col :cols="PlayerIsHost ? 6 : 12">
				<v-btn
					large block color="primary"
				>
					Vote
				</v-btn>
			</v-col>
		</v-row>
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
export default class GameView extends Vue{
	@Prop() playerId: string;
	@Prop() gameState: GameState;

	hideRoleInfo = false;

	toggleHide(){
		this.hideRoleInfo = !this.hideRoleInfo;
	}

	get Player(): Player | undefined{
		return this.gameState.players.find(p => p.id === this.playerId);
	}
	get Players(): Player[]{
		return this.gameState.players;
	}
	get FirstQuestionPlayer(): Player | undefined{
		return this.gameState.players.find(p => p.id === this.gameState.firstQuestionId);
	}

	get PlayerIsSpy(){
		return this.PlayerRole === 'Spy';
	}
	get PlayerRole(){
		if(this.Player === undefined) return "";
		return this.Player.role;
	}
	get PlayerIsHost(): boolean{
		return this.gameState.hostId === this.playerId;
	}

	get Role(){
		if(this.PlayerIsSpy){
			return "You are the Spy!";
		}
		return `Your role: <strong>${this.PlayerRole}</strong>`;
	}
	get Location(){
		if(this.PlayerIsSpy){
			return 'Location: ???';
		}
		return `Location: <strong>${this.gameState.location.name}</strong>`;
	}
	get ToggleButtonText(){
		if(this.hideRoleInfo){
			return "Reveal Role";
		}
		return "Hide Role";
	}

	resetGame(){
		gameStore.resetGame();
	}
	exitGame(){
		gameStore.exitGame();
	}
}
</script>
<style lang="scss" scoped>
.strike-through{
	text-decoration: line-through;
}
</style>
