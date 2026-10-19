/*
==================================================
Nexus Modal
==================================================
*/

(function (global) {

    "use strict";

    /*==================================================
    Selectors
    ==================================================*/

    const SELECTORS = {

        modal: ".nx-modal",

        overlay: ".nx-modal__overlay",

        openButton: "[data-nx-modal-open]",

        closeButton: "[data-nx-modal-close]"

    };

    /*==================================================
    Modal
    ==================================================*/

    const Modal = {

        lastFocusedElement: null,

        initialized: false,

        /*--------------------------------------------------
        Init
        --------------------------------------------------*/

        init() {

            if (this.initialized) return;

            if (!document.querySelector(SELECTORS.modal)) return;

            this.config = global.NX.config?.modal || {};

            this.bindOpenButtons();

            this.bindCloseButtons();

            this.bindKeyboard();

            this.bindOverlay();

            this.initialized = true;

            if (global.NX.config?.debug?.enabled) {
                console.info("Modal Ready");
            }

        },

        /*--------------------------------------------------
        Open Buttons
        --------------------------------------------------*/

        bindOpenButtons() {

            document
                .querySelectorAll(SELECTORS.openButton)
                .forEach((button) => {

                    button.addEventListener("click", () => {

                        this.open(
                            button.dataset.nxModalOpen
                        );

                    });

                });

        },

        /*--------------------------------------------------
        Close Buttons
        --------------------------------------------------*/

        bindCloseButtons() {

            document
                .querySelectorAll(SELECTORS.closeButton)
                .forEach((button) => {

                    button.addEventListener("click", () => {

                        const modal = button.closest(
                            SELECTORS.modal
                        );

                        if (modal) {

                            this.close(modal.id);

                        }

                    });

                });

        },

        /*--------------------------------------------------
        ESC
        --------------------------------------------------*/

        bindKeyboard() {

            document.addEventListener("keydown", (event) => {

                const openModals = [...document.querySelectorAll(
                    `${SELECTORS.modal}.is-open[id]`
                )];
                const modal = openModals[openModals.length - 1];

                if (!modal) return;

                if (event.key === "Escape" && this.config.closeOnEscape !== false) {
                    this.close(modal.id);
                    return;
                }

                if (event.key !== "Tab") return;

                const dialog = modal.querySelector('[role="dialog"]');
                if (!dialog) return;

                const focusable = [...dialog.querySelectorAll(
                    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
                )].filter(element => element.getClientRects().length > 0);

                if (!focusable.length) {
                    event.preventDefault();
                    dialog.focus();
                    return;
                }

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
                    event.preventDefault();
                    first.focus();
                }

            });

        },

        /*--------------------------------------------------
        Overlay
        --------------------------------------------------*/

        bindOverlay() {

            if (this.config.closeOnOverlay === false) {
                return;
            }

            document
                .querySelectorAll(SELECTORS.overlay)
                .forEach((overlay) => {

                    overlay.addEventListener("click", () => {

                        const modal = overlay.closest(
                            SELECTORS.modal
                        );

                        if (modal) {

                            this.close(modal.id);

                        }

                    });

                });

        },

        /*--------------------------------------------------
        Open
        --------------------------------------------------*/

        open(id) {

            const modal = document.getElementById(id);

            if (!modal) return;

            if (modal.classList.contains("is-open")) {

                return;

            }

            this.lastFocusedElement = document.activeElement;

            modal.classList.add("is-open");

            if (this.config.lockScroll !== false) {
                document.documentElement.classList.add(
                    "nx-modal-open"
                );
            }

            modal.setAttribute(
                "aria-hidden",
                "false"
            );

            const dialog = modal.querySelector('[role="dialog"]');
            const initialFocus = dialog?.querySelector(
                'autofocus, a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
            );

            if (initialFocus) {
                initialFocus.focus();
            } else if (dialog) {
                dialog.setAttribute("tabindex", "-1");
                dialog.focus();
            }

            if (global.NX?.events) {

                global.NX.events.emit(
                    "modal:open",
                    {
                        id
                    }
                );

            }

        },

        /*--------------------------------------------------
        Close
        --------------------------------------------------*/

        close(id) {

            const modal = document.getElementById(id);

            if (!modal) return;

            if (!modal.classList.contains("is-open")) {

                return;

            }

            document.activeElement?.blur();

            modal.classList.remove("is-open");

            const anotherModalIsOpen = [...document.querySelectorAll(
                `${SELECTORS.modal}.is-open[id]`
            )].some(openModal => openModal !== modal);

            if (this.config.lockScroll !== false && !anotherModalIsOpen) {
                document.documentElement.classList.remove(
                    "nx-modal-open"
                );
            }

            modal.setAttribute(
                "aria-hidden",
                "true"
            );

            if (global.NX?.events) {

                global.NX.events.emit(
                    "modal:close",
                    {
                        id
                    }
                );

            }

            if (this.lastFocusedElement?.isConnected) {
                this.lastFocusedElement.focus();
            }

            this.lastFocusedElement = null;

        },

        /*--------------------------------------------------
        Toggle
        --------------------------------------------------*/

        toggle(id) {

            const modal = document.getElementById(id);

            if (!modal) return;

            if (modal.classList.contains("is-open")) {

                this.close(id);

            } else {

                this.open(id);

            }

        }

    };

    /*==================================================
    Public API
    ==================================================*/

    global.NX = global.NX || {};

    global.NX.modal = Modal;

    /*==================================================
    Framework Module
    ==================================================*/

    global.NexusModal = {

        init() {

            Modal.init();

        }

    };

})(window);
