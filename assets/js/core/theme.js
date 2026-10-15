/*
==================================================
NEXUS UI FRAMEWORK

Module  : Theme
Version : 1.0.0
Author  : Carlos Santander Díaz
License : MIT
==================================================
*/

"use strict";

/*==================================================
Theme Module
==================================================*/

const NexusTheme = {

    /*--------------------------------------------------
    Constants
    --------------------------------------------------*/

    THEMES: {

        DARK: "dark",

        LIGHT: "light",

        SYSTEM: "system"

    },

    /*--------------------------------------------------
    Properties
    --------------------------------------------------*/

    mediaQuery: null,

    initialized: false,

    /*--------------------------------------------------
    Init
    --------------------------------------------------*/

    init() {

        if (this.initialized) {

            return;

        }

        this.mediaQuery = typeof window.matchMedia === "function"
            ? window.matchMedia("(prefers-color-scheme: dark)")
            : null;

        this.apply(

            this.get()

        );

        this.bindEvents();

        this.initialized = true;

    },

    /*--------------------------------------------------
    Events
    --------------------------------------------------*/

    bindEvents() {

        if (!this.mediaQuery) return;

        this.mediaChangeHandler = () => {
            if (this.get() === this.THEMES.SYSTEM) {
                this.apply(this.THEMES.SYSTEM);
            }
        };

        if (this.mediaQuery.addEventListener) {
            this.mediaQuery.addEventListener("change", this.mediaChangeHandler);

        } else if (this.mediaQuery.addListener) {

            /* Compatibilidad */
            this.mediaQuery.addListener(this.mediaChangeHandler);

        }

    },

    /*--------------------------------------------------
    Resolve Theme
    --------------------------------------------------*/

    resolve(theme) {

        if (

            theme !== this.THEMES.SYSTEM

        ) {

            return theme;

        }

        return this.mediaQuery?.matches

            ? this.THEMES.DARK

            : this.THEMES.LIGHT;

    },

    /*--------------------------------------------------
    Apply Theme
    --------------------------------------------------*/

    apply(theme) {

        document.documentElement.setAttribute(

            window.NX.config.theme.attribute,

            this.resolve(theme)

        );

        document.dispatchEvent(

            new CustomEvent(

                "nx:themechange",

                {

                    detail: {

                        theme: this.current()

                    }

                }

            )

        );

    },

    /*--------------------------------------------------
    Set Theme
    --------------------------------------------------*/

    set(theme) {

        this.apply(theme);

        if (window.NX.config.theme.savePreference) {
            try {
                localStorage.setItem(window.NX.config.theme.storageKey, theme);
            } catch (error) {
                if (window.NX.config.debug?.enabled) {
                    console.warn("Nexus could not save the theme preference.", error);
                }
            }
        }

    },

    /*--------------------------------------------------
    Get Theme
    --------------------------------------------------*/

    get() {
        try {
            return localStorage.getItem(window.NX.config.theme.storageKey)
                || window.NX.config.theme.default;
        } catch (error) {
            return window.NX.config.theme.default;
        }

    },

    /*--------------------------------------------------
    Current Theme
    --------------------------------------------------*/

    current() {

        return this.resolve(

            this.get()

        );

    },

    /*--------------------------------------------------
    Toggle
    --------------------------------------------------*/

    toggle() {

        const next =

            this.current() === this.THEMES.DARK

                ? this.THEMES.LIGHT

                : this.THEMES.DARK;

        this.set(next);

        return next;

    },

    /*--------------------------------------------------
    Helpers
    --------------------------------------------------*/

    isDark() {

        return (

            this.current() === this.THEMES.DARK

        );

    },

    isLight() {

        return (

            this.current() === this.THEMES.LIGHT

        );

    },

    /*--------------------------------------------------
    Reset
    --------------------------------------------------*/

    reset() {

        try {
            localStorage.removeItem(window.NX.config.theme.storageKey);
        } catch (error) {
            if (window.NX.config.debug?.enabled) {
                console.warn("Nexus could not clear the theme preference.", error);
            }
        }

        this.apply(

            window.NX.config.theme.default

        );

    },

    /*--------------------------------------------------
    Destroy
    --------------------------------------------------*/

    destroy() {

        if (this.mediaQuery && this.mediaChangeHandler) {
            if (this.mediaQuery.removeEventListener) {
                this.mediaQuery.removeEventListener("change", this.mediaChangeHandler);
            } else if (this.mediaQuery.removeListener) {
                this.mediaQuery.removeListener(this.mediaChangeHandler);
            }
        }

        this.initialized = false;

        this.mediaChangeHandler = null;

    }

};

/*==================================================
Expose
==================================================*/

window.NX = window.NX || {};
window.NX.theme = NexusTheme;
window.NexusTheme = NexusTheme;
