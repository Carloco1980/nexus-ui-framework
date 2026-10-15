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

        this.mediaQuery = window.matchMedia(

            "(prefers-color-scheme: dark)"

        );

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

        if (this.mediaQuery.addEventListener) {

            this.mediaQuery.addEventListener(

                "change",

                () => {

                    if (

                        this.get() === this.THEMES.SYSTEM

                    ) {

                        this.apply(

                            this.THEMES.SYSTEM

                        );

                    }

                }

            );

        } else {

            /* Compatibilidad */

            this.mediaQuery.addListener(() => {

                if (

                    this.get() === this.THEMES.SYSTEM

                ) {

                    this.apply(

                        this.THEMES.SYSTEM

                    );

                }

            });

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

        return this.mediaQuery.matches

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

        if (

            window.NX.config.theme.savePreference

        ) {

            localStorage.setItem(

                window.NX.config.theme.storageKey,

                theme

            );

        }

    },

    /*--------------------------------------------------
    Get Theme
    --------------------------------------------------*/

    get() {

        return (

            localStorage.getItem(

                window.NX.config.theme.storageKey

            )

            ||

            window.NX.config.theme.default

        );

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

        localStorage.removeItem(

            window.NX.config.theme.storageKey

        );

        this.apply(

            window.NX.config.theme.default

        );

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
window.NX.theme = NexusTheme;
window.NexusTheme = NexusTheme;
