<?php
declare(strict_types=1);
/**
 * @copyright Copyright (c) 2018 Kai Schröer <git@schroeer.co>
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

namespace OCA\Mindmaps\Tests\Unit\Controller;

use OCA\Mindmaps\AppInfo\Application;
use OCA\Mindmaps\Controller\AclController;
use OCA\Mindmaps\Service\AclService;
use OCA\Mindmaps\Tests\Unit\UnitTestCase;
use OCP\AppFramework\Http\DataResponse;
use OCP\{IL10N, IRequest, IUserManager, IGroupManager};
use OCP\Share\IManager;

class AclControllerTest extends UnitTestCase {

	/** @var AclController */
	private $controller;
	/** @var IRequest */
	private $request;
	/** @var AclService */
	private $aclService;
	/** @var IUserManager */
	private $userManager;
	/** @var IGroupManager */
	private $groupManager;
	/** @var IManager */
	private $shareManager;
	/** @var IL10N */
	private $l10n;
	/** @var string */
	private $userId = 'john';

	/**
	 * {@inheritDoc}
	 */
	public function setUp() {
		$this->request = $this->getMockBuilder(IRequest::class)
			->disableOriginalConstructor()
			->getMock();
		$this->aclService = $this->getMockBuilder(AclService::class)
			->disableOriginalConstructor()
			->getMock();
		$this->userManager = $this->getMockBuilder(IUserManager::class)
			->disableOriginalConstructor()
			->getMock();
		$this->groupManager = $this->getMockBuilder(IGroupManager::class)
			->disableOriginalConstructor()
			->getMock();
		$this->shareManager = $this->getMockBuilder(IManager::class)
			->disableOriginalConstructor()
			->getMock();
		$this->l10n = $this->getMockBuilder(IL10N::class)
			->disableOriginalConstructor()
			->getMock();

		$this->controller = new AclController(
			Application::APP_NAME,
			$this->request,
			$this->aclService,
			$this->userManager,
			$this->groupManager,
			$this->shareManager,
			$this->l10n,
			$this->userId
		);
	}

	/**
	 * Basic controller index route test.
	 */
	public function testIndex() {
		$result = $this->controller->index(0);
		$this->assertInstanceOf(DataResponse::class, $result);
	}
}
