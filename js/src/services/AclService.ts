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

import Service from './Service';
import { Acl } from '../models';

export default class AclService extends Service<Acl> {
	constructor() {
		super('/apps/mindmaps/acl');
	}

	load(mindmapId?: number): AxiosPromise<Acl[]> {
		if (_.isUndefined(mindmapId)) {
			throw new Error(t('mindmaps', 'Please specify a mindmapId.'));
		}

		return Axios.get(`${this.baseUrl}/${mindmapId}`, {
			headers: this.headers
		}).then(response => {
			this.data = response.data;
			return response;
		}).catch(error => {
			return Promise.reject(error.response);
		});
	}

	getAutocomplete(search: string): AxiosPromise<any> {
		return Axios.get(
			OC.linkToOCS('apps/files_sharing/api/v1') + 'sharees',
			{
				params: {
					format: 'json',
					search: search.trim(),
					perPage: 10,
					itemType: [
						OC.Share.SHARE_TYPE_USER,
						OC.Share.SHARE_TYPE_GROUP,
						OC.Share.SHARE_TYPE_CIRCLE
					]
				},
				headers: this.headers
			}
		).then(response => {
			if (response.data.ocs.meta.statuscode !== 100) {
				throw new Error(t('mindmaps', 'Error while searching.'));
			}
			return response;
		}).catch(error => {
			return Promise.reject(error.response);
		});
	}
}
