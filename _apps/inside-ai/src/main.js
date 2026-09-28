import App from './App.svelte';
import './styles/app.css';
import 'katex/dist/katex.min.css';
import './styles/brand.css';
const target = document.getElementById('inside-ai-app');
if (target) { target.replaceChildren(); new App({target}); }
