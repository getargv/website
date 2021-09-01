import { readFileSync } from 'fs'

const myArgs = process.argv.slice(2);
const body_file = myArgs[0];

const sidebar_for = (_,name) => readFileSync(`${name}-sidebar.html`, 'utf8');

const body = readFileSync(body_file, 'utf8').replaceAll(/<([^ -]+)-sidebar \/>/g,sidebar_for);
const header = readFileSync("header.html", 'utf8');
const footer = readFileSync("footer.html", 'utf8');
let template = readFileSync("template.html", 'utf8');

if (body_file != "index-body.html") {
    template = template.replace(/<body class="is-preload landing">/, match => match.replace(" landing",""));
}

template = template.replace(/<getargv-header \/>/,header);
template = template.replace(/<getargv-footer \/>/,footer);
template = template.replace(/<getargv-main \/>/,body);

console.log(template);
