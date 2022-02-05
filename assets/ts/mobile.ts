function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        window.matchMedia("(pointer: coarse)").matches);
}

addEventListener('DOMContentLoaded', () => {
    if (isTouchDevice()) document.body.classList.add('is-touch');
});
