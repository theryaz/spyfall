import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const USE_DARK_MODE = false;

const COLORS = {
	'charcoal': '#264653',
	'persian-green': '#2a9d8f',
	'light-gray': '#dad2d8',
	'carrot-orange': '#ec9a29',
	'carnelian': '#a8201a',
};

export const THEME = {
	'primary': COLORS.charcoal,
	'secondary': COLORS["persian-green"],
	'accent': COLORS["light-gray"],
	'accent-orange': COLORS["carrot-orange"],
	'error': COLORS.carnelian,
	'info': '#2196F3',
	'success': '#4CAF50',
	'warning': '#FFC107',
};

export default new Vuetify({
	theme: {
		dark: USE_DARK_MODE,
		themes: {
			light: {
				...THEME,
			},
			dark: {
				...THEME,
			},
		},
	},
	icons: {
		iconfont: "fa",
	},
});
