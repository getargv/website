addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0) {
                entry.target.classList.remove('inactive');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: [0.1] });
    const list = document.querySelectorAll('.wrapper,.spotlight');
    for (const el of list) {
        el.classList.add('inactive');
        observer.observe(el);
    }
    window.addEventListener('scroll', _ev => {
        window.requestAnimationFrame(_ts => {
            Array.from(list).forEach(el => {
                const rect = el.getBoundingClientRect();
                (el as HTMLElement).style.setProperty('background-position-y', `-${rect.y / 10}px`);
            });
        });
    }, { passive: true });

    Array.from(document.getElementsByClassName('scrolly')).forEach(anchor => {
        anchor.addEventListener('click', (e: Event) => {
            e.preventDefault();
            const id = anchor.getAttribute('href')!.slice(1);
            document.getElementById(id)?.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
