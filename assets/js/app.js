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

    initialized: false,

    initializing: false,

    waitingForDOM: false,

    /*--------------------------------------------------
    Init
    --------------------------------------------------*/

    init() {

        if (this.initialized || this.initializing) {
            return;
        }

        if (document.readyState === "loading") {
            if (!this.waitingForDOM) {
                this.waitingForDOM = true;
                document.addEventListener("DOMContentLoaded", () => {
                    this.waitingForDOM = false;
                    this.init();
                }, { once: true });
            }
            return;
        }

        this.initializing = true;

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

        this.initializing = false;
        this.initialized = true;

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

        const modules = Object.entries(this).filter(([, module]) =>
            typeof module?.init === "function"
        );

        modules.forEach(([moduleName, module]) => {

            try {
                module.init();
            } catch (error) {
                if (this.config?.debug?.enabled) {
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

NX.init();
