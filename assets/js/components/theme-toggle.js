/*
==================================================
NEXUS UI FRAMEWORK

Module  : Theme Toggle
Version : 1.0.0
Author  : Carlos Santander Díaz
License : MIT
==================================================
*/

"use strict";

/*==================================================
Theme Toggle Module
==================================================*/

const NexusThemeToggle = {

    /*--------------------------------------------------
    Properties
    --------------------------------------------------*/

    selector: ".nx-theme-toggle",

    buttons: [],

    initialized: false,

    /*--------------------------------------------------
    Init
    --------------------------------------------------*/

    init() {

        if (this.initialized) {

            return;

        }

        this.buttons = document.querySelectorAll(

            this.selector

        );

        if (!this.buttons.length) {

            return;

        }

        this.bindEvents();

        this.update();

        this.initialized = true;

    },

    /*--------------------------------------------------
    Events
    --------------------------------------------------*/

    bindEvents() {

        this.buttons.forEach((button) => {

            button.addEventListener("click", () => {

                window.NX.theme.toggle();

            });

        });

        document.addEventListener(

            "nx:themechange",

            () => {

                this.update();

            }

        );

    },

    /*--------------------------------------------------
    Update
    --------------------------------------------------*/

    update() {

        const theme = window.NX.theme.current();

        this.buttons.forEach((button) => {

            button.setAttribute(

                "aria-pressed",

                theme === window.NX.theme.THEMES.DARK

            );

            button.setAttribute(

                "aria-label",

                theme === window.NX.theme.THEMES.DARK

                    ? "Cambiar a modo claro"

                    : "Cambiar a modo oscuro"

            );

            button.dataset.theme = theme;

        });

    },

    /*--------------------------------------------------
    Destroy
    --------------------------------------------------*/

    destroy() {

        this.initialized = false;

    }

};

/*==================================================
Expose
==================================================*/

window.NX = window.NX || {};
window.NX.themeToggle = NexusThemeToggle;
window.NexusThemeToggle = NexusThemeToggle;
