import { mount } from 'svelte';
import './lib/tokens/index.css';
import Dev from './Dev.svelte';

// #editor shows the CV editor example; anything else the Library gallery.
const target = document.getElementById('app')!;
if (location.hash === '#editor') {
  import('./examples/CvEditor.svelte').then(({ default: CvEditor }) => mount(CvEditor, { target }));
} else {
  mount(Dev, { target });
}
window.addEventListener('hashchange', (e) => {
  if (e.newURL.endsWith('#editor') !== e.oldURL.endsWith('#editor')) location.reload();
});
