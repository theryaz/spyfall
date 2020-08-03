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
		<!-- <hr class="my-4" /> -->
		<v-row dense class="my-4" v-if="FirstQuestionPlayer !== undefined">
			<v-col class="text-center d-flex flex-column">
				First Question:
				<UserChip
					:size="30"
					class="mx-auto my-2"
					:user="FirstQuestionPlayer.identity"
				/>
			</v-col>
		</v-row>
		<!-- <hr class="my-4" /> -->
		<v-item-group multiple>
			<v-row dense>
				<v-col cols="6" sm="4" v-for="(location, index) of gameState.locations" :key="index">
					<v-item v-slot:default="{ active, toggle }">
						<v-btn
							small
							block
							color="secondary"
							:outlined="active"
							:class="{'strike-through': active}"
							@click="toggle"
						>
							{{ location }}
						</v-btn>
					</v-item>
				</v-col>
			</v-row>
		</v-item-group>
	</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import UserChip from './UserChip.vue';
import { GameState, Player } from '../../types/interfaces';
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
	get FirstQuestionPlayer(): Player | undefined{
		return this.gameState.players.find(p => p.id === this.gameState.firstQuestionId);
	}

	get PlayerIsSpy(){
		return this.PlayerRole === 'Spy';
	}
	get PlayerRole(){
		return this.Player && this.Player.role;
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
		return `Location: <strong>${this.gameState.location}</strong>`;
	}
	get ToggleButtonText(){
		if(this.hideRoleInfo){
			return "Reveal Role";
		}
		return "Hide Role";
	}
}
</script>
<style lang="scss" scoped>
.strike-through{
	text-decoration: line-through;
}
</style>
