import { readFileSync } from 'fs';

const myArgs = process.argv.slice(2);
const body_file = myArgs[0];
const cache = new Map();
const read = file => readFileSync(file, 'utf8').trim();
cache.set('body', read(body_file));
let old;
let template = read("src/template.html");

if (body_file != "src/index-body.html") {
    template = template.replace(/<body class="is-preload landing">.+$/m, '<body class="is-preload">');
    const path = body_file.replace(/src\/(.*)-body\.html/,'$1.html');
    template = template.replace('<link rel="canonical" href="https://getargv.narzt.cam/" />',`<link rel="canonical" href="https://getargv.narzt.cam/${path}" />`);
}

function content_for(_,name) {
    if (!cache.has(name)) {
        cache.set(name, read(`src/${name}.html`));
    }
    return cache.get(name);
}

do {
    old = template;
    template = template.replaceAll(/<getargv-([^ ]+) \/>/g,content_for);
} while (old != template);

console.log(template);
