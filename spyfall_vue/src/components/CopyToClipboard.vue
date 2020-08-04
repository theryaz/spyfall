<template>
	<v-hover>
		<template v-slot:default="{ hover }">
			<span
				ref="copyToClipboardEl"
				:style="{ 'color': getTextColor(hover) }"
				class="cursor-pointer no-select d-inline-block copy-to-clipboard"
				@click="copyToClipboard"
			>	
				<slot v-if="!noIcon" name="icon" :color="getTextColor(hover)">
					<v-icon :color="getTextColor(hover)">
						fa-copy
					</v-icon>
				</slot>
				<div class="ml-1 copy-to-clipboard-text">
					<div class="display-text">
						<slot>{{ text }}</slot>
					</div>
					<div ref="animatedText" class="copy-to-clipboard-animation">
						<slot>{{ text }}</slot>
					</div>
				</div>
			</span>
		</template>
	</v-hover>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class CopyToClipboard extends Vue{
	@Prop({ default: 'accent' }) hoverColor: string;
	@Prop() text: string;
	@Prop() clipboardText: string;
	@Prop({  type: Boolean, default: false }) noIcon: boolean;
	@Prop({  type: Boolean, default: false }) button: boolean;
	@Prop({  type: Boolean, default: false }) dark: boolean;

	$refs: {
		animatedText: HTMLSpanElement;
		copyToClipboardEl: HTMLSpanElement;
	}

	get Color(){
		return this.dark ? 'white' : 'black';
	}
	get HoverColor(){
		return this.hoverColor;
	}
	getTextColor(hovered: boolean){
		return hovered ? this.HoverColor : this.Color;
	}
	
	useClipboardText: string;

	@Watch('clipboardText') setupClipboardText(){
		if(this.clipboardText && this.clipboardText.length > 0){
			this.useClipboardText = this.clipboardText;
		}else{
			this.useClipboardText = this.text;
		}
	}

	mounted(){
		this.setupClipboardText();
	}

	runClickAnimation(){
		this.$refs.animatedText.classList.remove('run-animation');
		this.$refs.animatedText.offsetWidth;
		this.$refs.animatedText.classList.add('run-animation');
	}
	copyToClipboard(){
		if(this.button === true){
			this.$emit('click');
			return;
		}
		const selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = this.useClipboardText;
		this.$refs.copyToClipboardEl.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand('copy');
		this.$refs.copyToClipboardEl.removeChild(selBox);
		this.runClickAnimation();
	}
}
</script>
<style lang="scss" scoped>
@keyframes text-copy-animation {
  0%   {
		transform: translateY(0);
		opacity: 1;
	}
  100% {
		transform: translateY(-20px);
		opacity: 0;
	}
}

.copy-to-clipboard{
	transition: all 0.1s ease;
}
.copy-to-clipboard-text{
	display: inline-grid;
	.display-text, .copy-to-clipboard-animation{
		grid-column: 1;
		grid-row: 1;
	}
}
.copy-to-clipboard-animation{
	opacity: 1;
	&.run-animation{
		animation: text-copy-animation 0.5s 1;
	}
}
</style>