
export const ENVIRONMENT_NAME = process.env.VUE_APP_ENVIRONMENT_NAME;
export let BASE_URL = 'http://192.168.132.196:4280';

if (process.env.VUE_APP_ENVIRONMENT_NAME == "staging") {

	BASE_URL = 'https://api.spyfall.staging.v-eden.com';

} else if (process.env.VUE_APP_ENVIRONMENT_NAME == "production") {

	BASE_URL = 'https://api.spyfall.v-eden.com';

}