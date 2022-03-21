import { readFileSync } from 'fs'

const myArgs = process.argv.slice(2);
const body_file = myArgs[0];

const sidebar_for = (_,name) => readFileSync(`${name}-sidebar.html`, 'utf8');

const body = readFileSync(body_file, 'utf8').replaceAll(/<([^ -]+)-sidebar \/>/g,sidebar_for).trim();
const footer = readFileSync("footer.html", 'utf8').trim();
const stats = readFileSync("stats.html", 'utf8').trim();
const speed = readFileSync("speed.html", 'utf8').trim();
const projects = readFileSync("projects.html", 'utf8').trim();
const homelink = readFileSync("homelink.html", 'utf8').trim();
const header = readFileSync("header.html", 'utf8').trim().replace(/<getargv-homelink \/>/,homelink);
let template = readFileSync("template.html", 'utf8').trim();

if (body_file != "index-body.html") {
    template = template.replace(/<body class="is-preload landing">.+$/m, '<body class="is-preload">');
}

template = template.replace(/<getargv-header \/>/,header);
template = template.replace(/<getargv-footer \/>/,footer);
template = template.replace(/<getargv-main \/>/,body);
template = template.replace(/<getargv-stats \/>/,stats);
template = template.replace(/<getargv-speed \/>/,speed);
template = template.replace(/<getargv-projects \/>/,projects);
template = template.replace(/<getargv-homelink \/>/,homelink);

console.log(template);
