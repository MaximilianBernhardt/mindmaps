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

use OCP\IRequest;
use PHPUnit_Framework_TestCase;
use OCA\Mindmaps\Controller\PageController;
use OCP\AppFramework\Http\TemplateResponse;

class PageControllerTest extends PHPUnit_Framework_TestCase {

	/** @var PageController */
    private $controller;
    /** @var IRequest */
    private $request;

    private $userId = 'john';

	/**
	 * {@inheritDoc}
	 */
    public function setUp() {
        $this->request = $this->getMockBuilder('OCP\IRequest')
            ->disableOriginalConstructor()
            ->getMock();

        $this->controller = new PageController(
            'mindmaps', $this->request, $this->userId
        );
    }

	/**
	 * Basic controller index route test.
	 */
    public function testIndex() {
        $result = $this->controller->index();
        $this->assertEquals('index', $result->getTemplateName());
		$this->assertInstanceOf(TemplateResponse::class, $result);
    }
}
