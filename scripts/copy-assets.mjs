import { cp, mkdir } from 'node:fs/promises';

await mkdir(new URL('../public/images/', import.meta.url), { recursive: true });
await cp(new URL('../images/', import.meta.url), new URL('../public/images/', import.meta.url), { recursive: true });
console.log('Original portfolio images copied to public/images.');
