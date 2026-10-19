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

        this.toggleHandler = () => {
            window.NX.theme.toggle();
        };

        this.themeChangeHandler = () => {
            this.update();
        };

        this.buttons.forEach((button) => {
            button.addEventListener("click", this.toggleHandler);

        });

        document.addEventListener("nx:themechange", this.themeChangeHandler);

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

        this.buttons.forEach((button) => {
            button.removeEventListener("click", this.toggleHandler);
        });

        if (this.themeChangeHandler) {
            document.removeEventListener("nx:themechange", this.themeChangeHandler);
        }

        this.initialized = false;

        this.buttons = [];

        this.toggleHandler = null;

        this.themeChangeHandler = null;

    }

};

/*==================================================
Expose
==================================================*/

window.NX = window.NX || {};
window.NX.themeToggle = NexusThemeToggle;
window.NexusThemeToggle = NexusThemeToggle;
