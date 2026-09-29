/*
==================================================
NEXUS UI FRAMEWORK

Version : 1.0.0
Author  : Carlos Santander Díaz
License : MIT
==================================================
*/

"use strict";

/*==================================================
Nexus Core
==================================================*/

const Nexus = {

    /*--------------------------------------------------
    Framework Info
    --------------------------------------------------*/

    version: "1.0.0",

    /*--------------------------------------------------
    Init
    --------------------------------------------------*/

    init() {

        console.info(
            `%cNexus UI Framework v${this.version}`,
            "color:#2563EB;font-weight:bold;"
        );

        this.bindEvents();

        this.initializeModules();

    },

    /*--------------------------------------------------
    Global Events
    --------------------------------------------------*/

    bindEvents() {

        // Eventos globales del Framework.

    },

    /*--------------------------------------------------
    Module Loader
    --------------------------------------------------*/

    initializeModules() {

        const modules = [

            window.NexusNavbar,
            window.NexusForms,
            window.NexusFab,
            window.NexusAnimations

        ];

        modules.forEach((module) => {

            if (module?.init) {

                module.init();

            }

        });

    }

};

/*==================================================
Expose Core
==================================================*/

window.Nexus = Nexus;

/*==================================================
Bootstrap
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    Nexus.init();

});