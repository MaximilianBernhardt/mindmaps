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
	<div id="app-navigation" v-bind:class="{ loading: isLoading }">
		<ul>
			<li>
				<a class="icon-add" @click="showNew">{{ t('mindmaps', 'New Mindmap') }}</a>
				<div class="app-navigation-entry-edit">
					<form @submit.prevent="create">
						<input type="text" :placeholder="t('mindmaps', 'New mindmap')" maxlength="255" v-model="title">
						<input type="button" value="" class="icon-close" @click="cancelNew">
						<input type="submit" value="" class="icon-checkmark">
					</form>
				</div>
			</li>
			<li class="with-menu" v-for="mindmap in mindmaps" :key="mindmap.id" :data-id="mindmap.id">
				<router-link :to="`/mindmaps/${mindmap.id}`">{{ mindmap.title }}</router-link>
				<div class="app-navigation-entry-utils">
					<ul>
						<li class="app-navigation-entry-utils-menu-share" v-if="mindmap.shared">
							<span class="icon-share" :title="t('mindmaps', 'Shared with / by you')"></span>
						</li>
						<li class="app-navigation-entry-utils-menu-button">
							<button class="icon-more" :title="t('mindmaps', 'View more')" @click="showMenu">
								<span class="hidden-visually">{{ t('mindmaps', 'View more') }}</span>
							</button>
						</li>
					</ul>
				</div>
				<div class="app-navigation-entry-menu">
					<ul>
						<li>
							<a href="#" @click="showEdit($event, mindmap)">
								<span class="icon-rename"></span>
								<span>{{ t('mindmaps', 'Edit') }}</span>
							</a>
						</li>
						<li>
							<a href="#" @click="remove(mindmap)">
								<span class="icon-delete"></span>
								<span>{{ t('mindmaps', 'Delete') }}</span>
							</a>
						</li>
					</ul>
				</div>
				<div class="app-navigation-entry-edit">
					<form @submit.prevent="update(mindmap)">
						<input type="text" maxlength="255" v-model="mindmap.title">
						<input type="button" value="" class="icon-close" @click="cancelEdit($event, mindmap)">
						<input type="submit" value="" class="icon-checkmark">
					</form>
				</div>
				<div class="app-navigation-entry-deleted">
					<div class="app-navigation-entry-deleted-description">{{ t('mindmaps', 'Deleted important entry') }}</div>
					<button class="app-navigation-entry-deleted-button icon-history" :title="t('mindmaps', 'Undo')"></button>
				</div>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';

	import { MindmapService } from '../services';
	import { Mindmap } from '../models';

	@Component
	export default class AppNavigation extends Vue {
		private mindmapService: MindmapService;
		private mindmaps: Mindmap[] = [];
		private title = '';
		private oldTitle = '';
		isLoading = true;

		created(): void {
			this.mindmapService = new MindmapService();
			this.mindmapService.load().then(response => {
				this.isLoading = false;
				response.data.forEach(mindmap => this.mindmaps.push(mindmap));
				// Load the first mindmap
				if (_.isUndefined(this.$route.params.id) && this.mindmaps.length > 0) {
					this.$router.push(`/mindmaps/${this.mindmaps[0].id}`);
				}
			}).catch(error => {
				this.isLoading = false;
				console.error('Error: ' + error.message);
			});

			$(document).on('click', () => $('.app-navigation-entry-menu').removeClass('open'));
		}

		// TODO: CSS classes should be added / removed via Vue.js instead!
		showMenu(event: Event): void {
			$(event.currentTarget).parents('.with-menu')
				.find('.app-navigation-entry-menu')
				.addClass('open');
			event.stopPropagation();
		}

		showNew(event: Event): void {
			$(event.currentTarget).parent()
				.addClass('editing');
		}

		cancelNew(event: Event): void {
			$(event.currentTarget).parents('.app-navigation-entry-edit')
				.parent()
				.removeClass('editing');
			this.title = '';
		}

		showEdit(event: Event, mindmap: Mindmap): void {
			$(event.currentTarget).parents('.with-menu')
				.addClass('editing');
			this.oldTitle = mindmap.title;
		}

		cancelEdit(event: Event, mindmap: Mindmap): void {
			$(event.currentTarget).parents('.with-menu')
				.removeClass('editing');
			mindmap.title = this.oldTitle;
			this.oldTitle = '';
		}

		create(): void {
			const mindmap: Mindmap = { title: this.title, description: '' };
			this.mindmapService.create(mindmap).then(response => {
				this.mindmaps.push(response.data);
				this.title = '';
				$('#app-navigation').find('ul > li')
					.first()
					.removeClass('editing');
				this.$router.push(`/mindmaps/${response.data.id}`);
			}).catch(error => {
				console.error('Error: ' + error.message);
			});
		}

		update(mindmap: Mindmap): void {
			this.mindmapService.update(mindmap).then(() => {
				$(`.with-menu[data-id=${mindmap.id}]`).removeClass('editing');
				this.oldTitle = '';
			}).catch(error => {
				console.error('Error: ' + error.message);
			});
		}

		remove(mindmap: Mindmap): void {
			OC.dialogs.confirm(
				t('mindmaps', 'Are you sure you want to delete this mindmap with all of its data?'),
				t('mindmaps', 'Delete'),
				(state) => {
					if (!state) {
						return;
					}
					this.mindmapService.remove(mindmap.id as number).then(() => {
						const index = this.mindmaps.indexOf(mindmap);
						this.mindmaps.splice(index, 1);
						// Redirect to first mindmap or default page
						if (this.mindmaps.length > 0) {
							this.$router.push(`/mindmaps/${this.mindmaps[0].id}`);
						} else {
							this.$router.push(`/`);
						}
					}).catch(error => {
						console.error('Error: ' + error.message);
					});
				}
			);
		}
	}
</script>

<style lang="scss">
	.app-navigation-entry-utils-menu-share {
		.icon-share {
			height: 44px;
			display: block;
			opacity: 0.5;
		}
	}
</style>
