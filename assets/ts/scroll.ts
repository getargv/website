addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0) {
                entry.target.classList.remove('inactive');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: [0.1] });
    for (const el of document.querySelectorAll('.wrapper,.spotlight')) {
        el.classList.add('inactive');
        observer.observe(el);
    }

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
