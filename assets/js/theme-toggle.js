/*
==================================================
Theme Toggle
==================================================
*/

(function (global) {

    "use strict";

    const SELECTOR = ".nx-theme-toggle";

    const NexusThemeToggle = {

        buttons: [],

        init() {

            console.info("Theme Toggle Ready");

            this.buttons = document.querySelectorAll(SELECTOR);

            if (!this.buttons.length) return;

            this.bindEvents();

            this.update();

        },

        bindEvents() {

            this.buttons.forEach((button) => {

                button.addEventListener("click", () => {

                    NX.theme.toggle();

                });

            });

           NX.events.on(

    "nx:themechange",

    () => this.update()

);

        },

        update() {

            const theme = NX.theme.get();

            this.buttons.forEach((button) => {

                button.setAttribute(

                    "aria-pressed",

                    theme === "light"

                );

            });

        }

    };

    global.NexusThemeToggle = NexusThemeToggle;

})(window);