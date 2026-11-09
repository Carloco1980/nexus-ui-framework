/*
==================================================
Nexus UI Framework

Module : Layout Context
==================================================
*/

(function (global) {

    "use strict";

    const minimumColumnWidth = 320;
    const columnGap = 24;

    function finiteDimension(value) {
        const dimension = Number(value);
        return Number.isFinite(dimension) && dimension > 0 ? dimension : 0;
    }

    function getDevice(width, aspectRatio) {

        if (width >= 1600 && aspectRatio >= 1.9) {
            return "ultrawide";
        }

        if (width <= 767) {
            return "mobile";
        }

        if (width <= 1023) {
            return "tablet";
        }

        return "desktop";

    }

    function getDensity(cards, groups, container, maxColumns) {

        if (!cards.length || container.width <= 0 || container.height <= 0) {
            return 0;
        }

        const measuredCards = cards.filter((card) =>
            finiteDimension(card.width) > 0 && finiteDimension(card.height) > 0
        );

        if (!measuredCards.length) {
            return 0;
        }

        const cardArea = measuredCards.reduce(
            (total, card) => total + finiteDimension(card.width) * finiteDimension(card.height),
            0
        );
        const containerArea = container.width * container.height;
        const areaPressure = Math.min(1, cardArea / containerArea);
        const cardPressure = Math.min(1, measuredCards.length / (maxColumns * 3));
        const groupPressure = Math.min(1, groups.length / (maxColumns * 2));
        const density = areaPressure * 0.55 + cardPressure * 0.3 + groupPressure * 0.15;

        return Number(Math.max(0, Math.min(1, density)).toFixed(2));

    }

    const layoutContext = Object.freeze({

        get() {

            const nexus = global.Nexus || global.NX;
            const root = global.document?.documentElement;
            const frameworkContainer = global.document?.querySelector?.(".nx-dashboard")
                || global.document?.querySelector?.(".nx-container");
            const frameworkContainerWidth = finiteDimension(
                frameworkContainer?.getBoundingClientRect?.().width
            );
            const viewportWidth = finiteDimension(global.innerWidth) || finiteDimension(root?.clientWidth);
            const viewportHeight = finiteDimension(global.innerHeight) || finiteDimension(root?.clientHeight);
            const containerWidth = frameworkContainerWidth
                || finiteDimension(root?.clientWidth)
                || viewportWidth;
            const containerHeight = finiteDimension(root?.clientHeight) || viewportHeight;
            const aspectRatio = viewportHeight > 0 ? viewportWidth / viewportHeight : 1;
            const orientation = viewportWidth >= viewportHeight ? "landscape" : "portrait";
            const maxColumns = Math.max(
                1,
                Math.floor((containerWidth + columnGap) / (minimumColumnWidth + columnGap))
            );
            const cards = typeof nexus?.cardScanner?.scan === "function"
                ? nexus.cardScanner.scan()
                : [];
            const groups = typeof nexus?.semanticGroups?.detect === "function"
                ? nexus.semanticGroups.detect()
                : [];
            const container = {
                width: containerWidth,
                height: containerHeight,
                availableWidth: containerWidth,
                availableHeight: containerHeight
            };

            return {
                viewport: {
                    width: viewportWidth,
                    height: viewportHeight,
                    aspectRatio: Number(aspectRatio.toFixed(2))
                },
                container,
                device: getDevice(viewportWidth, aspectRatio),
                orientation,
                maxColumns,
                layoutDensity: getDensity(cards, groups, container, maxColumns)
            };

        }

    });

    const nexus = global.NX || global.Nexus || {};
    global.NX = nexus;
    global.Nexus = nexus;
    nexus.layoutContext = layoutContext;

})(window);
