<template>
	<v-progress-circular
		width="2"
		rotate="270"
		color="secondary"
		:value="TimeRemainingPercentage"
	>
		<span :style="{'font-size': '10px'}">
			{{ TimeRemaining }}
		</span>
	</v-progress-circular>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { gameStore } from '../store';
import { formatDuration } from '../helpers';
@Component
export default class GameTimer extends Vue{

	@Prop({ type: Boolean, default: true }) running?: boolean;

	get TimeRemaining(): string{
		return formatDuration(gameStore.gameState.currentTimer);
	}

	get TimeRemainingPercentage(){
		return ~~((gameStore.gameState.currentTimer / gameStore.gameState.timerSeconds) * 100);
	}

	interval: NodeJS.Timeout;
	created(){
		this.interval = setInterval(this.tick.bind(this), 1000);
	}
	beforeDestroy(){
		if(this.interval) clearInterval(this.interval);
	}

	tick(){
		if(this.running === false) return;
		gameStore.updateGameTime();
	}
}
</script>
