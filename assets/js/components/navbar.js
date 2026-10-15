"use strict";

const NexusNavbar = {

    init() {
        this.cacheDOM();

        if (!this.mobileButton || !this.menu) {
            return;
        }

        this.config = window.NX.config?.navbar || {};
        this.mobileBreakpoint = window.NX.config?.breakpoints?.mobile || 900;
        this.header = this.menu.closest(".nx-header");
        this.applySticky();
        this.bindEvents();
    },

    cacheDOM() {
        this.mobileButton = document.getElementById("nx-mobile-button");
        this.menu = document.getElementById("nx-navbar-menu");
        this.links = this.menu ? this.menu.querySelectorAll("a") : [];
    },

    bindEvents() {
        this.mobileButton.addEventListener("click", () => this.toggleMenu());

        if (this.config.closeOnClick !== false) {
            this.links.forEach((link) => {
                link.addEventListener("click", () => this.closeMenu());
            });
        }

        if (this.config.closeOnResize !== false) {
            window.addEventListener("resize", () => {
                if (window.innerWidth > this.mobileBreakpoint) {
                    this.closeMenu();
                }
            });
        }

        if (this.config.closeOnEscape !== false) {
            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    this.closeMenu();
                }
            });
        }

        if (this.config.closeOnOutsideClick !== false) {
            document.addEventListener("click", (event) => {
                const navbar = this.menu.closest(".nx-navbar");

                if (
                    this.menu.classList.contains("is-open") &&
                    navbar &&
                    !navbar.contains(event.target)
                ) {
                    this.closeMenu();
                }
            });
        }
    },

    applySticky() {
        if (this.header && this.config.sticky === false) {
            this.header.style.position = "static";
        }
    },

    toggleMenu() {
        const isOpen = this.menu.classList.toggle("is-open");

        this.mobileButton.classList.toggle("is-active", isOpen);
        this.mobileButton.setAttribute("aria-expanded", String(isOpen));
        this.mobileButton.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú" : "Abrir menú"
        );
    },

    closeMenu() {
        if (!this.menu || !this.mobileButton) {
            return;
        }

        this.menu.classList.remove("is-open");
        this.mobileButton.classList.remove("is-active");
        this.mobileButton.setAttribute("aria-expanded", "false");
        this.mobileButton.setAttribute("aria-label", "Abrir menú");
    }

};

window.NX = window.NX || {};
window.NX.navbar = NexusNavbar;
window.NexusNavbar = NexusNavbar;
