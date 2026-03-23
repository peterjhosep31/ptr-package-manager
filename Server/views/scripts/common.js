window.onload = () => {

    document
        .querySelectorAll(`.header-content > nav > a[href='${location.pathname}']`)
        ?.[0]
        ?.classList
        ?.add('active');

};


document.querySelectorAll('a[href]')?.forEach(link => {
    link.addEventListener('click', (e) => {

        if (link.getAttribute('href') === location.pathname) {
            e.stopPropagation();
            e.preventDefault();
        }
    });
});
