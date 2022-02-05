// Breakpoints.

function resizeHandler(ev: MediaQueryListEvent) {
    for (const el of document.getElementsByClassName('spotlight')) {
        let src = '';
        if (ev.matches) {
            src = `url("${el.querySelector<HTMLElement>('.image.main > img')?.getAttribute('src')}")`;
        }
        (el as HTMLElement).style.setProperty('background-image', src);
    }
}

//const mql = window.matchMedia('(max-width: 980px)');
const mql = window.matchMedia("(min-width: 981px)");

mql.addEventListener('change', resizeHandler);

addEventListener('DOMContentLoaded',()=>resizeHandler(new MediaQueryListEvent('',{matches:mql.matches})));
