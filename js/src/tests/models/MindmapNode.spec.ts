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

import {expect} from 'chai';
import {MindmapNode} from '../../models';

describe('MindmapNode', () => {
	it('Should be an instance of the MindmapNode class', () => {
		const mindmapNode = new MindmapNode();
		mindmapNode.id = 1;
		mindmapNode.mindmapId = 1;
		mindmapNode.parentId = null;
		mindmapNode.userId = 'test';
		mindmapNode.x = 0;
		mindmapNode.y = 0;
		mindmapNode.label = 'Test';
		mindmapNode.lockedBy = 'test';

		expect(mindmapNode).to.instanceOf(MindmapNode);
		expect(mindmapNode.id).to.eq(1);
		expect(mindmapNode.mindmapId).to.eq(1);
		expect(mindmapNode.parentId).to.eq(null);
		expect(mindmapNode.userId).to.eq('test');
		expect(mindmapNode.x).to.eq(0);
		expect(mindmapNode.y).to.eq(0);
		expect(mindmapNode.label).to.eq('Test');
		expect(mindmapNode.lockedBy).to.eq('test');
	});
});
