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
import {Acl} from '../../models';

describe('Acl', () => {
	it('Should be an instance of the Acl class', () => {
		const acl = new Acl();
		acl.id = 1;
		acl.mindmapId = 1;
		acl.participant = 'test';
		acl.participantDisplayName = 'Test';
		acl.type = 0;

		expect(acl).to.instanceOf(Acl);
		expect(acl.id).to.eq(1);
		expect(acl.mindmapId).to.eq(1);
		expect(acl.participant).to.eq('test');
		expect(acl.participantDisplayName).to.eq('Test');
		expect(acl.type).to.eq(0);
	});
});
