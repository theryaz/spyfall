import { Component, Vue } from 'vue-property-decorator';

@Component
export class FormRulesMixin extends Vue {
	rules = {
		required: (fieldName = "Field") => [(v: any) => !!v || `${fieldName} is required`],
	}
}
