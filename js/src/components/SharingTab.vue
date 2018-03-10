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
	<div id="sharingTabView" class="tab sharingTabView hidden">
		<input id="shareWith" class="shareWithField" type="text" :placeholder="t('mindmaps', 'Enter user / group / circle name…')" autocomplete="off">
		<ul id="shareWithList" class="shareWithList">
			<li v-for="share in shares" :key="share.id">
				<div class="avatar" :data-participant="share.participant" :data-displayname="share.participantDisplayName" :data-type="share.type"></div>
				<span class="participant">{{ share.participantDisplayName }}</span>
				<button class="icon-delete" :title="t('mindmaps', 'Delete')" @click="remove(share)">
					<span class="hidden-visually">{{ t('mindmaps', 'Delete') }}</span>
				</button>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
	import AutocompleteUIParams = JQueryUI.AutocompleteUIParams;

	import { AclService } from '../services';
	import { Acl, Mindmap } from '../models';

	@Component
	export default class SharingTab extends Vue {
		private aclService: AclService;
		private shares: Acl[] = [];
		@Prop({required: true})
		mindmap: Mindmap;

		private setAvatars(): void {
			// @ts-ignore
			$('.shareWithList > li').each((index: number, element: Node) => {
				const $item = $(element).find('.avatar');
				const type = parseInt($item.data('type') as string);
				const participant = $item.data('participant') as string;
				const displayname = $item.data('displayname') as string;

				if (type === OC.Share.SHARE_TYPE_USER) {
					$item.avatar(participant);
				} else {
					$item.imageplaceholder(displayname);
				}
			});
		}

		private registerAutocomplete(): void {
			$('#shareWith').autocomplete({
				minLength: 1,
				delay: 750,
				select: this.selectParticipant,
				source: this.autocompleteHandler
				// @ts-ignore
			}).data('ui-autocomplete')._renderItem = this.renderItem;
		}

		private selectParticipant(event: Event, ui: AutocompleteUIParams): void {
			event.preventDefault();
			const $element = $('#shareWith');
			$element.prop('disabled', true);
			const share: Acl = {
				mindmapId: this.mindmap.id,
				type: ui.item.value.shareType,
				participant: ui.item.value.shareWith
			};
			this.aclService.create(share).then(response => {
				this.shares.push(response.data);
				$element.val('');
				$element.prop('disabled', false);
			}).catch(error => {
				console.error('Error: ' + error.message);
				$element.prop('disabled', false);
			});
		}

		private filterSuggestions(type: number, suggestions: SharingInfo[]): SharingInfo[] {
			const sharedWith = this.shares.filter(share => share.type === type)
				.map(share => share.participant);

			if (type === OC.Share.SHARE_TYPE_USER) {
				sharedWith.push(OC.getCurrentUser().uid);
			}

			suggestions = suggestions.filter(share => sharedWith.indexOf(share.value.shareWith) < 0);

			return suggestions;
		}

		private autocompleteHandler(search: {term: string}, callback: (data?: SharingInfo[]) => any): void {
			this.aclService.getAutocomplete(search.term.trim()).then(response => {
				const users = this.filterSuggestions(
					OC.Share.SHARE_TYPE_USER,
					response.data.ocs.data.exact.users.concat(response.data.ocs.data.users)
				);
				const groups = this.filterSuggestions(
					OC.Share.SHARE_TYPE_GROUP,
					response.data.ocs.data.exact.groups.concat(response.data.ocs.data.groups)
				);
				let circles: SharingInfo[] = [];
				if (!_.isUndefined(response.data.ocs.data.circles)) {
					circles = this.filterSuggestions(
						OC.Share.SHARE_TYPE_CIRCLE,
						response.data.ocs.data.exact.circles.concat(response.data.ocs.data.circles)
					);
				}

				const suggestions  = users.concat(groups).concat(circles);
				callback(suggestions);
			}).catch(error => {
				console.error('Error: ' + error.message);
				callback();
			});
		}

		private renderItem(ul: JQuery, item: SharingInfo): JQuery {
			let $insert = $('<li>').data('item.autocomplete-item', item);

			switch (item.value.shareType) {
				case OC.Share.SHARE_TYPE_USER:
					$('<a>').text(
							t(
								'mindmaps',
								'{sharee} (user)',
								{ sharee: item.label },
								undefined,
								{ escape: false }
							)
					).appendTo($insert);
					break;
				case OC.Share.SHARE_TYPE_GROUP:
					$('<a>').text(
						t(
							'mindmaps',
							'{sharee} (group)',
							{ sharee: item.label },
							undefined,
							{ escape: false }
						)
					).appendTo($insert);
					break;
				case OC.Share.SHARE_TYPE_CIRCLE:
					$('<a>').text(
						t(
							'mindmaps',
							'{sharee} ({type}, {owner})',
							{ sharee: item.label, type: item.value.circleInfo, owner: item.value.circleOwner },
							undefined,
							{ escape: false }
						)
					).appendTo($insert);
					break;
				default:
					$('<a>').text(t('mindmaps', 'Unexpected OCS response!')).appendTo($insert);
			}

			return $insert.appendTo(ul);
		}

		@Watch('mindmap.id', { deep: true })
		onMindmapIdChanged(id: number): void {
			if (id > 0) {
				this.shares.splice(0, this.shares.length);
				this.aclService.load(id).then(response => {
					response.data.forEach(share => this.shares.push(share));
					this.registerAutocomplete();
				}).catch(error => console.error('Error: ' + error.message));
			}
		}

		created(): void {
			this.aclService = new AclService();
			this.onMindmapIdChanged(this.mindmap.id);
		}

		updated(): void {
			this.setAvatars();
		}

		remove(acl: Acl): void {
			this.aclService.remove(acl.id).then(() => {
				const index = this.shares.indexOf(acl);
				this.shares.splice(index, 1);
			}).catch(error => console.error('Error: ' + error.message));
		}
	}
</script>

<style lang="scss">
	#sharingTabView {
		#shareWith {
			width: 100%;
		}

		.avatar {
			margin-right: 8px;
			display: inline-block;
			overflow: hidden;
			vertical-align: middle;
			width: 32px;
			height: 32px;
		}

		.participant {
			padding-right: 8px;
			white-space: nowrap;
			text-overflow: ellipsis;
			max-width: 254px;
			display: inline-block;
			overflow: hidden;
			vertical-align: middle;
		}
	}
</style>
