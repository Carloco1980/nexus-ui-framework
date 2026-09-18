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

    init() {

        this.cacheDOM();

        if (!this.button) {
            return;
        }

        this.configure();

        this.bindEvents();

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

            console.info("Nexus FAB");

        });

    }

};

window.NexusFab = NexusFab;