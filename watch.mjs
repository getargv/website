import chokidar from 'chokidar';
import { exec } from 'child_process';

let executing = false;
const execute=(command) => {
    if (!executing) {
        executing = true;
        return new Promise((a,r) => exec(command, function(error, stdout, stderr) {
            executing = false;
            if (error) r(stderr);
            else a(stdout);
        }));
    }
};

execute("git ls-files -- *.html")
    .then(stdout => stdout.split("\n").filter(s => s.length > 0))
    .then(files => {
        const watcher = chokidar.watch(files);
        const log = console.log.bind(console);

        watcher
            .on('add', path => {
                log(`File path ${path} has been added`);
                execute("npm run html --ignore-scripts");
            })
            .on('change', path => {
                log(`File path ${path} has been changed`);
                execute("npm run html --ignore-scripts");
            })
            .on('unlink', path => log(`File ${path} has been removed`))
            .on('error', error => log(`Watcher error: ${error}`))
            .on('ready', _ => log('Initial scan complete. Ready for changes'))
        ;

        process.on('SIGTERM', _ => watcher.close().then(_ => log('closed')));
    });
