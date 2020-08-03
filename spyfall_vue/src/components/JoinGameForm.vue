<template>
	<v-form @submit.prevent="submit" v-model="formValue.valid">
		<v-row>
			<v-col>
				<v-text-field
					solo hide-details placeholder="Game Id"
					v-model="formValue.gameId"
					:rules="rules.required('Game Id')"
					append-icon="fal fa-mask"
				>
				</v-text-field>
			</v-col>
		</v-row>
		<v-row>
			<v-col class="d-flex">
				<v-spacer></v-spacer>
				<v-btn @click="submit" :disabled="!formValue.valid" large block color="secondary" class="white--text">
					Join Game
				</v-btn>
			</v-col>
		</v-row>
	</v-form>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { FormRulesMixin } from '../mixins';

@Component
export default class JoinGameForm extends Mixins(FormRulesMixin){
	formValue = {
		valid: false,
		gameId: "",
	}

	submit(){
		this.$emit('submit', this.formValue);
	}
}
</script>
