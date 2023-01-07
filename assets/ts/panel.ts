function* parents(el: HTMLElement): IterableIterator<HTMLElement> {
    do {
        el = el.parentElement!;
        yield el;
    } while (el);
}

function numParentsOfTagName(el: HTMLElement, filter: string): number {
    let count = 0;
    for (const element of parents(el)) {
        if (element?.tagName.toUpperCase() == filter.toUpperCase()) count++;
    }
    return count;
}

function* navList(el: HTMLElement): IterableIterator<HTMLAnchorElement> {
    for (const a of <NodeListOf<HTMLElement>>el.querySelectorAll('a,iframe')) {
        const indent = Math.max(0, numParentsOfTagName(a, 'li') - 1);
        const ac = a.cloneNode() as HTMLAnchorElement;
        ac.className = ''; // reset to empty
        ac.classList.add("link", `depth-${indent}`);
        const i = document.createElement('span');
        i.className = `indent-${indent}`;
        ac.prepend(i);
        ac.append(a.innerText);
        yield ac;
    }
}

type PanelConfig = {
    delay: number,
    hideOnClick: boolean,
    hideOnEscape: boolean,
    hideOnSwipe: boolean,
    resetScroll: boolean,
    resetForms: boolean,
    side: 'left' | 'right' | 'top' | 'bottom',
    target: HTMLElement,
    visibleClass: string
};
type PanelConfigInit = Partial<PanelConfig>;

function panelify(el: HTMLElement, userConfig: PanelConfigInit) {
    const config: PanelConfig = Object.assign({
        delay: 0,               // Delay.
        hideOnClick: false,     // Hide panel on link click.
        hideOnEscape: false,    // Hide panel on escape keypress.
        hideOnSwipe: false,     // Hide panel on swipe.
        resetScroll: false,     // Reset scroll position on hide.
        resetForms: false,      // Reset forms on hide.
        side: null,             // Side of viewport the panel will appear.
        target: el,             // Target element for "class".
        visibleClass: 'visible' // Class to toggle.
    }, userConfig);

    // Methods.
    const _hide = (el: HTMLElement, event?: Event) => {
        // Already hidden? Bail.
        if (!config.target.classList.contains(config.visibleClass)) return;

        // If an event was provided, cancel it.
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Hide.
        config.target.classList.remove(config.visibleClass);

        // Post-hide stuff.
        window.setTimeout(() => {
            // Reset scroll position.
            if (config.resetScroll) el.scrollTop = 0;
            // Reset forms.
            if (config.resetForms) for (const f of el.getElementsByTagName('form')) f.reset();
        }, config.delay);
    };

    // Vendor fixes.
    el.style.setProperty('-ms-overflow-style', '-ms-autohiding-scrollbar');
    el.style.setProperty('-webkit-overflow-scrolling', 'touch');

    // Hide on click.
    if (config.hideOnClick) {

        for (const a of el.getElementsByTagName('a')) a.style.setProperty('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

        el.addEventListener('click', (event: MouseEvent) => {
            const a = event.target as HTMLAnchorElement;

            if (a.tagName != 'A' || !a.hasAttribute('href') || ['#', '', '#' + el.id].includes(a.getAttribute('href')!)) return;

            // Hide panel.
            _hide(el, event);

            // Redirect to href.
            window.setTimeout(() => {
                if (a.target == '_blank') {
                    window.open(a.href);
                } else {
                    window.location.href = a.href;
                }
            }, config.delay + 10);
        },true);
    }

    // Event: Touch stuff.
    el.addEventListener('touchstart', (event: TouchEvent) => {
        el.dataset.touchPosX = event.touches[0].pageX.toString();
        el.dataset.touchPosY = event.touches[0].pageY.toString();
    });

    el.addEventListener('touchmove', (event: TouchEvent) => {

        if (el.dataset.touchPosX === null || el.dataset.touchPosY === null) return;

        const diffX = parseInt(el.dataset.touchPosX ?? '0') - event.touches[0].pageX,
            diffY = parseInt(el.dataset.touchPosY ?? '0') - event.touches[0].pageY,
            th = el.offsetHeight,
            ts = (el.scrollHeight - el.scrollTop);

        // Hide on swipe?
        if (config.hideOnSwipe) {

            let result = false;
            const boundary = 20,
                delta = 50;

            switch (config.side) {
                case 'left':
                    result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
                    break;
                case 'right':
                    result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
                    break;
                case 'top':
                    result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
                    break;
                case 'bottom':
                    result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
                    break;
                default:
                    break;
            }

            if (result) {
                el.dataset.touchPosX = undefined;
                el.dataset.touchPosY = undefined;
                _hide(el);

                return false;
            }
        }

        // Prevent vertical scrolling past the top or bottom.
        if ((el.scrollTop < 0 && diffY < 0) || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {
            event.preventDefault();
            event.stopPropagation();
        }
    });

    // Event: Prevent certain events inside the panel from bubbling.
    ['click', 'touchend', 'touchstart', 'touchmove'].forEach((ev: string) => el.addEventListener(ev, (event: Event) => {
        event.stopPropagation();
    }));

    // Event: Hide panel if a child anchor tag pointing to its ID is clicked.
    el.addEventListener('click', (event: MouseEvent) => {
        const a = event.target as HTMLAnchorElement;
        if (a.tagName != 'A' || a.getAttribute('href') != `#${el.id}`) return;

        _hide(el, event);
    },true);

    // Body.

    // Event: Hide panel on body click/tap.
    ['click', 'touchend'].forEach((ev: string) => document.body.addEventListener(ev, (event: Event) => _hide(el, event)));

    // Event: Toggle.
    document.body.addEventListener('click', (event: MouseEvent) => {
        const a = event.target as HTMLAnchorElement;
        if (a.tagName != 'A' || a.getAttribute('href') != `#${el.id}`) return;

        event.preventDefault();
        event.stopPropagation();
        config.target.classList.toggle(config.visibleClass);
    },true);

    // Window.

    // Event: Hide on ESC.
    if (config.hideOnEscape) {
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key == 'Escape') { _hide(el, event) }
        });
    }

    return el;
}

addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('navPanel');
    panel?.querySelector("nav")?.append(...navList(document.getElementById('nav')!));
    panelify(panel!, {
        delay: 500,
        hideOnClick: true,
        hideOnSwipe: true,
        resetScroll: true,
        resetForms: true,
        side: 'left',
        target: document.body,
        visibleClass: 'navPanel-visible'
    });
});

