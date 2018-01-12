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

namespace OCA\Mindmaps\Tests\Integration\Controller;

use OCA\Mindmaps\AppInfo\Application;
use OCP\App\IAppManager;
use OCP\AppFramework\{App, IAppContainer};
use PHPUnit\Framework\TestCase;

/**
 * This test shows how to make a small Integration Test. Query your class
 * directly from the container, only pass in mocks if needed and run your tests
 * against the database
 */
class AppTest extends TestCase {

	/** @var IAppContainer */
	private $container;

	public function setUp() {
		parent::setUp();
		$app = new App(Application::APP_NAME);
		$this->container = $app->getContainer();
	}

	public function testAppInstalled() {
		$appManager = $this->container->query(IAppManager::class);
		$this->assertTrue($appManager->isInstalled(Application::APP_NAME));
	}
}
