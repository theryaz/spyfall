<template>
	<v-form @submit.prevent="submit" v-model="formValue.valid">
		<v-row>
			<v-col>
				<v-text-field
					:disabled="disabled"
					solo hide-details
					:placeholder="Placeholder"
					v-model="formValue.gameId"
					@input="updateValue"
					:rules="rules.required('Game Id')"
					append-icon="fal fa-mask"
				>
				</v-text-field>
			</v-col>
		</v-row>
		<v-row>
			<v-col class="d-flex">
				<v-spacer></v-spacer>
				<v-btn @click="submit" :disabled="SubmitDisabled" large block color="secondary" class="white--text">
					Join Game
				</v-btn>
			</v-col>
		</v-row>
	</v-form>
</template>
<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { FormRulesMixin } from '../mixins';
import { JoinGameFormValue } from '../../types/interfaces';

@Component
export default class JoinGameForm extends Mixins(FormRulesMixin){
	@Prop({  type: Boolean, default: false }) disabled: boolean;

	@Prop({ default: () => ({
		valid: false,
		gameId: "",
	}) }) formValue: JoinGameFormValue;
	updateValue(){
		this.$emit('update:form-value', this.formValue);
	}

	get Placeholder(){
		return 'Game Id';
	}

	get SubmitDisabled(){
		return this.disabled || !this.formValue.valid;
	}

	submit(){
		this.$emit('submit', this.formValue);
	}
}
</script>
