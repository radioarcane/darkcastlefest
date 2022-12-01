
const openStateClass = 'state--menu-open';

const closeNav = () => {
    document.body.classList.remove(openStateClass);
};

const openNav = () => {
    document.body.classList.add(openStateClass);

};

const setEvents = (toggleEl) => {
    toggleEl.addEventListener('click', ev => {
        ev.preventDefault;

        const isOpen = toggleEl.getAttribute('aria-expanded') === 'true' ? true : false;
        isOpen ? closeNav() : openNav();
        toggleEl.setAttribute('aria-expanded', !isOpen);
    });

    document.addEventListener('keydown', ev => {
        const keyName = ev.key.toString().toLowerCase();

        switch (keyName) {
            case 'escape':
                closeNav();
                toggleEl.setAttribute('aria-expanded', false);
                break;

            case 'enter':
            case ' ': // space
            case 'arrowdown':
                openNav();
                toggleEl.setAttribute('aria-expanded', true);
                break;

            default:
                break;
        }
    });
};

function initNavMenu () {
    const navMenuToggle = document.getElementById('menu-toggle');

    if (navMenuToggle) {
        setEvents(navMenuToggle);
    }
};


export default initNavMenu;