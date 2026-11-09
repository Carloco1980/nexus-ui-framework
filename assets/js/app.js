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
Core Module Registry and Bootstrap
==================================================*/

(function loadNexusModules() {

    const CORE_MODULES = [
        { path: "assets/js/core/config.js", loaded: () => Boolean(NX.config) },
        { path: "assets/js/core/events.js", loaded: () => Boolean(NX.events) },
        { path: "assets/js/core/theme.js", loaded: () => Boolean(NX.theme) },
        { path: "components/theme-toogle/theme-toggle.js", loaded: () => Boolean(NX.themeToggle) },
        { path: "assets/js/core/nexus-card-scanner.js", phase: "nace" },
        { path: "assets/js/core/nexus-card-classifier.js", phase: "nace" },
        { path: "assets/js/core/nexus-semantic-groups.js", phase: "nace" },
        { path: "assets/js/core/nexus-layout-context.js", phase: "nace" },
        { path: "assets/js/core/nexus-composition-policy.js", phase: "nace" },
        { path: "assets/js/core/nexus-visual-weight.js", phase: "nace" },
        { path: "assets/js/core/nexus-placement-solver.js", phase: "nace" },
        { path: "assets/js/core/nexus-layout-validator.js", phase: "nace" },
        { path: "assets/js/core/nexus-layout-score.js", phase: "nace" },
        { path: "assets/js/core/nexus-golden-layout.js", phase: "nace" },
        { path: "assets/js/core/nexus-render-engine.js", phase: "nace" }
    ];

    function resolveFrameworkBaseUrl() {

        try {
            if (NX.frameworkAssetBaseUrl) {
                return new URL(NX.frameworkAssetBaseUrl, document.baseURI);
            }

            const appScriptUrl = document.currentScript?.src;
            return appScriptUrl ? new URL("../../", appScriptUrl) : null;
        } catch (_) {
            return null;
        }

    }

    const frameworkBaseUrl = resolveFrameworkBaseUrl();

    if (!frameworkBaseUrl) {
        NX.coreReady = Promise.resolve(null);
        NX.cardScannerReady = NX.coreReady;
        if (NX.config?.debug?.enabled) {
            console.error("[Nexus] Could not resolve the Framework base URL; core modules were not loaded.");
        }
        return;
    }

    function loadModules(modules) {
        return modules.reduce(
            (loading, module) => loading.then(() => module.loaded?.()
                ? undefined
                : import(new URL(module.path, frameworkBaseUrl).href)),
            Promise.resolve()
        );
    }

    const frameworkModules = CORE_MODULES.filter((module) => module.phase !== "nace");
    const naceModules = CORE_MODULES.filter((module) => module.phase === "nace");

    NX.coreReady = loadModules(frameworkModules)
        .then(() => new Promise((resolve) => {
            NX.init();
            if (NX.initialized) {
                resolve(NX);
                return;
            }

            document.addEventListener("DOMContentLoaded", () => resolve(NX), { once: true });
        }))
        .catch((error) => {
            if (NX.config?.debug?.enabled) {
                console.error("[Nexus] Could not load a Framework core module.", error);
            }
            return null;
        });

    NX.cardScannerReady = NX.coreReady
        .then((framework) => framework ? loadModules(naceModules).then(() => NX.cardScanner) : null)
        .catch((error) => {
            if (NX.config?.debug?.enabled) {
                console.error("[Nexus] Could not load a NACE core module.", error);
            }
            return null;
        });

})();
