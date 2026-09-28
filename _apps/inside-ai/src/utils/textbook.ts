/** Keep highlighting inside the explorer and preserve readable surrounding content. */
function appElements(selector: string): (HTMLElement | SVGElement)[] {
	return Array.from(document.querySelector('#inside-ai-app')?.querySelectorAll<HTMLElement | SVGElement>(selector) || []);
}

function appElement(selector: string): HTMLElement | null {
	return document.querySelector('#inside-ai-app')?.querySelector<HTMLElement>(selector) || null;
}

function emphasizePaths(groups: string[] = []) {
	appElements('svg g.path-group').forEach((group) => {
		const active = groups.some((name) => group.classList.contains(name));
		group.style.opacity = '1';
		group.classList.toggle('ia-path-focus', active);
		group.querySelectorAll<SVGPathElement>('path').forEach((path) => {
			// Thicker boundaries emphasize a path without washing out other paths or text.
			if (active) path.style.strokeWidth = '3px';
			else path.style.removeProperty('stroke-width');
		});
	});
	appElements('div.step, div.step > div, div.step .column, div.step.mlp .layer').forEach((element) => {
		element.style.opacity = '1';
	});
}

/** Highlight attention using its graphical boundaries, keeping every label readable. */
export function highlightAttentionPath() {
	emphasizePaths(['attention']);
}

export function removeAttentionPathHighlight() {
	emphasizePaths();
}

export function highlightLogitPath() {
	emphasizePaths(['transformer-blocks', 'softmax']);
	appElements('.steps').forEach((element) => { element.style.pointerEvents = 'none'; });
}

export function highlightPath(value: string) {
	emphasizePaths([value]);
	appElements('.steps').forEach((element) => { element.style.pointerEvents = 'none'; });
}

export function removePathHighlight() {
	emphasizePaths();
	appElements('.steps').forEach((element) => { element.style.pointerEvents = 'auto'; });
}

/**
 * Get transformer-bounding element height
 */
export function getTransformerBoundingHeight(): string {
	const transformerBounding = appElement('.transformer-bounding');
	if (transformerBounding) {
		return getComputedStyle(transformerBounding).height;
	}
}

/**
 * Sync element height with transformer-bounding height
 */
export function syncWithTransformerBoundingHeight(selector: string) {
	const height = getTransformerBoundingHeight();
	const element = appElement(selector);
	if (element) {
		element.style.height = height;
	}
}

/**
 * Highlight multiple elements by selectors
 */
export function highlightElements(selectors: string[], className = 'textbook-highlight') {
	selectors.forEach((selector) => {
		const elements = appElements(selector);
		elements.forEach((element) => {
			element.classList.remove('remove-finger');
			element.classList.add(className);
		});
	});
}

/**
 * Remove highlight from multiple elements by selectors
 */
export function removeHighlightFromElements(selectors: string[], className = 'textbook-highlight') {
	selectors.forEach((selector) => {
		const elements = appElements(selector);
		elements.forEach((element) => {
			element.classList.remove(className);
		});
	});
}

/**
 * Remove finger pointer
 */
export function removeFingerFromElements(selectors: string[]) {
	selectors.forEach((selector) => {
		const elements = appElements(selector);
		elements.forEach((element) => {
			element.classList.add('remove-finger');
		});
	});
}

/**
 * Apply transformer-bounding height to multiple elements
 */
export function applyTransformerBoundingHeight(selectors: string[]) {
	const height = getTransformerBoundingHeight();
	selectors.forEach((selector) => {
		const element = appElement(selector);
		if (element) {
			element.style.height = height;
		}
	});
}

/**
 * Reset height to 100% for multiple elements
 */
export function resetElementsHeight(selectors: string[]) {
	selectors.forEach((selector) => {
		const element = appElement(selector);
		if (element) {
			element.style.height = '100%';
		}
	});
}
