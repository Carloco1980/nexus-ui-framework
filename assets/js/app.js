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

const NX = window.NX = window.NX || {};

Object.assign(NX, {

    /*--------------------------------------------------
    Framework Info
    --------------------------------------------------*/

    version: "1.0.0",

    /*--------------------------------------------------
    Init
    --------------------------------------------------*/

    init() {

        if (this.config?.debug?.enabled) {
            console.info(
                `%c${this.config.framework.name} v${this.config.framework.version}`,
                "color:#2563EB;font-weight:bold;"
            );
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
            this.theme,
            this.themeToggle,
            this.navbar,
            this.forms,
            this.fab,
            this.animations,
            this.modal,
            this.icons
        ];

        modules.forEach((module) => {
            if (typeof module?.init !== "function") {
                return;
            }

            try {
                module.init();
            } catch (error) {
                if (this.config?.debug?.enabled) {
                    const moduleName = Object.keys(this).find(
                        (key) => this[key] === module
                    ) || "unknown";

                    console.error(
                        `[Nexus] Error initializing module "${moduleName}".`,
                        error
                    );
                }
            }
        });

    }

});

/*==================================================
Expose Core
==================================================*/

window.Nexus = NX;

/*==================================================
Bootstrap
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    NX.init();

});
