<template>
<v-dialog
	:value="show"
	@input="updateShow"
	fullscreen hide-overlay transition="dialog-bottom-transition"
>
	<v-card tile>
		<v-toolbar dark color="primary">
			<v-toolbar-title>
				<v-btn text>
					Settings
				</v-btn>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items>
				<v-btn icon dark @click="close">
					<v-icon>fal fa-window-close</v-icon>
				</v-btn>
			</v-toolbar-items>
		</v-toolbar>
		<v-row justify="center" class="my-6">
			<UserChip :user="user" />
		</v-row>
		<v-form @submit.prevent="submit" class="pa-4" v-model="formValue.valid">
			<v-row>
				<v-col>
					<v-text-field
						solo hide-details placeholder="Nickname"
						@input="update"
						v-model="user.name"
						:rules="rules.required('Nickname')"
						append-icon="fal fa-mask"
					>
					</v-text-field>
				</v-col>
			</v-row>
			<v-row>
				<v-col class="d-flex">
					<v-spacer></v-spacer>
					<v-btn @click="submit" :disabled="!formValue.valid" large block color="secondary" class="white--text">
						Save
					</v-btn>
				</v-col>
			</v-row>
			<button type="submit" hidden />
		</v-form>
	</v-card>
</v-dialog>
</template>
<script lang="ts">
import { Component, Prop,  Mixins } from 'vue-property-decorator';
import { FormRulesMixin } from '../mixins';
import { UserIdentity } from '../../types/interfaces';
import UserChip from './UserChip.vue';

@Component({
	components: { UserChip },
})
export default class ConfigureIdentity extends Mixins(FormRulesMixin){
	@Prop({ required: true }) user: UserIdentity;
	update(){
		this.$emit('update:user', this.user);
	}

	@Prop({ default: false, type: Boolean }) show: boolean;
	updateShow(show: boolean){
		this.$emit('update:show', show);
	}

	close(){
		this.updateShow(false);
	}

	formValue = {
		valid: false,
	}

	submit(){
		this.$emit('submit', this.user);
		this.close();
	}
}
</script>
