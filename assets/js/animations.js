/*
==================================================
Nexus UI Framework

Version : 0.9.0 RC1
Author  : Carlos Santander Díaz
License : MIT

Copyright (c) 2026 Carlos Santander Díaz
==================================================
*/

"use strict";

/*==================================================
Animations Module
==================================================*/

const NexusAnimations = {

    init() {

        this.cacheDOM();

        if (!this.elements.length) {
            return;
        }

        this.createObserver();

    },

    /*--------------------------------------------------
    Cache DOM
    --------------------------------------------------*/

    cacheDOM() {

        this.elements = document.querySelectorAll("[data-nx-animation]");

    },

    /*--------------------------------------------------
    Observer
    --------------------------------------------------*/

    createObserver() {

        const options = {

            root: null,
            rootMargin: "0px",
            threshold: 0.20

        };

        this.observer = new IntersectionObserver(

            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        this.animate(entry.target);

                        this.observer.unobserve(entry.target);

                    }

                });

            },

            options

        );

        this.elements.forEach(element => {

            this.prepare(element);

            this.observer.observe(element);

        });

    },

    /*--------------------------------------------------
    Prepare
    --------------------------------------------------*/

    prepare(element) {

        element.style.opacity = "0";

        element.style.transition =
            "opacity .8s ease, transform .8s ease";

        switch (element.dataset.nxAnimation) {

            case "fade-up":

                element.style.transform =
                    "translateY(40px)";
                break;

            case "fade-down":

                element.style.transform =
                    "translateY(-40px)";
                break;

            case "fade-left":

                element.style.transform =
                    "translateX(-40px)";
                break;

            case "fade-right":

                element.style.transform =
                    "translateX(40px)";
                break;

            case "zoom":

                element.style.transform =
                    "scale(.90)";
                break;

            default:

                element.style.transform =
                    "translateY(30px)";

        }

    },

    /*--------------------------------------------------
    Animate
    --------------------------------------------------*/

    animate(element) {

        element.style.opacity = "1";

        element.style.transform =
            "translate(0,0) scale(1)";

    }

};

window.NexusAnimations = NexusAnimations;