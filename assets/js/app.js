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

(function loadCardScannerModule() {

    const appScript = document.currentScript;

    if (!appScript?.src) {
        return;
    }

    const scannerModuleUrl = new URL("./core/nexus-card-scanner.js", appScript.src).href;
    const classifierModuleUrl = new URL("./core/nexus-card-classifier.js", appScript.src).href;
    const semanticGroupsModuleUrl = new URL("./core/nexus-semantic-groups.js", appScript.src).href;
    const layoutContextModuleUrl = new URL("./core/nexus-layout-context.js", appScript.src).href;

    NX.cardScannerReady = import(scannerModuleUrl)
        .then(() => import(classifierModuleUrl))
        .then(() => import(semanticGroupsModuleUrl))
        .then(() => import(layoutContextModuleUrl))
        .then(() => NX.cardScanner)
        .catch((error) => {
            if (NX.config?.debug?.enabled) {
                console.error("[Nexus] Could not load a NACE core module.", error);
            }
            return null;
        });

})();

NX.init();
