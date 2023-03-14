import chokidar from 'chokidar';
import { exec } from 'child_process';

let executing = [];
const execute=(command,index) => {
    if (executing.length < index || !executing[index-1]) {
        executing[index-1] = true;
        return new Promise((a,r) => exec(command, function(error, stdout, stderr) {
            executing[index-1] = false;
            if (error) r(stderr);
            else a(stdout);
        })).catch(console.error);
    }
};

execute("git ls-files -- src/*.html",1)
    .then(stdout => stdout.split("\n").filter(s => s.length > 0))
    .then(files => {
        const watcher = chokidar.watch(files);
        const log = console.log.bind(console);

        watcher
            .on('add', path => {
                log(`File path ${path} has been added`);
                execute("echo 'html\ndeploy' | xargs -I{} npm run {} --ignore-scripts",1);
            })
            .on('change', path => {
                log(`File path ${path} has been changed`);
                execute("echo 'html\ndeploy' | xargs -I{} npm run {} --ignore-scripts",1);
            })
            .on('unlink', path => log(`File ${path} has been removed`))
            .on('error', error => log(`Watcher error: ${error}`))
            .on('ready', _ => log('Initial scan complete. Ready for changes'))
        ;

        process.on('SIGTERM', _ => watcher.close().then(_ => log('closed')));
    });

execute("git ls-files -- assets/ts/*.ts",2)
    .then(stdout => stdout.split("\n").filter(s => s.length > 0))
    .then(files => {
        const watcher = chokidar.watch(files);
        const log = console.log.bind(console);

        watcher
            .on('add', file => {
                log(`File path ${file} has been added`);
                execute("echo 'prejs\njs\ndeploy' | xargs -I{} npm run {} --ignore-scripts",2);
            })
            .on('change', file => {
                log(`File path ${file} has been changed`);
                execute("echo 'prejs\njs\ndeploy' | xargs -I{} npm run {} --ignore-scripts",2);
            })
            .on('unlink', path => log(`File ${path} has been removed`))
            .on('error', error => log(`Watcher error: ${error}`))
            .on('ready', _ => log('Initial scan complete. Ready for changes'))
        ;

        process.on('SIGTERM', _ => watcher.close().then(_ => log('closed')));
    });

execute("git ls-files -- assets/sass/*.scss",3)
    .then(stdout => stdout.split("\n").filter(s => s.length > 0))
    .then(files => {
        const watcher = chokidar.watch(files);
        const log = console.log.bind(console);

        watcher
            .on('add', file => {
                log(`File path ${file} has been added`);
                execute("echo 'css\ndeploy' | xargs -I{} npm run {} --ignore-scripts",3);
            })
            .on('change', file => {
                log(`File path ${file} has been changed`);
                execute("echo 'css\ndeploy' | xargs -I{} npm run {} --ignore-scripts",3);
            })
            .on('unlink', path => log(`File ${path} has been removed`))
            .on('error', error => log(`Watcher error: ${error}`))
            .on('ready', _ => log('Initial scan complete. Ready for changes'))
        ;

        process.on('SIGTERM', _ => watcher.close().then(_ => log('closed')));
    });
