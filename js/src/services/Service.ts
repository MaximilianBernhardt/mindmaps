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

import Axios, { AxiosPromise } from 'axios';

import Model from '../models/Model';

export default abstract class Service<T extends Model> {
	protected baseUrl: string;
	protected headers: object;
	protected data: T[];

	constructor(baseUrl: string) {
		this.baseUrl = OC.generateUrl(baseUrl);
		this.headers = {
			'requesttoken': OC.requestToken,
			'OCS-APIREQUEST': 'true'
		};
		this.data = [];
	}

	find(id: number): T | null {
		let obj: T | null = null;
		this.data.forEach(entry => {
			if (entry.id === id) {
				obj = entry;
			}
		});
		return obj;
	}

	getAll(): T[] {
		return this.data;
	}

	load(): AxiosPromise<T[]> {
		return Axios.get(this.baseUrl, {
			headers: this.headers
		}).then(response => {
			this.data = response.data;
			return response;
		}).catch(error => {
			return Promise.reject(error.response);
		});
	}

	create(obj: T): AxiosPromise<T> {
		return Axios.post(this.baseUrl,
			obj,
			{
				headers: this.headers
			}
		).then(response => {
			this.data.push(response.data);
			return response;
		}).catch(error => {
			return Promise.reject(error.response);
		});
	}

	update(obj: T): AxiosPromise<T> {
		return Axios.put(`${this.baseUrl}/${obj.id}`,
			obj,
			{
				headers: this.headers
			}
		).then(response => {
			const index = this.data.indexOf(obj);
			this.data[index] = response.data;
			return response;
		}).catch(error => {
			return Promise.reject(error.response);
		});
	}

	remove(id: number): AxiosPromise<T> {
		return Axios.delete(`${this.baseUrl}/${id}`,
			{
				headers: this.headers
			}
		).then(response => {
			let entry = this.find(response.data.id);
			if (!_.isNull(entry)) {
				const index = this.data.indexOf(entry as T);
				this.data.splice(index, 1);
			}
			return response;
		}).catch(error => {
			return Promise.reject(error.response);
		});
	}
}
