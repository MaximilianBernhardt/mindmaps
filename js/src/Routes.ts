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

import Vue, { ComponentOptions } from 'vue';
import VueRouter from 'vue-router';
import MindmapView from './components/MindmapView.vue';
import Index from './components/Index.vue';

export default class Routes {
	static register(): VueRouter {
		Vue.use(VueRouter);

		const routes = [
			{
				path: '/',
				component: Index as ComponentOptions<Vue>
			},
			{
				path: '/mindmaps/:id',
				component: MindmapView as ComponentOptions<Vue>
			}
		];

		return new VueRouter({
			routes
		});
	}
}
