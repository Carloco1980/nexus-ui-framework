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

            const debug = global.NX?.config?.debug;

            if (debug?.enabled && debug.logEvents) {
                console.info(`[Nexus event] ${event}`, detail);
            }

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
