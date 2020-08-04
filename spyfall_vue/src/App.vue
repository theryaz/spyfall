<template>
	<v-app>
		<v-navigation-drawer
			v-if="useNavBar"
			app fixed dark
			color="primary"
			v-model="showSideNav"
		>
			<v-list>
				<v-list-item
					to="/identity"
				>
					<v-list-item-icon>
						<v-icon>
							fal fa-search
						</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>
							Game
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item
					to="/identity"
				>
					<v-list-item-icon>
						<v-icon>
							fa fa-user-secret
						</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>
							Identity
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar
			app
			color="primary"
			dark
		>
			<v-app-bar-nav-icon v-if="useNavBar" @click.stop="showSideNav = !showSideNav"></v-app-bar-nav-icon>
			<v-toolbar-title>
				<v-btn text @click="clickTitle">
					{{ Title }}
				</v-btn>
			</v-toolbar-title>

			<v-spacer></v-spacer>
			<v-btn @click="showIdentityDialog = true" text>
				<v-icon>
					fa-gear
				</v-icon>
			</v-btn>
		</v-app-bar>

		<v-main>
			<router-view @show:identity-dialog="showIdentityDialog = true"></router-view>
		</v-main>
		<SettingsDialog
			:show.sync="showIdentityDialog"
			:user="User"
			@submit="setUser"
		/>
	</v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import UserChip from './components/UserChip.vue';
import SettingsDialog from './components/SettingsDialog.vue';
import { UserIdentity, GameState } from '../types/interfaces';
import { gameStore, userStore } from './store';
import { RawLocation } from 'vue-router';
import { GameStatus } from '../types/enums';

@Component({
	name: 'App',
	components: { SettingsDialog, UserChip },
})
export default class App extends Vue{
	useNavBar = false;
	showSideNav = false;

	showIdentityDialog = false;

	clickTitle(){
		this.$router.push(this.HomeLink);
	}
	get HomeLink(): RawLocation{
		if(gameStore.InGame && gameStore.gameState.status === GameStatus.InProgress){
			return { name: 'GameInProgress' };
		}else if(gameStore.InGame && gameStore.gameState.status === GameStatus.WaitingToStart){
			return { name: 'GameLobby' };
		}
		return { name: 'Home' };
	}

	get Title(): string{
		if(gameStore.InGame && gameStore.gameState.status === GameStatus.WaitingToStart){
			return 'Waiting to start';
		}else if(gameStore.InGame && gameStore.gameState.status === GameStatus.WaitingToStart){
			return 'In Progress';
		}
		return 'Spyfall';
	}

	get Game(): GameState{
		return gameStore.gameState;
	}

	get User(){
		return userStore.user;
	}

	setUser(user: UserIdentity){
		userStore.saveUser(user);
	}

	async created(){
		userStore.loadUser();
		await gameStore.loadGameState();
	}
}
</script>
<style lang="scss">
a{
	color: white;
}
.cursor-pointer{
	cursor: pointer;
}
.upper-case{
	text-transform: uppercase;
}
.flip-icon-180{
	transition: transform 0.4s ease;
	&.v-icon{
		transform: rotateZ(180deg);
	}
}
.monospace{
	font-family: monospace;
}
</style>