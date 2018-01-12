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

import {assert, expect} from 'chai';
import * as moxios from 'moxios';
import * as sinon from 'sinon';
import {Acl} from '../../models';
import {AclService} from '../../services';

describe('AclService', () => {
	let service: AclService;
	let data: Acl[];

	beforeEach(() => {
		moxios.install();
	});

	afterEach(() => {
		moxios.uninstall();
	});

	describe('load', () => {
		it('Should return one acl', done => {
			data = [{
				'id': 1,
				'mindmapId': 1,
				'participant': 'test',
				'participantDisplayName': 'Test',
				'type': 0
			}];
			moxios.stubRequest('/apps/mindmaps/acl/1', {
				status: 200,
				responseText: JSON.stringify(data)
			});

			const onFulfilled = sinon.spy();
			service = new AclService();
			service.load(data[0].mindmapId).then(onFulfilled);

			moxios.wait(() => {
				expect(onFulfilled.getCall(0).args[0].data[0].participant).to.string(data[0].participant);
				done();
			});
		});

		it('Should return the acl with id 1', () => {
			const acl = service.find(1);
			if (acl !== null) {
				expect(acl.participantDisplayName).to.string(data[0].participantDisplayName);
			}
		});

		it('Should return null for the acl with id 2', () => {
			const acl = service.find(2);
			assert.equal(acl, null);
		});
	});
});
