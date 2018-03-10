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

namespace OCA\Mindmaps\Tests\Unit\Db;

use League\FactoryMuffin\Faker\Facade as Faker;
use OCA\Mindmaps\Db\{
	AclMapper, Mindmap, MindmapMapper, MindmapNode, MindmapNodeMapper
};
use OCA\Mindmaps\Tests\Unit\UnitTestCase;
use OCP\{IDBConnection, IGroupManager, IUserManager};

class MindmapNodeMapperTest extends UnitTestCase {

	/** @var IDBConnection */
	private $con;
	/** @var MindmapMapper */
	private $mindmapMapper;
	/** @var MindmapNodeMapper */
	private $mindmapNodeMapper;
	/** @var AclMapper */
	private $aclMapper;
	/** @var IUserManager */
	private $userManager;
	/** @var IGroupManager */
	private $groupManager;

	/**
	 * {@inheritDoc}
	 */
	public function setUp() {
		parent::setUp();
		$this->con = \OC::$server->getDatabaseConnection();
		$this->aclMapper = new AclMapper($this->con);
		$this->mindmapNodeMapper = new MindmapNodeMapper($this->con);
		$this->userManager = $this->getMockBuilder(IUserManager::class)
			->disableOriginalConstructor()
			->getMock();
		$this->groupManager = $this->getMockBuilder(IGroupManager::class)
			->disableOriginalConstructor()
			->getMock();
		$this->mindmapMapper = new MindmapMapper(
			$this->con,
			$this->mindmapNodeMapper,
			$this->aclMapper,
			$this->groupManager,
			$this->userManager
		);
	}

	/**
	 * Test the creation of a mindmap node object and save it to the database.
	 *
	 * @return MindmapNode
	 */
	public function testCreate(): MindmapNode {
		/** @var Mindmap $mindmap */
		$mindmap = $this->fm->instance(Mindmap::class);
		$mindmap = $this->mindmapMapper->insert($mindmap);
		$this->assertInstanceOf(Mindmap::class, $mindmap);
		/** @var MindmapNode $mindmapNode */
		$mindmapNode = $this->fm->instance(MindmapNode::class);
		$mindmapNode->setMindmapId($mindmap->getId());
		$mindmapNode = $this->mindmapNodeMapper->insert($mindmapNode);
		$this->assertInstanceOf(MindmapNode::class, $mindmapNode);
		return $mindmapNode;
	}

	/**
	 * Update the previously created mindmap node.
	 *
	 * @depends testCreate
	 *
	 * @param MindmapNode $mindmapNode
	 *
	 * @return MindmapNode
	 */
	public function testUpdate(MindmapNode $mindmapNode): MindmapNode {
		$label = Faker::sentence(2)();
		$mindmapNode->setLabel($label);
		/** @var MindmapNode $mindmapNode */
		$mindmapNode = $this->mindmapNodeMapper->update($mindmapNode);
		$this->assertEquals($label, $mindmapNode->getLabel());
		return $mindmapNode;
	}

	/**
	 * Delete the previously created mindmap node from the database.
	 *
	 * @depends testUpdate
	 *
	 * @param MindmapNode $mindmapNode
	 *
	 * @throws \OCP\AppFramework\Db\DoesNotExistException
	 * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException
	 */
	public function testDelete(MindmapNode $mindmapNode) {
		/** @var Mindmap $mindmap */
		$mindmap = $this->mindmapMapper->find($mindmapNode->getMindmapId());
		$mindmap = $this->mindmapMapper->delete($mindmap);
		$this->assertInstanceOf(Mindmap::class, $mindmap);
	}
}
