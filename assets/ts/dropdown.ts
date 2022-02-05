// Dropdowns.

let fadeTimeout: number;

type CompletionHandler = (this: Animation, ev: AnimationPlaybackEvent) => any;

const noop = () => { };
function fade(el: HTMLElement, keyframes: Keyframe[], completionHandler: CompletionHandler = noop) {
    if (el.style.getPropertyValue('display') == 'none') el.style.setProperty('display', '');
    el.animate(keyframes, { duration: 200, fill: "both" }).addEventListener('finish', completionHandler);
}

function fadeIn(el: HTMLElement) {
    fade(el, [{ opacity: '0' }, { opacity: '1' }]);
}

function fadeOut(el: HTMLElement) {
    fade(el, [{ opacity: '1' }, { opacity: '0' }], function(this: Animation, ev: AnimationPlaybackEvent) {
        el.style.setProperty('display', 'none');
    });
}

function createDropdown(el: Element) {
    const clone = el.cloneNode(true) as HTMLUListElement;
    clone.classList.add('dropotron');
    let level = 0, parent = el.parentElement;
    while (parent?.id != 'nav') {
        parent = parent?.parentElement!;
        if (parent.tagName == "UL") level++;
    }
    clone.classList.add(`level-${level - 1}`);
    const rect = el.parentElement!.getBoundingClientRect();
    clone.style.setProperty('right', `${Math.max(document.body.clientWidth - rect.right, 0)}px`);
    clone.style.setProperty('top', `${rect.bottom}px`);
    clone.style.setProperty('display', 'none');
    return clone;
}

addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    for (const el of nav?.getElementsByClassName('dropdown')!) {
        const dropdown = createDropdown(el);

        const fadeHandler = () => {
            window.clearTimeout(fadeTimeout);
            fadeTimeout = window.setTimeout(() => { fadeOut(dropdown) }, 350);
        }

        dropdown.addEventListener('mouseleave', fadeHandler);
        dropdown.addEventListener('mouseenter', () => {
            window.clearTimeout(fadeTimeout);
        });
        el.parentElement?.addEventListener('mouseenter', () => {
            window.clearTimeout(fadeTimeout);
            fadeIn(dropdown);
        });
        el.parentElement?.addEventListener('mouseleave', fadeHandler);
        document.body.appendChild(dropdown);
    }
});
