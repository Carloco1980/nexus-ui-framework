/*
==================================================
NEXUS UI FRAMEWORK

Module  : Navbar
Version : 1.0.0
Author  : Carlos Santander Díaz
License : MIT
==================================================
*/

"use strict";

/*==================================================
Navbar Module
==================================================*/

const NexusNavbar = {

    /*--------------------------------------------------
    Init
    --------------------------------------------------*/

    init() {

        this.cacheDOM();

        if (!this.mobileButton || !this.menu) {

            return;

        }

        this.bindEvents();

    },

    /*--------------------------------------------------
    Cache DOM
    --------------------------------------------------*/

    cacheDOM() {

        this.mobileButton = document.getElementById(
            "nx-mobile-button"
        );

        this.menu = document.getElementById(
            "nx-navbar-menu"
        );

        this.links = this.menu
            ? this.menu.querySelectorAll("a")
            : [];

    },

    /*--------------------------------------------------
    Events
    --------------------------------------------------*/

    bindEvents() {

        this.mobileButton.addEventListener("click", () => {

            this.toggleMenu();

        });

        this.links.forEach((link) => {

            link.addEventListener("click", () => {

                this.closeMenu();

            });

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 900) {

                this.closeMenu();

            }

        });

    },

    /*--------------------------------------------------
    Toggle Menu
    --------------------------------------------------*/

    toggleMenu() {

        const isOpen = this.menu.classList.toggle(
            "is-open"
        );

        this.mobileButton.classList.toggle(
            "is-active",
            isOpen
        );

        this.mobileButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        this.mobileButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation"
                : "Open navigation"
        );

    },

    /*--------------------------------------------------
    Close Menu
    --------------------------------------------------*/

    closeMenu() {

        if (!this.menu || !this.mobileButton) {

            return;

        }

        this.menu.classList.remove(
            "is-open"
        );

        this.mobileButton.classList.remove(
            "is-active"
        );

        this.mobileButton.setAttribute(
            "aria-expanded",
            "false"
        );

        this.mobileButton.setAttribute(
            "aria-label",
            "Open navigation"
        );

    }

};

/*==================================================
Expose Module
==================================================*/

window.NexusNavbar = NexusNavbar;