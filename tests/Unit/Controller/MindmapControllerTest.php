<?php
/**
 * @copyright Copyright (c) 2017 Kai Schröer <kai@schroeer.co>
 *
 * @author Kai Schröer <kai@schroeer.co>
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

namespace OCA\Mindmaps\Tests\Unit\Controller;

use OCA\Mindmaps\Controller\MindmapController;
use OCP\AppFramework\Http\DataResponse;
use PHPUnit_Framework_TestCase;

class MindmapControllerTest extends PHPUnit_Framework_TestCase {
    private $controller;
    private $request;
    private $mindmapService;
    private $userId = 'john';

	public function setUp() {
        $this->request = $this->getMockBuilder('OCP\IRequest')
            ->disableOriginalConstructor()
            ->getMock();

        $this->mindmapService = $this->getMockBuilder(
            '\OCA\Mindmaps\Service\MindmapService')
            ->disableOriginalConstructor()
            ->getMock();

        $this->controller = new MindmapController(
            'mindmaps', $this->request, $this->mindmapService, $this->userId
        );
	}

	public function testIndex() {
        $result = $this->controller->index();

        $this->assertTrue($result instanceof DataResponse);
	}

}