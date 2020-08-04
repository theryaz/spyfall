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
		<v-form @submit.prevent="submit" v-model="formValue.valid">
		<v-row justify="center" class="my-6 mx-4">
			<UserChip :user="UserPreview">
				<template v-slot:name>
					<v-text-field
						solo
						@input="update"
						v-model="user.name"
						append-icon="fal fa-edit"
					/>
				</template>
			</UserChip>
		</v-row>
		<v-row dense class="mx-4">
			<v-col>
				<AvatarPicker
					:avatar.sync="userIcon"
					:icon-color="iconColor"
					:background-color="userColor"
				>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" outlined color="primary" block small>
							<v-icon small class="mr-2">
								fa-user
							</v-icon>
							Pick Avatar
						</v-btn>
					</template>
				</AvatarPicker>
			</v-col>
		</v-row>
		<v-row dense class="mx-4">
			<v-col>
				<ColorPicker :color.sync="iconColor">
					<template v-slot:title>
						<UserChip :user="UserPreview" />
					</template>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" outlined color="primary" block small>
							<v-icon small class="mr-2">
								fa-palette
							</v-icon>
							Icon Color
						</v-btn>
					</template>
				</ColorPicker>
			</v-col>
			<v-col>
				<ColorPicker :color.sync="userColor">
					<template v-slot:title>
						<UserChip :user="UserPreview" />
					</template>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" outlined color="primary" block small>
							<v-icon small class="mr-2">
								fa-palette
							</v-icon>
							Player Color
						</v-btn>
					</template>
				</ColorPicker>
			</v-col>
		</v-row>
		<v-footer fixed>
			<v-row dense>
				<v-col cols="6">
					<v-btn @click="reset" outlined color="error" block large>
						<v-icon small class="mr-2">
							fa-undo
						</v-icon>
						Reset
					</v-btn>
				</v-col>
				<v-col cols="6">
					<v-btn @click="submit" :disabled="!formValue.valid" large block color="secondary" class="white--text">
						Save
					</v-btn>
				</v-col>
			</v-row>
		</v-footer>
		<button type="submit" hidden />
		</v-form>
	</v-card>
</v-dialog>
</template>
<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { FormRulesMixin } from '../mixins';
import { UserIdentity } from '../../types/interfaces';
import UserChip from './UserChip.vue';
import AvatarPicker from './AvatarPicker.vue';
import ColorPicker from './ColorPicker.vue';
import { userStore } from '../store';

@Component({
	components: { AvatarPicker, ColorPicker, UserChip },
})
export default class SettingsDialog extends Mixins(FormRulesMixin){

	@Watch('user') userChanged(user: UserIdentity){
		this.userColor = user.color;
		this.iconColor = user.iconColor;
		this.userIcon = user.icon;
	}

	created(){
		if(this.user){
			this.userColor = this.user.color;
			this.iconColor = this.user.iconColor;
			this.userIcon = this.user.icon;
		}
	}

	async reset(){
		await userStore.reset();
		this.userColor = this.user.color;
		this.iconColor = this.user.iconColor;
		this.userIcon = this.user.icon;
	}

	get UserPreview(): UserIdentity{
		return {
			...this.user,
			color: this.userColor,
			iconColor: this.iconColor,
			icon: this.userIcon,
		};
	}
	userColor = "";
	userIcon = "";
	iconColor = "";

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
		this.$emit('submit', this.UserPreview);
		this.close();
	}
}
</script>
