/*
==================================================
Nexus UI Framework

Module : Render Engine Preview
==================================================
*/

(function (global) {

    "use strict";

    const containerProperties = ["display", "grid-template-columns"];
    const cardProperties = [
        "grid-column",
        "grid-row",
        "grid-column-start",
        "grid-row-start",
        "grid-column-end",
        "grid-row-end"
    ];
    let snapshots = [];
    let previewActive = false;

    function captureProperties(element, properties) {

        const present = new Set(Array.from(
            { length: element.style.length },
            (_, index) => element.style.item(index)
        ));

        return {
            element,
            properties: properties.map((property) => ({
                property,
                present: present.has(property),
                value: element.style.getPropertyValue(property),
                priority: element.style.getPropertyPriority(property)
            }))
        };

    }

    function restoreSnapshots() {

        snapshots.forEach((snapshot) => {

            snapshot.properties.forEach(({ property, present, value, priority }) => {
                if (present) {
                    snapshot.element.style.setProperty(property, value, priority);
                } else {
                    snapshot.element.style.removeProperty(property);
                }
            });

        });

        snapshots = [];
        previewActive = false;

    }

    function preview() {

        if (previewActive) {
            restoreSnapshots();
        }

        const nexus = global.Nexus || global.NX;
        const goldenLayout = nexus?.goldenLayout;
        const cardScanner = nexus?.cardScanner;

        if (
            typeof goldenLayout?.optimize !== "function"
            || typeof cardScanner?.scan !== "function"
        ) {
            return false;
        }

        let proposal;
        let scannedCards;

        try {
            proposal = goldenLayout.optimize();
            scannedCards = cardScanner.scan();
        } catch (_) {
            return false;
        }

        const columns = Math.floor(Number(proposal?.columns));
        const placements = proposal?.cards;

        if (!Number.isFinite(columns) || columns < 1 || !Array.isArray(placements) || !placements.length) {
            return false;
        }

        if (!Array.isArray(scannedCards)) {
            return false;
        }

        const positionedCardElements = new Set();
        const positionedCards = placements.map((placement) => {

            const id = Number(placement?.id);
            const card = Number.isInteger(id) && id > 0
                ? scannedCards[id - 1]?.element
                : null;
            const column = Math.floor(Number(placement.column));
            const row = Math.floor(Number(placement.row));
            const colSpan = Math.floor(Number(placement.colSpan));
            const rowSpan = Math.floor(Number(placement.rowSpan));

            if (
                !card
                || positionedCardElements.has(card)
                || !Number.isFinite(column)
                || !Number.isFinite(row)
                || !Number.isFinite(colSpan)
                || !Number.isFinite(rowSpan)
                || column < 1
                || row < 1
                || colSpan < 1
                || rowSpan < 1
                || column + colSpan - 1 > columns
            ) {
                return null;
            }

            positionedCardElements.add(card);
            return { card, column, row, colSpan, rowSpan };

        });

        const validPositionedCards = positionedCards.filter(Boolean);

        if (!validPositionedCards.length) {
            return false;
        }

        const groupsByContainer = new Map();

        validPositionedCards.forEach((item) => {

            const container = item.card.parentElement;
            if (!container) return;

            const group = groupsByContainer.get(container) || [];
            group.push(item);
            groupsByContainer.set(container, group);

        });

        const layoutGroups = Array.from(groupsByContainer, ([container, items]) => {

            const cardSet = new Set(items.map((item) => item.card));
            const containsOnlyCards = container.children.length === cardSet.size
                && Array.from(container.children).every((child) => cardSet.has(child));

            return containsOnlyCards && items.length > 1
                ? { container, items, cardSet }
                : null;

        }).filter(Boolean);

        if (!layoutGroups.length) {
            return false;
        }

        snapshots = [];
        layoutGroups.forEach(({ container, items }) => {
            snapshots.push(captureProperties(container, containerProperties));
            items.forEach(({ card }) => {
                snapshots.push(captureProperties(card, cardProperties));
            });
        });

        try {
            layoutGroups.forEach(({ container, items }) => {

                const rowOffset = Math.min(...items.map((item) => item.row)) - 1;
                container.style.setProperty("display", "grid");
                container.style.setProperty(
                    "grid-template-columns",
                    `repeat(${columns}, minmax(0, 1fr))`
                );

                items.forEach(({ card, column, row, colSpan, rowSpan }) => {
                    card.style.setProperty("grid-column", String(column));
                    card.style.setProperty("grid-row", String(row - rowOffset));
                    card.style.setProperty("grid-column-end", `span ${colSpan}`);
                    card.style.setProperty("grid-row-end", `span ${rowSpan}`);
                });

            });

            previewActive = true;
            return true;

        } catch (_) {
            restoreSnapshots();
            return false;
        }

    }

    function reset() {

        if (!previewActive) {
            return false;
        }

        restoreSnapshots();
        return true;

    }

    const renderEngine = Object.freeze({ preview, reset });
    const nexus = global.NX || global.Nexus || {};
    global.NX = nexus;
    global.Nexus = nexus;
    nexus.renderEngine = renderEngine;

})(window);
