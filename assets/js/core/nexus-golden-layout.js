/*
==================================================
Nexus UI Framework

Module : Golden Layout
==================================================
*/

(function (global) {

    "use strict";

    const semanticConfidenceThreshold = 0.5;

    function clamp(value, minimum, maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    function getReadingOrder(first, second) {

        return first.row - second.row
            || first.column - second.column
            || String(first.id).localeCompare(String(second.id));

    }

    function makeUnits(cards, groups, preserveSemanticGroups) {

        const parent = new Map(cards.map((card) => [card.id, card.id]));
        const originalOrder = new Map(cards.map((card, index) => [card.id, index]));

        function find(id) {

            let root = id;

            while (parent.get(root) !== root) {
                root = parent.get(root);
            }

            while (parent.get(id) !== id) {
                const next = parent.get(id);
                parent.set(id, root);
                id = next;
            }

            return root;

        }

        if (preserveSemanticGroups) {
            groups.forEach((group) => {

                if ((Number(group.confidence) || 0) < semanticConfidenceThreshold) {
                    return;
                }

                const memberIds = group.cards.filter((id) => parent.has(id));

                for (let index = 1; index < memberIds.length; index += 1) {
                    const firstRoot = find(memberIds[0]);
                    const nextRoot = find(memberIds[index]);
                    if (firstRoot !== nextRoot) parent.set(nextRoot, firstRoot);
                }

            });
        }

        const unitsByRoot = new Map();

        cards.forEach((card) => {
            const root = preserveSemanticGroups ? find(card.id) : card.id;
            const members = unitsByRoot.get(root) || [];
            members.push(card);
            unitsByRoot.set(root, members);
        });

        return Array.from(unitsByRoot.values(), (members) => ({
            cards: members.sort(getReadingOrder),
            priority: Math.max(...members.map((card) => clamp(Number(card.priority) || 0, 0, 1))),
            firstOrder: Math.min(...members.map((card) => originalOrder.get(card.id)))
        })).sort((first, second) =>
            second.priority - first.priority || first.firstOrder - second.firstOrder
        );

    }

    function findPosition(occupied, columns, startIndex, colSpan, rowSpan) {

        let row = Math.floor(startIndex / columns);
        let column = startIndex % columns;

        while (true) {

            for (let candidateColumn = column; candidateColumn + colSpan <= columns; candidateColumn += 1) {

                let fits = true;

                for (let rowOffset = 0; rowOffset < rowSpan && fits; rowOffset += 1) {
                    for (let columnOffset = 0; columnOffset < colSpan; columnOffset += 1) {
                        if (occupied.has(`${row + rowOffset}:${candidateColumn + columnOffset}`)) {
                            fits = false;
                            break;
                        }
                    }
                }

                if (fits) {
                    return { row, column: candidateColumn };
                }

            }

            row += 1;
            column = 0;

        }

    }

    function balanceSpans(cards, device, typesById) {

        const balanceRows = device !== "mobile";

        return cards.map((card) => ({
            ...card,
            colSpan: typesById.get(card.id) === "chart" ? 1 : card.colSpan,
            rowSpan: balanceRows ? 1 : card.rowSpan
        }));

    }

    function reflow(proposal) {

        const columns = Math.floor(Number(proposal.columns));

        if (!Number.isFinite(columns) || columns < 1 || !Array.isArray(proposal.cards)) {
            return proposal;
        }

        const classifications = (global.Nexus || global.NX)?.cardClassifier?.classify?.() || [];
        const typesById = new Map(classifications.map((card, index) => [index + 1, card.type]));
        const normalizedCards = proposal.cards.map((card) => ({
            ...card,
            colSpan: clamp(Math.floor(Number(card.colSpan) || 1), 1, columns),
            rowSpan: Math.max(1, Math.floor(Number(card.rowSpan) || 1)),
            priority: clamp(Number(card.priority) || 0, 0, 1)
        }));
        const cards = balanceSpans(normalizedCards, proposal.device, typesById);
        const groups = Array.isArray(proposal.semanticGroups) ? proposal.semanticGroups : [];
        const units = makeUnits(cards, groups, Boolean(proposal.preserveSemanticGroups));
        const occupied = new Set();
        const placements = [];
        let cursor = 0;

        units.forEach((unit) => {
            unit.cards.forEach((card) => {

                const position = findPosition(
                    occupied,
                    columns,
                    cursor,
                    card.colSpan,
                    card.rowSpan
                );

                for (let rowOffset = 0; rowOffset < card.rowSpan; rowOffset += 1) {
                    for (let columnOffset = 0; columnOffset < card.colSpan; columnOffset += 1) {
                        occupied.add(`${position.row + rowOffset}:${position.column + columnOffset}`);
                    }
                }

                placements.push({
                    ...card,
                    row: position.row + 1,
                    column: position.column + 1
                });

                cursor = position.row * columns + position.column + card.colSpan;

            });
        });

        placements.sort(getReadingOrder);

        const rows = placements.reduce(
            (maximum, card) => Math.max(maximum, card.row + card.rowSpan - 1),
            0
        );

        return {
            ...proposal,
            columns,
            rows,
            cards: placements
        };

    }

    const goldenLayout = Object.freeze({

        optimize() {

            const solver = (global.Nexus || global.NX)?.placementSolver;

            if (typeof solver?.solve !== "function") {
                return { columns: 0, rows: 0, cards: [] };
            }

            return reflow(solver.solve());

        }

    });

    const nexus = global.NX || global.Nexus || {};
    global.NX = nexus;
    global.Nexus = nexus;
    nexus.goldenLayout = goldenLayout;

})(window);
