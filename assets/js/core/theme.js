(function () {

    "use strict";

    const ATTRIBUTE = "data-nx-theme";
    const STORAGE  = "nx-theme";
    const DEFAULT  = "dark";

    function apply(theme) {

        document.documentElement.setAttribute(
            ATTRIBUTE,
            theme
        );

    }

    function set(theme) {

    apply(theme);

    localStorage.setItem(
        STORAGE,
        theme
    );

    NX.events.emit(

    "nx:themechange",

    {

        theme

    }

);

}

    function get() {

        return document.documentElement.getAttribute(
            ATTRIBUTE
        );

    }

    function toggle() {

        const next = get() === "dark"
            ? "light"
            : "dark";

        set(next);

        return next;

    }

    function init() {

        const saved =
            localStorage.getItem(STORAGE)
            || DEFAULT;

        apply(saved);

    }

    window.NX = window.NX || {};

    window.NX.theme = {

        init,
        set,
        get,
        toggle

    };

})();
