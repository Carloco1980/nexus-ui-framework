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

        /*--------------------------------------------------
        Init
        --------------------------------------------------*/

        init() {

            this.bindOpenButtons();

            this.bindCloseButtons();

            this.bindKeyboard();

            this.bindOverlay();

            console.info("Modal Ready");

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

                if (event.key !== "Escape") {

                    return;

                }

                const modal = document.querySelector(
                    `${SELECTORS.modal}.is-open`
                );

                if (!modal) {

                    return;

                }

                this.close(modal.id);

            });

        },

        /*--------------------------------------------------
        Overlay
        --------------------------------------------------*/

        bindOverlay() {

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

            document.body.classList.add(
                "nx-modal-open"
            );

            modal.setAttribute(
                "aria-hidden",
                "false"
            );

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

            document.body.classList.remove(
                "nx-modal-open"
            );

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

            this.lastFocusedElement?.focus();

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