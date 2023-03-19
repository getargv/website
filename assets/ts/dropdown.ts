// Dropdowns.

let fadeTimeouts: Map<HTMLElement, number> = new Map();

type CompletionHandler = (this: Animation, ev: AnimationPlaybackEvent) => any;

const noop = () => {};
function fade(el: HTMLElement, keyframes: Keyframe[], completionHandler: CompletionHandler = noop) {
    el.animate(keyframes, { duration: 200, fill: "both" }).addEventListener('finish', completionHandler);
}

function fadeIn(el: HTMLElement) {
    if (el.style.getPropertyValue('opacity') == '1') return;
    if (el.style.getPropertyValue('display') == 'none') el.style.removeProperty('display');
    fade(el, [{ opacity: '0' }, { opacity: '1' }]);
}

function fadeOut(el: HTMLElement) {
    if (el.style.getPropertyValue('opacity') == '0' || el.style.getPropertyValue('display') == 'none') return;
    fade(el, [{ opacity: '1' }, { opacity: '0' }], () => el.style.setProperty('display', 'none'));
}

function createDropdown(el: HTMLElement, level: number) {
    const dropdown = el.cloneNode(true) as HTMLUListElement;
    dropdown.classList.add('dropotron');
    dropdown.classList.add(`level-${level}`);
    const parent = el.parentElement!;
    const rect = parent.getBoundingClientRect();
    dropdown.style.setProperty('right', `${Math.max(document.body.clientWidth - (level == 0 ? rect.right : rect.left), 0)}px`);
    dropdown.style.setProperty('top', `${level == 0 ? rect.bottom : rect.top}px`);
    dropdown.style.setProperty('opacity', '0');
    document.body.appendChild(dropdown);
    const children = Array.from(dropdown.querySelectorAll('ul'), ul => {
        const ret = createDropdown(ul, level + 1);
        ul.remove();
        return ret;
    });
    dropdown.style.setProperty('display', 'none');
    dropdown.style.removeProperty('opacity');

    const fadeOutHandler = (ev: Event) => {
        ev.stopPropagation();
        window.clearTimeout(fadeTimeouts.get(dropdown));
        fadeTimeouts.set(dropdown, window.setTimeout(() => fadeOut(dropdown), 350));
    };
    const fadeInHandler = (ev: Event) => {
        ev.stopPropagation();
        window.clearTimeout(fadeTimeouts.get(dropdown));
        fadeIn(dropdown);
    };
    const hoverHandler = (ev: Event) => {
        ev.stopPropagation();
        window.clearTimeout(fadeTimeouts.get(dropdown));
    };

    window.addEventListener('keypress', ev => {
        if (ev.key == 'Escape') {
            ev.stopPropagation();
            ev.preventDefault();
            window.clearTimeout(fadeTimeouts.get(dropdown));
            fadeOut(dropdown);
        }
    });

    if (document.body.classList.contains('is-touch')) {
        parent.addEventListener('click', (ev: MouseEvent) => {
            if (parent.contains(ev.target as Node) || dropdown.contains(ev.target as Node)) {
                ev.stopPropagation();
                ev.preventDefault();
                fadeInHandler(ev);
            }
        });
        window.addEventListener('click', (ev: MouseEvent) => {
            if (!(parent.contains(ev.target as Node) || dropdown.contains(ev.target as Node))) {
                ev.stopPropagation();
                ev.preventDefault();
                fadeOutHandler(ev);
            }
        });
        window.addEventListener('scroll', fadeOutHandler);
    } else {
        dropdown.addEventListener('mouseleave', fadeOutHandler);
        children.forEach(c => {
            c.addEventListener('mouseenter', hoverHandler);
            c.addEventListener('mouseleave', fadeOutHandler);
        });
        dropdown.addEventListener('mouseenter', hoverHandler);
        parent.addEventListener('mouseenter', fadeInHandler);
        parent.addEventListener('mouseleave', fadeOutHandler);
    }
    return dropdown;
}

addEventListener('DOMContentLoaded', () => {
    for (const el of document.getElementById('nav')?.getElementsByClassName('dropdown')!) {
        createDropdown(el as HTMLElement, 0);
    }
});
