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
import {Mindmap} from '../../models';

describe('Mindmap', () => {
	it('Should be an instance of the Mindmap class', () => {
		const mindmap = new Mindmap();
		mindmap.id = 1;
		mindmap.title = 'Test';
		mindmap.description = 'Test';
		mindmap.userId = 'test';
		mindmap.shared = true;

		expect(mindmap).to.instanceOf(Mindmap);
		expect(mindmap.id).to.eq(1);
		expect(mindmap.title).to.eq('Test');
		expect(mindmap.description).to.eq('Test');
		expect(mindmap.userId).to.eq('test');
		expect(mindmap.shared).to.eq(true);
	});
});
