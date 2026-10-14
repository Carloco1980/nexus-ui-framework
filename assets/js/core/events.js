/*
==================================================
Nexus Events
==================================================
*/

(function (global) {

    "use strict";

    const Events = {

        on(event, callback) {

            document.addEventListener(

                event,

                callback

            );

        },

        off(event, callback) {

            document.removeEventListener(

                event,

                callback

            );

        },

        emit(event, detail = {}) {

            document.dispatchEvent(

                new CustomEvent(

                    event,

                    {

                        detail

                    }

                )

            );

        }

    };

    global.NX = global.NX || {};

    global.NX.events = Events;

})(window);