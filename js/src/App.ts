/**
 * @copyright Copyright (c) 2018 Kai Schröer <git@schroeer.co>
 *
 * @author Kai Schröer <git@schroeer.co>
 *
 * @license GNU AGPL version 3 or any later version
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import Vue from 'vue';
import AppContent from './components/AppContent.vue';
import AppNavigation from './components/AppNavigation.vue';
import Routes from './Routes';
import Mixins from './Mixins';

class App {
	static start(): void {
		// Add global mixins
		Vue.mixin(Mixins);
		// Register the routes
		const router = Routes.register();
		// Init Vue.js
		new Vue({
			router,
			el: '#app',
			components: {
				'app-content': AppContent,
				'app-navigation': AppNavigation
			}
		});
	}
}

window.onload = () => {
	App.start();
};
