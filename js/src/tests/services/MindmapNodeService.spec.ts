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
import {MindmapNode} from '../../models';
import {MindmapNodeService} from '../../services';

describe('MindmapNodeService', () => {
	let service: MindmapNodeService;
	let data: MindmapNode[];

	beforeEach(() => {
		moxios.install();
	});

	afterEach(() => {
		moxios.uninstall();
	});

	describe('load', () => {
		it('Should return one mindmap node', done => {
			data = [{
				'id': 1,
				'mindmapId': 1,
				'parentId': null,
				'userId': 'test',
				'x': 0,
				'y': 0,
				'label': 'Test',
				'lockedBy': 'test',
				'title': 'Test',
				'color': 'red'
			}];
			moxios.stubRequest('/apps/mindmaps/nodes/1', {
				status: 200,
				responseText: JSON.stringify(data)
			});

			const onFulfilled = sinon.spy();
			service = new MindmapNodeService();
			service.load(data[0].mindmapId).then(onFulfilled);

			moxios.wait(() => {
				expect(onFulfilled.getCall(0).args[0].data[0].label).to.string(data[0].label);
				done();
			});
		});

		it('Should return the mindmap node with id 1', () => {
			const mindmapNode = service.find(1);
			if (mindmapNode !== null) {
				expect(mindmapNode.userId).to.string(data[0].userId);
			}
		});

		it('Should return null for the mindmap node with id 2', () => {
			const mindmapNode = service.find(2);
			assert.equal(mindmapNode, null);
		});
	});
});
