<?php
declare(strict_types=1);
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

use League\FactoryMuffin\Faker\Facade as Faker;
use OCA\Mindmaps\Db\MindmapNode;

/**
 * General factory for the mindmap node model.
 */
$fm->define(MindmapNode::class)->setDefinitions([
	'userId' => Faker::firstNameMale(),
	'x' => Faker::numberBetween(-400, 400),
	'y' => Faker::numberBetween(-400, 400),
	'label' => Faker::sentence(5),
	'lockedBy' => Faker::firstNameMale()
]);
