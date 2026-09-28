<script>
	import katex from 'katex';

	export let math;
	export let displayMode = false;
	export let style;

	const options = {
		displayMode,
		throwOnError: false,
		style
	};

	$: katexString = katex.renderToString(math, options);
</script>



{@html katexString}
