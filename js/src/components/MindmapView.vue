<!--
@copyright Copyright (c) 2017 Kai Schröer <git@schroeer.co>

@author Kai Schröer <git@schroeer.co>

@license GNU AGPL version 3 or any later version

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

<template>
	<div>
		<div id="app-content-wrapper">
			<div class="popovermenu bubble">
				<ul>
					<li>
						<form @submit.prevent="save">
							<input type="text" :placeholder="t('Node label')" maxlength="255" v-model="currentNode.label">
							<input type="submit" value="" class="icon-checkmark">
						</form>
					</li>
					<li v-show="showRemove">
						<a href="#" @click="remove">
							<span class="icon-delete"></span>
							<span>{{ t('Delete') }}</span>
						</a>
					</li>
				</ul>
			</div>
			<div id="mindmap" class="loading"></div>
		</div>
		<app-sidebar :mindmap="mindmap"></app-sidebar>
	</div>
</template>

<script lang="ts">
	import {Component, Vue, Watch} from 'vue-property-decorator';
	import * as _ from 'lodash';
	import * as vis from 'vis';
	import AppSidebar from './AppSidebar.vue';
	import {MindmapService, MindmapNodeService} from '../services';
	import {Mindmap, MindmapNode} from '../models';

	@Component({
		components: {
			'app-sidebar': AppSidebar
		}
	})
	export default class MindmapView extends Vue {
		private network: vis.Network;
		private nodes: vis.DataSet<MindmapNode>;
		private edges: vis.DataSet<vis.Edge>;
		private mindmapService: MindmapService;
		private mindmapNodeService: MindmapNodeService;
		private timer: number;
		// @ts-ignore
		mindmap: Mindmap = new Mindmap();
		showRemove: boolean = false;
		currentNode: MindmapNode = new MindmapNode();

		private removeFromMindmap(data: MindmapNode): void {
			// Delete the edges.
			this.edges.get({
				filter: edge => {
					return edge.to === data.id;
				}
			}).forEach(edge => {
				// @ts-ignore
				this.edges.remove(edge.id);
			});
			// Delete the current node.
			this.nodes.get({
				filter: node => {
					return node.id === data.id;
				}
			}).forEach(node => {
				this.nodes.remove(node.id);
			});
			// Call the method for all child nodes.
			this.nodes.get({
				filter: node => {
					return node.parentId === data.id;
				}
			}).forEach(node => {
				this.removeFromMindmap(node);
			});
		}

		private resizeMindmap(): void {
			// Let the mindmap use all available space
			const content = document.getElementById('app-content');
			if (!_.isNull(content) && !_.isNull(this.network)) {
				this.network.setSize(content.clientWidth + 'px', content.clientHeight + 'px');
				this.network.fit();
			}
		}

		private parseNetworkData(data: MindmapNode[]): void {
			// Clear the vis.DataSets from the previous data and refill them
			this.nodes.clear();
			this.edges.clear();
			this.nodes.add(data);
			this.nodes.forEach(node => {
				if (!_.isNull(node.parentId)) {
					this.edges.add({from: node.parentId, to: node.id});
				}
			});
		}

		@Watch('$route.params.id', {deep: true})
		onMindmapIdChanged(id: number): void {
			this.loadMindmap(id);
		}

		created(): void {
			this.nodes = new vis.DataSet();
			this.edges = new vis.DataSet();
			this.mindmapService = new MindmapService();
			this.mindmapNodeService = new MindmapNodeService();

			const id = parseInt(this.$route.params.id);
			this.loadMindmap(id);

			window.onresize = this.resizeMindmap;
		}

		loadMindmap(id: number): void {
			this.mindmapService.get(id).then(response => {
				$('#mindmap').removeClass('loading');
				if (!_.isNull(response.data)) {
					this.mindmap = response.data;
				}
			}).catch(error => {
				$('#mindmap').removeClass('loading');
				console.error('Error: ' + error.message);
			});

			this.mindmapNodeService.load(id).then(response => {
				const container = document.getElementById('mindmap');
				// Some predefined options
				const options = {
					physics: {enabled: false},
					interaction: {dragNodes: false},
					locale: OC.getLocale()
				};

				if (!_.isNull(vis) && !_.isNull(container)) {
					this.parseNetworkData(response.data);
					// Destroy the network if it already exists
					if (!_.isUndefined(this.network) && !_.isNull(this.network)) {
						this.network.destroy();
					}
					// Initialize the vis.Network object
					this.network = new vis.Network(
						container,
						{nodes: this.nodes, edges: this.edges},
						options
					);
					// Initially resize the mindmap and register the click listeners
					this.resizeMindmap();
					this.network.on('click', this.selectNode);
					this.network.on('doubleClick', this.showPopover);

					if (!_.isUndefined(this.timer)) {
						clearInterval(this.timer);
					}
					this.timer = setInterval(this.renderChanges, 10000);
				} else {
					OC.dialogs.alert(t('mindmaps', 'The vis.js Framework is not available!'), t('mindmaps', 'Error'));
				}
			}).catch(error => {
				console.error('Error: ' + error.message);
			});
		}

		showPopover(params: any): void {
			if (params.nodes.length === 1) {
				// Load the selected node for editing
				this.showRemove = true;
				const node = this.mindmapNodeService.find(parseInt(params.nodes[0]));
				if (!_.isNull(node)) {
					this.currentNode = node;
				}
			} else {
				// Create a new node and let the user enter the title
				const parentId = parseInt($('#mindmap').data('selected') as string);
				if (!_.isNaN(parentId)) {
					this.showRemove = false;
					this.currentNode = new MindmapNode();
					this.currentNode.mindmapId = this.mindmap.id;
					this.currentNode.parentId = parentId;
					this.currentNode.userId = OC.getCurrentUser().uid;
					this.currentNode.x = params.pointer.canvas.x;
					this.currentNode.y = params.pointer.canvas.y;
				} else {
					OC.dialogs.alert(t('mindmaps', 'Please select a parent node first!'), t('mindmaps', 'Error'));
					return;
				}
			}
			const $popover = $('.popovermenu');
			$popover.addClass('open');
			$popover.css('top', params.pointer.DOM.y + 30);
			$popover.css('left', params.pointer.DOM.x - 200);
		}

		selectNode(params: any): void {
			if (params.nodes.length === 1) {
				$('#mindmap').data('selected', params.nodes[0]);
			} else {
				$('.popovermenu').removeClass('open');
			}
		}

		save(): void {
			if (this.showRemove) {
				// Update a given mindmap node
				this.mindmapNodeService.update(this.currentNode).then(response => {
					this.nodes.update(response.data);
					$('.popovermenu').removeClass('open');
				}).catch(error => {
					console.error('Error: ' + error.message);
				});
			} else {
				// Create a new mindmap node
				this.mindmapNodeService.create(this.currentNode).then(response => {
					if (!_.isNull(response.data.parentId)) {
						this.edges.add({from: response.data.parentId, to: response.data.id});
					}
					this.nodes.add(response.data);
					$('.popovermenu').removeClass('open');
				}).catch(error => {
					console.error('Error: ' + error.message);
				});
			}
		}

		remove(): void {
			const mindmapNodeId = parseInt($('#mindmap').data('selected') as string);
			this.mindmapNodeService.remove(mindmapNodeId).then(response => {
				// Remove the node and its child nodes from the mindmap
				this.removeFromMindmap(response.data);
				$('.popovermenu').removeClass('open');
				OC.Notification.showTemporary(t('mindmaps', 'Node deleted!'));
			}).catch(error => {
				console.error('Error: ' + error.message);
			});
		}

		renderChanges(): void {
			this.mindmapNodeService.load(this.mindmap.id).then(response => {
				// Save the selected node to reselect it after refreshing
				const node = this.network.getSelectedNodes()[0];
				// Fill our vis.DataSets with the response data
				this.parseNetworkData(response.data);
				// If a node was selected previously reselect it
				try {
					this.network.setSelection({nodes: [node], edges: []});
				} catch(error) {
					this.network.setSelection({nodes: [], edges: []});
				}
			}).catch(error => {
				console.error('Error: ' + error.message);
			});
		}
	}
</script>

<style lang="scss">
	#app-content-wrapper {
		.popovermenu {
			width: 212px;
			padding: 4px 2px 4px 4px;

			form {
				display: inline-flex;
				width: 100%;

				input[type="text"] {
					width: 100%;
					min-width: 0;
					height: 38px;
					border-bottom-right-radius: 0;
					border-top-right-radius: 0;
					padding: 5px;
					margin-right: 0;
				}

				input:not([type="text"]) {
					width: 36px;
					height: 38px;
					flex: 0 0 36px;
					border-bottom-left-radius: 0;
					border-top-left-radius: 0;
					margin-left: -1px;
				}
			}
		}
	}
</style>
