import { svelte } from "@sveltejs/vite-plugin-svelte";
import preprocess from 'svelte-preprocess';

export default {
    plugins: [svelte({ preprocess: preprocess({postcss:true}) })],
    rollupDedupe: ['svelte']
};