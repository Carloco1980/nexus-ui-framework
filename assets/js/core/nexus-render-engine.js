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

    function getTrackCount(container, fallback, itemCount) {

        const tracks = global.getComputedStyle(container).gridTemplateColumns;
        const count = tracks && tracks !== "none"
            ? tracks.trim().split(/\s+(?![^()]*\))/).filter(Boolean).length
            : 0;

        return Math.max(1, Math.min(itemCount, count || fallback));

    }

    function reflowGroup(items, columns) {

        const occupied = new Set();
        const ordered = [...items].sort((first, second) => {
            const position = first.card.compareDocumentPosition(second.card);
            if (position & global.Node.DOCUMENT_POSITION_FOLLOWING) return -1;
            if (position & global.Node.DOCUMENT_POSITION_PRECEDING) return 1;
            return first.row - second.row || first.column - second.column;
        });
        let cursor = 0;

        return ordered.map((item) => {
            const colSpan = Math.min(columns, item.colSpan);
            const rowSpan = item.rowSpan;
            let row = Math.floor(cursor / columns);
            let column = cursor % columns;
            let position;

            while (!position) {
                for (let candidate = column; candidate + colSpan <= columns; candidate += 1) {
                    let fits = true;
                    for (let rowOffset = 0; rowOffset < rowSpan && fits; rowOffset += 1) {
                        for (let columnOffset = 0; columnOffset < colSpan; columnOffset += 1) {
                            if (occupied.has(`${row + rowOffset}:${candidate + columnOffset}`)) {
                                fits = false;
                                break;
                            }
                        }
                    }
                    if (fits) {
                        position = { row, column: candidate };
                        break;
                    }
                }
                if (!position) {
                    row += 1;
                    column = 0;
                }
            }

            for (let rowOffset = 0; rowOffset < rowSpan; rowOffset += 1) {
                for (let columnOffset = 0; columnOffset < colSpan; columnOffset += 1) {
                    occupied.add(`${position.row + rowOffset}:${position.column + columnOffset}`);
                }
            }
            cursor = position.row * columns + position.column + colSpan;
            return { ...item, column: position.column + 1, row: position.row + 1, colSpan };
        });

    }

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
                ? {
                    container,
                    items: reflowGroup(items, getTrackCount(container, columns, items.length)),
                    columns: getTrackCount(container, columns, items.length),
                    cardSet
                }
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
            layoutGroups.forEach(({ container, items, columns: groupColumns }) => {

                container.style.setProperty("display", "grid");
                container.style.setProperty(
                    "grid-template-columns",
                    `repeat(${groupColumns}, minmax(0, 1fr))`
                );

                items.forEach(({ card, column, row, colSpan, rowSpan }) => {
                    card.style.setProperty("grid-column", String(column));
                    card.style.setProperty("grid-row", String(row));
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
