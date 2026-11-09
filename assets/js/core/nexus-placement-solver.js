/*
==================================================
Nexus UI Framework

Module : Placement Solver
==================================================
*/

(function (global) {

    "use strict";

    const semanticConfidenceThreshold = 0.5;

    function clamp(value, minimum, maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    function getOrientation(device) {

        if (device === "mobile") return "portrait";
        if (device === "ultrawide") return "landscape";

        // Layout context currently does not expose the physical viewport orientation.
        return "landscape";

    }

    function getColumns(cardCount, policy, orientation) {

        const maximum = Math.max(1, Math.floor(Number(policy.maxColumns) || 1));

        if (cardCount <= 1) {
            return 1;
        }

        if (policy.device === "mobile") {
            return 1;
        }

        if (policy.device === "tablet") {
            return maximum;
        }

        if (!policy.adaptiveColumns || cardCount <= 1) {
            return maximum;
        }

        const targetRatio = clamp(Number(policy.targetRatio) || 1, 1, 2.4);
        let desired = Math.ceil(Math.sqrt(cardCount * targetRatio));

        if (orientation === "portrait" && desired > 1) {
            desired -= 1;
        }

        return clamp(desired, 1, maximum);

    }

    function getPriority(card, policy) {

        const totalWeight = clamp(Number(card.totalWeight) || 0, 0, 1);
        const importanceWeight = clamp(Number(card.importanceWeight) || 0, 0, 1);
        const readingTypes = ["profile", "project", "text"];
        const readingBoost = policy.readingPriority === "high" && readingTypes.includes(card.type)
            ? 0.08
            : 0;

        return clamp(totalWeight * 0.7 + importanceWeight * 0.3 + readingBoost, 0, 1);

    }

    function makeUnits(cards, groups, preserveSemanticGroups) {

        const cardById = new Map(cards.map((card) => [card.id, card]));
        const parent = new Map(cards.map((card) => [card.id, card.id]));

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

        function join(first, second) {

            const firstRoot = find(first);
            const secondRoot = find(second);

            if (firstRoot !== secondRoot) {
                parent.set(secondRoot, firstRoot);
            }

        }

        if (preserveSemanticGroups) {
            groups.forEach((group) => {

                const confidence = clamp(Number(group.confidence) || 0, 0, 1);
                const memberIds = group.cards.filter((id) =>
                    confidence >= semanticConfidenceThreshold && cardById.has(id)
                );

                for (let index = 1; index < memberIds.length; index += 1) {
                    join(memberIds[0], memberIds[index]);
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

        return Array.from(unitsByRoot.values(), (members) => {
            const projectGroup = preserveSemanticGroups && groups.find((group) =>
                group.group === "project-detail"
                && clamp(Number(group.confidence) || 0, 0, 1) >= semanticConfidenceThreshold
                && members.some((card) => group.cards.includes(card.id))
            );
            const projectOrder = new Map((projectGroup?.cards || []).map((id, index) => [id, index]));
            const projectDetail = Boolean(projectGroup);

            return {
                cards: members.sort((first, second) => projectDetail
                    ? (projectOrder.get(first.id) ?? Number.MAX_SAFE_INTEGER)
                        - (projectOrder.get(second.id) ?? Number.MAX_SAFE_INTEGER)
                        || first.id - second.id
                    : first.id - second.id),
                priority: Math.max(...members.map((card) => card.priority)),
                projectDetail
            };
        }).sort((first, second) => Number(second.projectDetail) - Number(first.projectDetail)
            || second.priority - first.priority);

    }

    function getSpans(card, columns, policy, orientation, isProjectDetail) {

        if (isProjectDetail) {
            return { colSpan: 1, rowSpan: 1 };
        }

        let colSpan = 1;
        let rowSpan = 1;
        const visualWeight = clamp(Number(card.totalWeight) || 0, 0, 1);
        const textWeight = clamp(Number(card.textWeight) || 0, 0, 1);

        if (
            policy.adaptiveColumns
            && policy.useGoldenRatio
            && columns > 1
            && visualWeight >= 0.78
        ) {
            colSpan = Math.min(2, columns);
        }

        if (
            policy.adaptiveColumns
            && policy.readingPriority === "high"
            && columns > 1
            && orientation === "landscape"
            && textWeight >= 0.72
        ) {
            rowSpan = 2;
        }

        return { colSpan, rowSpan };

    }

    function findPosition(occupied, columns, startIndex, colSpan, rowSpan) {

        let row = Math.floor(startIndex / columns);
        let column = startIndex % columns;

        while (row < 10000) {

            for (let candidateColumn = column; candidateColumn < columns; candidateColumn += 1) {

                if (candidateColumn + colSpan > columns) {
                    continue;
                }

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

        return { row: 0, column: 0 };

    }

    function placeCards(cards, groups, policy, orientation, columns) {

        const units = makeUnits(cards, groups, Boolean(policy.preserveSemanticGroups));
        const projectDetailIds = new Set(groups
            .filter((group) => group.group === "project-detail"
                && clamp(Number(group.confidence) || 0, 0, 1) >= semanticConfidenceThreshold)
            .flatMap((group) => group.cards));
        const occupied = new Set();
        const placements = [];
        let cursor = 0;

        units.forEach((unit) => {
            unit.cards.forEach((card) => {

                const { colSpan, rowSpan } = getSpans(
                    card,
                    columns,
                    policy,
                    orientation,
                    projectDetailIds.has(card.id)
                );
                const position = findPosition(occupied, columns, cursor, colSpan, rowSpan);

                for (let rowOffset = 0; rowOffset < rowSpan; rowOffset += 1) {
                    for (let columnOffset = 0; columnOffset < colSpan; columnOffset += 1) {
                        occupied.add(`${position.row + rowOffset}:${position.column + columnOffset}`);
                    }
                }

                placements.push({
                    id: card.id,
                    column: position.column + 1,
                    row: position.row + 1,
                    colSpan,
                    rowSpan,
                    priority: Number(card.priority.toFixed(2))
                });

                cursor = position.row * columns + position.column + colSpan;

            });

            if (unit.projectDetail) {
                const lastRow = placements.reduce((maximum, placement) =>
                    Math.max(maximum, placement.row + placement.rowSpan - 1), 0);
                cursor = Math.max(cursor, lastRow * columns);
            }
        });

        placements.sort((first, second) => first.row - second.row || first.column - second.column);

        const rows = placements.reduce(
            (maximum, card) => Math.max(maximum, card.row + card.rowSpan - 1),
            0
        );

        return { rows, cards: placements };

    }

    const placementSolver = Object.freeze({

        solve() {

            const nexus = global.Nexus || global.NX;
            const visualWeight = nexus?.visualWeight;
            const semanticGroups = nexus?.semanticGroups;
            const compositionPolicy = nexus?.compositionPolicy;

            if (
                typeof visualWeight?.calculate !== "function"
                || typeof semanticGroups?.detect !== "function"
                || typeof compositionPolicy?.get !== "function"
            ) {
                return { columns: 0, rows: 0, cards: [] };
            }

            const policy = compositionPolicy.get();
            const cards = visualWeight.calculate().map((card) => ({
                ...card,
                priority: getPriority(card, policy)
            }));
            const groups = semanticGroups.detect();
            const device = policy.device || "desktop";
            const orientation = getOrientation(device);
            const columns = getColumns(cards.length, policy, orientation);
            const placement = placeCards(cards, groups, policy, orientation, columns);

            return {
                columns,
                rows: placement.rows,
                cards: placement.cards,
                device,
                orientation,
                preserveSemanticGroups: Boolean(policy.preserveSemanticGroups),
                semanticGroups: groups.map((group) => ({
                    group: group.group,
                    cards: [...group.cards],
                    confidence: clamp(Number(group.confidence) || 0, 0, 1)
                }))
            };

        }

    });

    const nexus = global.NX || global.Nexus || {};
    global.NX = nexus;
    global.Nexus = nexus;
    nexus.placementSolver = placementSolver;

})(window);
