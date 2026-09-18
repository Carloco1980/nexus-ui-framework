/*
==================================================
NEXUS UI FRAMEWORK

Module : Forms
Version: 0.9.0 RC1

==================================================
*/

"use strict";

/*==================================================
Forms Module
==================================================*/

const NexusForms = {

    init() {

        this.cacheDOM();

        if (!this.contactForm) {
            return;
        }

        this.bindEvents();

    },

    /*--------------------------------------------------
    Cache DOM
    --------------------------------------------------*/

    cacheDOM() {

        this.contactForm = document.querySelector("#nx-contact-form");
        this.contactStatus = document.querySelector("#nx-contact-status");

    },

    /*--------------------------------------------------
    Events
    --------------------------------------------------*/

    bindEvents() {

        this.contactForm.addEventListener(
            "submit",
            (event) => this.submit(event)
        );

    },

    /*--------------------------------------------------
    Submit Form
    --------------------------------------------------*/

    async submit(event) {

        event.preventDefault();

        const fields = [
            ...this.contactForm.querySelectorAll("input, textarea, select")
        ];

        const valid = this.validate(fields);

        if (!valid) {

            this.showStatus(
                "Please complete the required fields."
            );

            return;

        }

        const button = this.contactForm.querySelector(
            "button[type='submit']"
        );

        button.disabled = true;

        this.showStatus("Sending message...");

        try {

            const response = await fetch(
                this.contactForm.action,
                {
                    method: "POST",
                    body: new FormData(this.contactForm),
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "Unable to send the message."
                );

            }

            this.contactForm.reset();

            fields.forEach(field => {

                field.setAttribute(
                    "aria-invalid",
                    "false"
                );

            });

            this.showStatus(
                result.message ||
                "Message sent successfully."
            );

        }

        catch (error) {

            this.showStatus(

                error.message ||
                "Unable to send the message."

            );

        }

        finally {

            button.disabled = false;

        }

    },

    /*--------------------------------------------------
    Validate
    --------------------------------------------------*/

    validate(fields) {

        let valid = true;

        fields.forEach(field => {

            const isValid = field.checkValidity();

            field.setAttribute(
                "aria-invalid",
                String(!isValid)
            );

            if (!isValid) {

                valid = false;

            }

        });

        return valid;

    },

    /*--------------------------------------------------
    Status
    --------------------------------------------------*/

    showStatus(message) {

        if (!this.contactStatus) {
            return;
        }

        this.contactStatus.textContent = message;

    }

};

window.NexusForms = NexusForms;