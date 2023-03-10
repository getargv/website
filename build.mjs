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

// optimization, not ready yet
//template = template.replaceAll(/[\s]{2,}/g,' '); // fucks up <pre> sections

console.log(template);
