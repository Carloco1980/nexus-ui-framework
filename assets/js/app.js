/*
==================================================
Nexus UI Framework

Version : 0.9.0 RC1
Author  : Carlos Santander Díaz
License : MIT

Copyright (c) 2026 Carlos Santander Díaz
==================================================
*/

"use strict";

/*==================================================
Nexus Core
==================================================*/

const Nexus = {

    version: "0.9.0 RC1",

    init() {

        console.info(
            `%cNexus UI Framework v${this.version}`,
            "color:#2563EB;font-weight:bold;"
        );

        this.cacheDOM();
        this.bindEvents();
        this.initializeModules();

    },

    /*--------------------------------------------------
    Cache DOM
    --------------------------------------------------*/

    cacheDOM() {

        this.mobileButton = document.querySelector(".nx-mobile-button");
        this.menu = document.querySelector("#nx-menu");

    },

    /*--------------------------------------------------
    Global Events
    --------------------------------------------------*/

    bindEvents() {

        // Eventos globales del Framework.
        // Los componentes tendrán sus propios eventos.

    },

    /*--------------------------------------------------
    Module Loader
    --------------------------------------------------*/

    initializeModules() {

        if (window.NexusNavbar?.init) {
            window.NexusNavbar.init();
        }

        if (window.NexusForms?.init) {
            window.NexusForms.init();
        }

        if (window.NexusFab?.init) {
            window.NexusFab.init();
        }

        if (window.NexusAnimations?.init) {
            window.NexusAnimations.init();
        }

    }

};

/*==================================================
Initialize Framework
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    Nexus.init();

});