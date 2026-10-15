/*
==================================================
NEXUS UI FRAMEWORK

Module  : Config
Version : 1.0.0
Author  : Carlos Santander Díaz
License : MIT

Global Framework Configuration
==================================================
*/

"use strict";

/*==================================================
Framework Configuration
==================================================*/

const NexusConfig = {

    /*--------------------------------------------------
    Framework
    --------------------------------------------------*/

    framework: {

        name: "Nexus UI Framework",

        version: "1.0.0"

    },

    /*--------------------------------------------------
    Debug
    --------------------------------------------------*/

    debug: {

        enabled: false,

        showWarnings: true,

        logEvents: false

    },

    /*--------------------------------------------------
    Locale
    --------------------------------------------------*/

    locale: {

        language: "es",

        fallback: "en"

    },

    /*--------------------------------------------------
    Theme
    --------------------------------------------------*/

    theme: {

        default: "system",

        attribute: "data-nx-theme",

        storageKey: "nx-theme",

        savePreference: true

    },

    /*--------------------------------------------------
    Animations
    --------------------------------------------------*/

    animations: {

        enabled: true,

        reducedMotion: false,

        duration: 300,

        easing: "ease"

    },

    /*--------------------------------------------------
    Breakpoints
    --------------------------------------------------*/

    breakpoints: {

        mobile: 900,

        tablet: 768,

        laptop: 1100,

        desktop: 1200

    },

    /*--------------------------------------------------
    Navbar
    --------------------------------------------------*/

    navbar: {

        sticky: true,

        closeOnResize: true,

        closeOnClick: true,

        closeOnEscape: true,

        closeOnOutsideClick: true

    },

    /*--------------------------------------------------
    Modal
    --------------------------------------------------*/

    modal: {

        closeOnEscape: true,

        closeOnOverlay: true,

        lockScroll: true

    },

    /*--------------------------------------------------
    Icons
    --------------------------------------------------*/

    icons: {

        path: "assets/icons/",

        extension: ".svg",

        cache: true

    }

};

/*==================================================
Expose
==================================================*/

window.NX = window.NX || {};
window.NX.config = NexusConfig;
window.NexusConfig = NexusConfig;
