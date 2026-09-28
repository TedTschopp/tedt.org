import tailwindcss from 'tailwindcss';
// Svelte must analyze unprefixed component selectors. Scope the final compiled CSS after Vite.
export default { plugins:[tailwindcss()] };
