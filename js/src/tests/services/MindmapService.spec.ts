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
import {Mindmap} from '../../models';
import {MindmapService} from '../../services';

describe('MindmapService', () => {
	let service: MindmapService;
	let data: Mindmap[];

	beforeEach(() => {
		moxios.install();
	});

	afterEach(() => {
		moxios.uninstall();
	});

	describe('load', () => {
		it('Should return one mindmap', done => {
			data = [{
				'id': 1,
				'title': 'Test',
				'description': 'Test',
				'userId': 'test',
				'shared': true
			}];
			moxios.stubRequest('/apps/mindmaps/mindmaps', {
				status: 200,
				responseText: JSON.stringify(data)
			});

			const onFulfilled = sinon.spy();
			service = new MindmapService();
			service.load().then(onFulfilled);

			moxios.wait(() => {
				expect(onFulfilled.getCall(0).args[0].data[0].title).to.string(data[0].title);
				done();
			});
		});

		it('Should return the mindmap with id 1', () => {
			const mindmap = service.find(1);
			if (mindmap !== null) {
				expect(mindmap.title).to.string(data[0].title);
			}
		});

		it('Should return null for the mindmap with id 2', () => {
			const mindmap = service.find(2);
			assert.equal(mindmap, null);
		});
	});
});
