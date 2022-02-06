// Dropdowns.

let fadeTimeout: number;

type CompletionHandler = (this: Animation, ev: AnimationPlaybackEvent) => any;

const noop = () => { };
function fade(el: HTMLElement, keyframes: Keyframe[], completionHandler: CompletionHandler = noop) {
    el.animate(keyframes, { duration: 200, fill: "both" }).addEventListener('finish', completionHandler);
}

function fadeIn(el: HTMLElement) {
    if (el.style.getPropertyValue('opacity') == '1') return;
    if (el.style.getPropertyValue('display') == 'none') el.style.setProperty('display', '');
    fade(el, [{ opacity: '0' }, { opacity: '1' }]);
}

function fadeOut(el: HTMLElement) {
    if (el.style.getPropertyValue('opacity') == '0' || el.style.getPropertyValue('display') == 'none') return;
    fade(el, [{ opacity: '1' }, { opacity: '0' }], () => el.style.setProperty('display', 'none'));
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
        const parent = el.parentElement;
        const fadeOutHandler = (_ev: Event) => {
            window.clearTimeout(fadeTimeout);
            fadeTimeout = window.setTimeout(() => { fadeOut(dropdown) }, 350);
        };
        const fadeInHandler = (_ev: Event) => {
            window.clearTimeout(fadeTimeout);
            fadeIn(dropdown);
        };
        const hoverHandler = () => window.clearTimeout(fadeTimeout);

        window.addEventListener('keypress', ev => {
            if (ev.key == 'Escape') {
                ev.stopPropagation();
                ev.preventDefault();
                window.clearTimeout(fadeTimeout);
                fadeOut(dropdown);
            }
        });

        if (document.body.classList.contains('is-touch')) {
            parent?.addEventListener('click', (ev: MouseEvent) => {
                if (parent?.contains(ev.target as Node) || dropdown.contains(ev.target as Node)) {
                    ev.stopPropagation();
                    ev.preventDefault();
                    fadeInHandler(ev);
                }
            });
            window.addEventListener('click', (ev: MouseEvent) => {
                if (!(parent?.contains(ev.target as Node) || dropdown.contains(ev.target as Node))) {
                    ev.stopPropagation();
                    ev.preventDefault();
                    fadeOutHandler(ev);
                }
            });
            window.addEventListener('scroll', fadeOutHandler);
        } else {
            dropdown.addEventListener('mouseleave', fadeOutHandler);
            dropdown.addEventListener('mouseenter', hoverHandler);
            parent?.addEventListener('mouseenter', fadeInHandler);
            parent?.addEventListener('mouseleave', fadeOutHandler);
        }
        document.body.appendChild(dropdown);
    }
});
