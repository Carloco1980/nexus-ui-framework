/*
==================================================
Nexus Icons
==================================================
*/

(function (global) {

    "use strict";

    /*==================================================
    Cache
    ==================================================*/

    const CACHE = new Map();

    /*==================================================
    Icons Module
    ==================================================*/

    const Icons = {

        path: "assets/icons/",

        init() {

            this.render();

            console.info("Icons Ready");

        },

        async load(name) {

            if (CACHE.has(name)) {

                return CACHE.get(name);

            }

            try {

                const response = await fetch(
                    `${this.path}${name}.svg`
                );

                if (!response.ok) {

                    throw new Error();

                }

                const svg = await response.text();

                CACHE.set(name, svg);

                return svg;

            } catch (error) {

                console.warn(
                    `Icon "${name}" not found.`
                );

                return null;

            }

        },

        async render() {

            const icons = document.querySelectorAll(
                "[data-nx-icon]"
            );

            for (const element of icons) {

                const name = element.dataset.nxIcon;

                const svg = await this.load(name);

                if (!svg) {

                    continue;

                }

                element.innerHTML = svg;

            }

        },

        refresh() {

            this.render();

        },

        clearCache() {

            CACHE.clear();

        }

    };

    /*==================================================
    Public API
    ==================================================*/

    global.NX = global.NX || {};

    global.NX.icons = Icons;

    /*==================================================
    Module Init
    ==================================================*/

    global.NexusIcons = {

        init() {

            Icons.init();

        }

    };

})(window);