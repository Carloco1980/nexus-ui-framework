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

        config: {},

        init() {

            this.config = global.NX.config?.icons || {};

            this.render();

            if (global.NX.config?.debug?.enabled) {
                console.info("Icons Ready");
            }

        },

        async load(name) {

            const cacheEnabled = this.config.cache !== false;

            if (cacheEnabled && CACHE.has(name)) {

                return CACHE.get(name);

            }

            try {

                const response = await fetch(
                    `${this.config.path || this.path}${name}${this.config.extension || ".svg"}`
                );

                if (!response.ok) {

                    throw new Error();

                }

                const svg = await response.text();

                if (cacheEnabled) {
                    CACHE.set(name, svg);
                }

                return svg;

            } catch (error) {

                if (
                    global.NX.config?.debug?.enabled &&
                    global.NX.config?.debug?.showWarnings !== false
                ) {
                    console.warn(`Icon "${name}" not found.`);
                }

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
