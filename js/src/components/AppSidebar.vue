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
	<div id="app-sidebar">
		<div id="sidebar-content">
			<div class="sidebar-header">
				<h2>{{ mindmap.title }}</h2>
				<a class="icon-close" @click="closeSidebar" :title="t('Close')">
					<span class="hidden-visually">{{ t('Close') }}</span>
				</a>
			</div>
			<ul class="tabHeaders">
				<li class="tabHeader selected" data-tabid="detailsTabView" @click="switchTab">
					<a href="#">{{ t('Details') }}</a>
				</li>
				<li class="tabHeader" data-tabid="sharingTabView" @click="switchTab">
					<a href="#">{{ t('Sharing') }}</a>
				</li>
			</ul>
			<div class="tabsContainer">
				<details-tab :mindmap="mindmap"></details-tab>
				<sharing-tab :mindmap="mindmap"></sharing-tab>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import DetailsTab from './DetailsTab.vue';
	import SharingTab from './SharingTab.vue';
	import {Mindmap} from '../models';

	@Component({
		components: {
			'details-tab': DetailsTab,
			'sharing-tab': SharingTab
		}
	})
	export default class AppSidebar extends Vue {
		@Prop({required: true})
		// @ts-ignore
		mindmap: Mindmap;

		closeSidebar(): void {
			OC.Apps.hideAppSidebar();
		}

		switchTab(event: Event): void {
			const tabId = $(event.currentTarget).attr('data-tabid');
			$('.tabHeader.selected').removeClass('selected');
			$(event.currentTarget).addClass('selected');
			$('.tab').hide();
			$('#' + tabId).show();
		}
	}
</script>

<style lang="scss">
	#app-sidebar {
		.sidebar-header {
			margin: 20px 0 0 20px;

			.icon-close {
				position: absolute;
				top: 0;
				right: 0;
				padding: 14px;
				height: 44px;
				width: 44px;
			}
		}

		button[class^="icon-"] {
			opacity: 0.5;
			float: right;
			background-color: transparent;
			border: none;
		}
	}
</style>
