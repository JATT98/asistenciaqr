var mobileMenuObj = (function () {

    let menuButton;
    let menuContainer;

    function validateMenuState() {
        if (menuContainer.classList.contains("menu-is-open")) {
            menuContainer.classList.remove("menu-is-open");
        } else {
            menuContainer.classList.add("menu-is-open");
            menuContainer.style.top = `${navbar.clientHeight}px`;
        }
    }

    return {
        func1: function start() {
            setTimeout(() => {
                menuButton = document.querySelector("#mobile-menu-button");
                menuContainer = document.querySelector(".mobile-menu-items");
                navbar = document.querySelector("#navbar");
                if (menuButton !== null) {
                    menuButton.addEventListener("click", validateMenuState);
                }
            }, 400);
        }
    }
})(mobileMenuObj || {});