/**
 * @copyright Copyright (c) 2017 Kai Schröer <git@schroeer.co>
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

import Axios, {AxiosPromise} from 'axios';
import * as _ from 'lodash';
import Service from './Service';
import {MindmapNode} from '../models';
import System from '../System';

export default class MindmapNodeService extends Service<MindmapNode> {
	constructor() {
		super('/apps/mindmaps/nodes');
	}

	load(mindmapId?: number): AxiosPromise<MindmapNode[]> {
		if (_.isUndefined(mindmapId)) {
			throw new Error(System.t('Please specify a mindmapId.'));
		}

		return Axios.get(this.baseUrl + '/' + mindmapId, {
			headers: this.headers
		}).then(response => {
			this.data = response.data;
			this.data.forEach(node => {
				node.title = System.t('Author: ') + node.userId;
				if (!_.isNull(node.lockedBy)) {
					node.title = node.title +
						System.t(' / Locked by: ') +
						node.lockedBy;
					node.color = 'red';
				}
			});
			return response;
		}).catch(error => {
			return Promise.reject(error.response);
		});
	}

	remove(id: number): AxiosPromise<MindmapNode> {
		let node: any = this.find(id);
		if (_.isNull(node.parentId)) {
			throw new Error(System.t('Root Node can´t be deleted.'));
		}
		return super.remove(id).then(response => {
			let index = this.data.indexOf(node);
			this.data.splice(index, 1);
			return response;
		}).catch(error => {
			return Promise.reject(error.response);
		});
	}

	lock(id: number): AxiosPromise<MindmapNode> {
		return Axios.post(this.baseUrl + '/' + id + '/locks',
			{},
			{
				headers: this.headers
			}
		).then(response => {
			let node: any = this.find(id);
			let index = this.data.indexOf(node);
			node.title = System.t('Author: ') + node.userId +
				System.t(' / Locked by: ') + node.lockedBy;
			node.color = 'red';
			this.data[index] = node;
			return response;
		}).catch(error => {
			return Promise.reject(error.response);
		});
	}

	unlock(id: number): AxiosPromise<MindmapNode> {
		return Axios.delete(this.baseUrl + '/' + id + '/locks',
			{
				headers: this.headers
			}
		).then(response => {
			let node: any = this.find(id);
			let index = this.data.indexOf(node);
			node.title = System.t('Author: ') + node.userId;
			node.color = '#97C2FC';
			this.data[index] = node;
			return response.data;
		}).catch(error => {
			return Promise.reject(error.response);
		});
	}
}
