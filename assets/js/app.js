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

        /*----------------------------------------------
        Core Services
        ----------------------------------------------*/

        if (window.NX?.theme?.init) {

            window.NX.theme.init();

        }

        /*----------------------------------------------
        Global Events
        ----------------------------------------------*/

        this.bindEvents();

        /*----------------------------------------------
        Modules
        ----------------------------------------------*/

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
            window.NexusThemeToggle,
            window.NexusNavbar,
            window.NexusForms,
            window.NexusFab,
            window.NexusAnimations,
            window.NexusModal,
            window.NexusIcons


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