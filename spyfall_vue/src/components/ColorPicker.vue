<template>
	<v-dialog
		v-bind="$attrs"
		v-model="showPickColor"
		>

		<template v-slot:activator="{ on }">
			<slot name="activator" :on="on">
				<v-btn v-on="on" color="primary">
					<v-icon v-bind:class="{'mr-2': !dense}">
						fa-palette
					</v-icon>
					<template v-if="!dense">
						Color
					</template>
				</v-btn>
			</slot>
		</template>

		<v-card width="100%" justify="center">
			<v-card-title>
				<slot name="title"></slot>
			</v-card-title>
			<v-card-text class="justify-center">
				<v-color-picker
					:value="color"
					@input="updateColor"
					hide-canvas
					hide-mode-switch
					show-swatches
					:mode="'hexa'"
				/>
			</v-card-text>

			<v-card-actions>
				<v-btn color="crimson" outlined @click="onCancel">
					Cancel
				</v-btn>
				<v-spacer />
				<v-btn color="primary" @click="onSave">
					Save
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

interface Color{
	color: string;
	label: string;
}

@Component
export default class ColorPicker extends Vue{
	@Prop({ default: false, type: Boolean }) dense: boolean;
	
	@Prop({ default: () => [] }) colors: Color[];
	@Prop({ default: () => [] }) addColors: Color[];

	@Prop({ default: "crimson" }) color: string;
	updateColor(color: string){
		this.$emit('update:color', color);
	}

	private showPickColor = false;

	get ColorList(){
		if(this.colors.length > 0){
			return this.colors;
		}
		return [...this.Colors, ...this.addColors];
	}

	get Colors(): Color[]{
		return [];
	}

	onSave(){
		this.$emit('update:color', this.color);
		this.showPickColor = false;
	}
	onCancel(){
		this.showPickColor = false;
		this.$emit('close');
	}
}
</script>