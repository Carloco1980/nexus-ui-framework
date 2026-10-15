/*
==================================================
NEXUS UI FRAMEWORK

Module : Floating Action Button (FAB)
Version: 0.9.0 RC1

==================================================
*/

"use strict";

/*==================================================
FAB Module
==================================================*/

const NexusFab = {

    initialized: false,

    init() {

        if (this.initialized) return;

        this.cacheDOM();

        if (!this.button) {
            return;
        }

        this.configure();

        this.bindEvents();

        this.initialized = true;

    },

    /*--------------------------------------------------
    Cache DOM
    --------------------------------------------------*/

    cacheDOM() {

        this.button = document.querySelector(".nx-whatsapp-button");

    },

    /*--------------------------------------------------
    Configure FAB
    --------------------------------------------------*/

    configure() {

        const phone = this.button.dataset.whatsappNumber;

        if (!phone) {
            return;
        }

        const cleanPhone = phone.replace(/\D/g, "");

        this.button.href = `https://wa.me/${cleanPhone}`;
        this.button.target = "_blank";
        this.button.rel = "noopener noreferrer";

    },

    /*--------------------------------------------------
    Events
    --------------------------------------------------*/

    bindEvents() {

        this.button.addEventListener("click", () => {

            if (window.NX.config?.debug?.enabled) {
                console.info("Nexus FAB");
            }

        });

    }

};

window.NX = window.NX || {};
window.NX.fab = NexusFab;
window.NexusFab = NexusFab;
