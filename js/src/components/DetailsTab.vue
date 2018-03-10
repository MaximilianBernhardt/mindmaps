<!--
@copyright Copyright (c) 2018 Kai Schröer <git@schroeer.co>

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
	<div id="detailsTabView" class="tab detailsTabView">
		<h3>
			{{ t('mindmaps', 'Help') }}
			<span class="icon-info" :title="t('mindmaps', 'Help')"></span>
		</h3>
		<p v-html="helpText"></p>
		<h3>
			{{ t('mindmaps', 'Description') }}
			<button class="icon-edit" :title="t('mindmaps', 'Save description')" @click="updateDescription">
				<span class="hidden-visually">{{ t('mindmaps', 'Save description') }}</span>
			</button>
		</h3>
		<textarea id="description" v-model="mindmap.description" :placeholder="t('mindmaps', 'Add a description…')"></textarea>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from 'vue-property-decorator';

	import { MindmapService } from '../services';
	import { Mindmap } from '../models';

	@Component
	export default class DetailsTab extends Vue {
		helpText = t('mindmaps', 'Select a node and double click anywhere in your mindmap to create a child node. ' +
			'You can also edit or delete nodes by simply clicking on them and choose the corresponding action icon. ' +
			'App icon by <a href="https://icons8.com/" rel="noopener" target="_blank">Icons8</a> and mindmaps powered by ' +
			'<a href="http://visjs.org/" rel="noopener" target="_blank">Vis.js</a>.');
		@Prop({ required: true })
		mindmap: Mindmap;

		updateDescription(): void {
			const mindmapService = new MindmapService();
			mindmapService.update(this.mindmap)
				.then(() => $('#description').addClass('saved'))
				.catch(error => console.error('Error: ' + error.message));
		}
	}
</script>

<style lang="scss">
	#detailsTabView {
		h3 {
			padding-bottom: 4px;
			border-bottom: 1px solid black;

			.icon-info {
				display: block;
				opacity: 0.5;
				float: right;
				margin-right: 6px;
			}
		}

		#description {
			width: 100%;
			min-height: 100px;
		}

		.saved {
			border: 1px solid green;
		}
	}
</style>
