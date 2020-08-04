<template>
<div class="d-flex cursor-pointer" @click="$emit('click')">
	<template v-if="!hideAvatar">
		<v-avatar :size="size" :color="user.color" class="mr-2">
			<slot name="icon">	
				<v-icon :size="IconSize" :color="user.iconColor">
					{{ user.icon }}
				</v-icon>
			</slot>
		</v-avatar>
	</template>
	<div class="my-auto" :class="{'accent--text': dark}">
		<slot name="name" :userName="Name" :away="away">
			{{ Name }} <span v-if="away">(zzz)</span>
		</slot>
	</div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { UserIdentity } from '../../types/interfaces';

@Component
export default class UserChip extends Vue{
	@Prop({ type: Number, default: 46 }) size?: number;
	@Prop({ type: Boolean, default: false }) dark?: boolean;
	@Prop({ type: Boolean, default: false }) hideAvatar?: boolean;
	@Prop({ type: Boolean, default: false }) away?: boolean;
	@Prop({default: (): UserIdentity => ({
		name: '',
		color: 'secondary',
		icon: 'fa-user-secret',
		iconColor: 'accent',
	}) }) user?: UserIdentity;

	get Name(){
		if(this.user.name.length > 0) return this.user.name;
		return 'Choose a name';
	}

	get IconSize(){
		return this.size * 0.6;
	}
}
</script>
