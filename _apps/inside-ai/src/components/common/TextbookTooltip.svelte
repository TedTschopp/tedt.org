<script lang="ts">
	import {
		isTextbookOpen,
		textbookCurrentPage,
		textbookCurrentPageId,
		textbookPreviousPage,
		userId
	} from '~/store';
	import { textPages } from '~/utils/textbookPages';

	export let id: string;

	function openTextbook(e) {
 e.stopPropagation();e.preventDefault();
 window.dispatchEvent(new CustomEvent('insideai:explain',{detail:id}));
 }
</script>

<div
	{id}
	class="textbook-tooltip"
	data-click={`textbook-tooltip`}
	on:click={openTextbook}
	role="button"
	tabindex="0"
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			openTextbook(e);
		}
	}}
>
	<slot></slot>
</div>

<style lang="scss">
	.textbook-tooltip {
		cursor: help;
	}
</style>
