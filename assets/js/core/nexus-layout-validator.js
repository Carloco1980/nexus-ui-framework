/*
==================================================
Nexus UI Framework

Module : Layout Validator
==================================================
*/

(function (global) {

    "use strict";

    function clamp(value, minimum, maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    function isPositiveInteger(value) {
        return Number.isInteger(value) && value > 0;
    }

    function getSafeColumns(value) {
        const columns = Math.floor(Number(value));
        return Number.isFinite(columns) && columns > 0 ? columns : 1;
    }

    function normalizeProposal(proposal) {

        const source = proposal && typeof proposal === "object" ? proposal : {};
        const columns = getSafeColumns(source.columns);
        const cards = Array.isArray(source.cards) ? source.cards : [];

        return {
            ...source,
            columns,
            rows: Number.isInteger(source.rows) && source.rows >= 0 ? source.rows : 0,
            cards: cards.map((card, index) => {

                const item = card && typeof card === "object" ? card : {};
                const column = isPositiveInteger(item.column) ? item.column : 1;
                const colSpan = isPositiveInteger(item.colSpan)
                    ? Math.min(item.colSpan, columns - column + 1)
                    : 1;

                return {
                    ...item,
                    id: item.id ?? index + 1,
                    column: clamp(column, 1, columns),
                    row: isPositiveInteger(item.row) ? item.row : 1,
                    colSpan: Math.max(1, colSpan),
                    rowSpan: isPositiveInteger(item.rowSpan) ? item.rowSpan : 1,
                    priority: clamp(Number(item.priority) || 0, 0, 1)
                };

            }),
            semanticGroups: Array.isArray(source.semanticGroups)
                ? source.semanticGroups
                : [],
            preserveSemanticGroups: Boolean(source.preserveSemanticGroups)
        };

    }

    function inspectLayout(layout) {

        const issues = [];
        const occupied = new Map();
        const idSet = new Set();
        const maxRowByColumn = new Map();
        let maxRow = 0;
        let occupiedCellCount = 0;

        if (!isPositiveInteger(layout.columns)) {
            issues.push({ code: "invalid-columns", message: "El número de columnas no es válido." });
        }

        if (!Number.isInteger(layout.rows) || layout.rows < 0) {
            issues.push({ code: "invalid-rows", message: "El número declarado de filas no es válido." });
        }

        layout.cards.forEach((card, index) => {

            if (idSet.has(card.id)) {
                issues.push({
                    code: "duplicate-card-id",
                    message: `La tarjeta en la posición ${index + 1} repite un ID.`
                });
            }
            idSet.add(card.id);

            if (!isPositiveInteger(card.colSpan) || !isPositiveInteger(card.rowSpan)) {
                issues.push({
                    code: "invalid-span",
                    message: `La tarjeta ${String(card.id)} tiene spans inválidos.`
                });
            }

            if (!isPositiveInteger(card.column) || card.column + card.colSpan - 1 > layout.columns) {
                issues.push({
                    code: "column-out-of-range",
                    message: `La tarjeta ${String(card.id)} queda fuera del rango de columnas.`
                });
            }

            if (!isPositiveInteger(card.row)) {
                issues.push({
                    code: "invalid-row-position",
                    message: `La tarjeta ${String(card.id)} no tiene una fila válida.`
                });
            }

            if (!Number.isFinite(card.priority) || card.priority < 0 || card.priority > 1) {
                issues.push({
                    code: "invalid-priority",
                    message: `La prioridad de la tarjeta ${String(card.id)} está fuera del rango 0–1.`
                });
            }

            const lastRow = card.row + card.rowSpan - 1;
            maxRow = Math.max(maxRow, lastRow);

            for (let row = card.row; row <= lastRow; row += 1) {
                for (let column = card.column; column < card.column + card.colSpan; column += 1) {

                    const cell = `${row}:${column}`;

                    if (occupied.has(cell)) {
                        issues.push({
                            code: "overlap",
                            message: `La tarjeta ${String(card.id)} se solapa con otra tarjeta.`
                        });
                    } else {
                        occupied.set(cell, card.id);
                        occupiedCellCount += 1;
                    }

                    maxRowByColumn.set(row, Math.max(maxRowByColumn.get(row) || 0, column));

                }
            }

        });

        if (layout.cards.length && layout.rows < maxRow) {
            issues.push({
                code: "rows-missing",
                message: "La propuesta no declara todas las filas utilizadas por sus tarjetas."
            });
        } else if (layout.rows > maxRow) {
            issues.push({
                code: "unused-rows",
                message: "La propuesta declara filas vacías al final del layout."
            });
        }

        const capacity = layout.columns * Math.max(layout.rows, maxRow);

        if (layout.cards.length > capacity || occupiedCellCount > capacity) {
            issues.push({
                code: "over-occupation",
                message: "La ocupación supera la capacidad declarada de la grilla."
            });
        }

        for (let row = 1; row <= maxRow; row += 1) {

            const lastColumn = maxRowByColumn.get(row) || 0;

            for (let column = 1; column <= lastColumn; column += 1) {
                if (!occupied.has(`${row}:${column}`)) {
                    issues.push({
                        code: "unnecessary-gap",
                        message: `Hay un hueco en la fila ${row}, columna ${column}.`
                    });
                    break;
                }
            }

        }

        if (layout.preserveSemanticGroups) {

            const orderedCards = [...layout.cards].sort(
                (first, second) => first.row - second.row || first.column - second.column
            );

            layout.semanticGroups.forEach((group) => {

                const memberIds = new Set(group.cards);
                const positions = orderedCards
                    .map((card, index) => memberIds.has(card.id) ? index : -1)
                    .filter((index) => index >= 0);

                if (positions.length < 2) {
                    return;
                }

                const first = Math.min(...positions);
                const last = Math.max(...positions);

                if (last - first + 1 !== positions.length) {
                    issues.push({
                        code: "semantic-group-separated",
                        message: `El grupo semántico "${String(group.group)}" está separado por otras tarjetas.`
                    });
                }

            });

        }

        return issues;

    }

    function packCards(layout) {

        const columns = layout.columns;
        const parent = new Map(layout.cards.map((card) => [card.id, card.id]));

        function find(id) {
            let root = id;
            while (parent.get(root) !== root) root = parent.get(root);
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
            if (firstRoot !== secondRoot) parent.set(secondRoot, firstRoot);
        }

        if (layout.preserveSemanticGroups) {
            layout.semanticGroups.forEach((group) => {
                const memberIds = group.cards.filter((id) => parent.has(id));
                for (let index = 1; index < memberIds.length; index += 1) {
                    join(memberIds[0], memberIds[index]);
                }
            });
        }

        const unitsByRoot = new Map();
        layout.cards.forEach((card, index) => {
            card._sourceOrder = index;
            const root = layout.preserveSemanticGroups ? find(card.id) : card.id;
            const members = unitsByRoot.get(root) || [];
            members.push(card);
            unitsByRoot.set(root, members);
        });

        const units = Array.from(unitsByRoot.values(), (cards) => ({
            cards: cards.sort((first, second) =>
                first.row - second.row || first.column - second.column || first._sourceOrder - second._sourceOrder
            ),
            firstRow: Math.min(...cards.map((card) => card.row)),
            firstColumn: Math.min(...cards.map((card) => card.column)),
            firstSourceOrder: Math.min(...cards.map((card) => card._sourceOrder))
        })).sort((first, second) =>
            first.firstRow - second.firstRow
            || first.firstColumn - second.firstColumn
            || first.firstSourceOrder - second.firstSourceOrder
        );

        const occupied = new Set();
        const placements = [];
        let cursor = 0;

        units.forEach((unit) => {
            unit.cards.forEach((card) => {

                const colSpan = clamp(card.colSpan, 1, columns);
                const rowSpan = Math.max(1, card.rowSpan);
                let row = Math.floor(cursor / columns);
                let column = cursor % columns;
                let position = null;

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

                placements.push({
                    id: card.id,
                    column: position.column + 1,
                    row: position.row + 1,
                    colSpan,
                    rowSpan,
                    priority: card.priority
                });

                cursor = position.row * columns + position.column + colSpan;

            });
        });

        placements.sort((first, second) => first.row - second.row || first.column - second.column);

        const rows = placements.reduce(
            (maximum, card) => Math.max(maximum, card.row + card.rowSpan - 1),
            0
        );

        return { ...layout, rows, cards: placements };

    }

    function validateProposal(proposal) {

        if (!proposal || typeof proposal !== "object" || !Array.isArray(proposal.cards)) {
            return {
                valid: false,
                warnings: [],
                errors: [{
                    code: "invalid-proposal",
                    message: "El placement solver no devolvió una propuesta válida."
                }],
                normalizedLayout: { columns: 1, rows: 0, cards: [] }
            };
        }

        const normalized = normalizeProposal(proposal);
        const detectedIssues = inspectLayout(proposal);
        const recovered = detectedIssues.length > 0;
        const candidate = recovered ? packCards(normalized) : normalized;
        const remainingIssues = inspectLayout(candidate);
        const remainingCodes = new Set(remainingIssues.map((issue) => issue.code));
        const warnings = detectedIssues
            .filter((issue) => !remainingCodes.has(issue.code))
            .map((issue) => ({ ...issue, recovered: true }));

        if (recovered && !warnings.length) {
            warnings.push({
                code: "layout-normalized",
                message: "La propuesta se reempaquetó para eliminar inconsistencias.",
                recovered: true
            });
        }

        return {
            valid: remainingIssues.length === 0,
            warnings,
            errors: remainingIssues,
            normalizedLayout: candidate
        };

    }

    const layoutValidator = Object.freeze({

        validate() {

            const solver = (global.Nexus || global.NX)?.placementSolver;

            if (typeof solver?.solve !== "function") {
                return {
                    valid: false,
                    warnings: [],
                    errors: [{
                        code: "solver-unavailable",
                        message: "Nexus.placementSolver.solve() no está disponible."
                    }],
                    normalizedLayout: { columns: 1, rows: 0, cards: [] }
                };
            }

            try {
                return validateProposal(solver.solve());
            } catch (error) {
                return {
                    valid: false,
                    warnings: [],
                    errors: [{
                        code: "solver-error",
                        message: "No se pudo validar la propuesta del placement solver.",
                        detail: error instanceof Error ? error.message : String(error)
                    }],
                    normalizedLayout: { columns: 1, rows: 0, cards: [] }
                };
            }

        }

    });

    const nexus = global.NX || global.Nexus || {};
    global.NX = nexus;
    global.Nexus = nexus;
    nexus.layoutValidator = layoutValidator;

})(window);
