/*
==================================================
NEXUS UI FRAMEWORK

Module : Navbar
Version: 0.9.0 RC1

==================================================
*/

"use strict";

/*==================================================
Navbar Module
==================================================*/

const NexusNavbar = {

    init() {

        this.cacheDOM();
        this.bindEvents();

    },

    /*--------------------------------------------------
    Cache DOM
    --------------------------------------------------*/

    cacheDOM() {

        this.mobileButton = document.querySelector(".nx-mobile-button");
        this.menu = document.querySelector("#nx-menu");
        this.links = document.querySelectorAll("#nx-menu a");

    },

    /*--------------------------------------------------
    Events
    --------------------------------------------------*/

    bindEvents() {

        if (!this.mobileButton || !this.menu) {

            return;

        }

        this.mobileButton.addEventListener("click", () => {

            this.toggleMenu();

        });

        this.links.forEach((link) => {

            link.addEventListener("click", () => {

                this.closeMenu();

            });

        });

    },

    /*--------------------------------------------------
    Toggle Menu
    --------------------------------------------------*/

    toggleMenu() {

        const isOpen = this.menu.classList.toggle("is-open");

        this.mobileButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        this.mobileButton.setAttribute(
            "aria-label",
            isOpen ? "Close Menu" : "Open Menu"
        );

    },

    /*--------------------------------------------------
    Close Menu
    --------------------------------------------------*/

    closeMenu() {

        this.menu.classList.remove("is-open");

        this.mobileButton.setAttribute(
            "aria-expanded",
            "false"
        );

        this.mobileButton.setAttribute(
            "aria-label",
            "Open Menu"
        );

    }

};

window.NexusNavbar = NexusNavbar;