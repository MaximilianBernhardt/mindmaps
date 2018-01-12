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

export default class System {
	static t(text: string, vars?: any, count?: number, options?: any): string {
		return t('mindmaps', text, vars, count, options);
	}

	static n(textSingular: string, textPlural: string, count: number, vars?: any, options?: any): string {
		return n('mindmaps', textSingular, textPlural, count, vars, options);
	}

	static generateUrl(url: string): string {
		return OC.generateUrl(url);
	}

	static getRequestToken(): string {
		return OC.requestToken;
	}
}
