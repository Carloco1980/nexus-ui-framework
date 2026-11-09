/*
==================================================
Nexus UI Framework

Module : Layout Score
==================================================
*/

(function (global) {

    "use strict";

    const scoreWeights = Object.freeze({
        balance: 0.18,
        density: 0.16,
        semantic: 0.2,
        hierarchy: 0.18,
        spacing: 0.16,
        goldenRatio: 0.12
    });

    const goldenRatio = 1.61803398875;

    function clamp(value, minimum = 0, maximum = 1) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    function round(value) {
        return Number(clamp(value).toFixed(2));
    }

    function orderedCards(cards) {

        return [...cards].sort(
            (first, second) => first.row - second.row || first.column - second.column
        );

    }

    function buildGrid(layout) {

        const occupied = new Set();

        layout.cards.forEach((card) => {
            for (let row = card.row; row < card.row + card.rowSpan; row += 1) {
                for (let column = card.column; column < card.column + card.colSpan; column += 1) {
                    occupied.add(`${row}:${column}`);
                }
            }
        });

        return occupied;

    }

    function calculateContinuity(layout) {

        const cards = orderedCards(layout.cards);

        if (cards.length < 2) {
            return 1;
        }

        const gaps = [];

        for (let index = 1; index < cards.length; index += 1) {

            const previous = cards[index - 1];
            const current = cards[index];
            const previousEnd = (previous.row - 1) * layout.columns
                + previous.column - 1
                + previous.colSpan;
            const currentStart = (current.row - 1) * layout.columns + current.column - 1;
            const skippedCells = Math.max(0, currentStart - previousEnd);

            gaps.push(1 - clamp(skippedCells / layout.columns));

        }

        return gaps.reduce((total, gap) => total + gap, 0) / gaps.length;

    }

    function calculateDensity(layout, occupied) {

        const capacity = layout.columns * layout.rows;

        if (capacity <= 0) {
            return 0;
        }

        const occupancy = clamp(occupied.size / capacity);
        const targetOccupancy = 0.72;

        return 1 - clamp(Math.abs(occupancy - targetOccupancy) / Math.max(targetOccupancy, 1 - targetOccupancy));

    }

    function calculateEmptySpaceQuality(layout, occupied) {

        const capacity = layout.columns * layout.rows;

        if (capacity <= 0) {
            return 0;
        }

        const emptyRatio = 1 - clamp(occupied.size / capacity);
        const targetEmptyRatio = 0.22;

        return 1 - clamp(Math.abs(emptyRatio - targetEmptyRatio) / Math.max(targetEmptyRatio, 1 - targetEmptyRatio));

    }

    function calculateAlignment(cards) {

        if (cards.length < 2) {
            return 1;
        }

        const starts = new Map();
        const ends = new Map();

        cards.forEach((card) => {
            starts.set(card.column, (starts.get(card.column) || 0) + 1);
            const end = card.column + card.colSpan;
            ends.set(end, (ends.get(end) || 0) + 1);
        });

        const mostCommon = (counts) => Math.max(...counts.values()) / cards.length;

        return (mostCommon(starts) + mostCommon(ends)) / 2;

    }

    function calculateProximity(layout) {

        const groups = layout.preserveSemanticGroups ? layout.semanticGroups || [] : [];
        const cardsById = new Map(layout.cards.map((card) => [card.id, card]));
        const groupScores = [];

        groups.forEach((group) => {

            const members = group.cards
                .map((id) => cardsById.get(id))
                .filter(Boolean);

            if (members.length < 2) {
                return;
            }

            let distanceTotal = 0;
            let pairCount = 0;

            for (let first = 0; first < members.length; first += 1) {
                for (let second = first + 1; second < members.length; second += 1) {
                    const rowDistance = Math.max(
                        0,
                        members[first].row - (members[second].row + members[second].rowSpan - 1),
                        members[second].row - (members[first].row + members[first].rowSpan - 1)
                    );
                    const columnDistance = Math.max(
                        0,
                        members[first].column - (members[second].column + members[second].colSpan - 1),
                        members[second].column - (members[first].column + members[first].colSpan - 1)
                    );

                    distanceTotal += rowDistance + columnDistance;
                    pairCount += 1;
                }
            }

            const averageDistance = pairCount ? distanceTotal / pairCount : 0;
            const maximumDistance = Math.max(1, layout.columns + layout.rows - 2);
            groupScores.push(1 - clamp(averageDistance / maximumDistance));

        });

        return groupScores.length
            ? groupScores.reduce((total, value) => total + value, 0) / groupScores.length
            : 1;

    }

    function calculateSpacing(layout, occupied) {

        const continuity = calculateContinuity(layout);
        const alignment = calculateAlignment(layout.cards);
        const proximity = calculateProximity(layout);
        const emptySpace = calculateEmptySpaceQuality(layout, occupied);

        return continuity * 0.3 + alignment * 0.25 + proximity * 0.25 + emptySpace * 0.2;

    }

    function calculateSemantic(layout) {

        const groups = layout.preserveSemanticGroups ? layout.semanticGroups || [] : [];

        if (!groups.length) {
            return 1;
        }

        const cards = orderedCards(layout.cards);
        const groupScores = groups.map((group) => {

            const members = new Set(group.cards);
            const positions = cards
                .map((card, index) => members.has(card.id) ? index : -1)
                .filter((index) => index >= 0);

            if (positions.length < 2) {
                return 1;
            }

            const spanLength = Math.max(...positions) - Math.min(...positions) + 1;
            const continuity = positions.length / spanLength;
            const confidence = clamp(Number(group.confidence) || 0);

            return continuity * confidence + (1 - confidence);

        });

        return groupScores.reduce((total, score) => total + score, 0) / groupScores.length;

    }

    function calculateHierarchy(cards) {

        if (cards.length < 2) {
            return 1;
        }

        const ordered = orderedCards(cards);
        let pairs = 0;
        let preserved = 0;

        for (let first = 0; first < ordered.length; first += 1) {
            for (let second = first + 1; second < ordered.length; second += 1) {
                pairs += 1;
                if ((Number(ordered[first].priority) || 0) >= (Number(ordered[second].priority) || 0)) {
                    preserved += 1;
                }
            }
        }

        return pairs ? preserved / pairs : 1;

    }

    function coefficientOfVariation(values) {

        if (values.length < 2) {
            return 0;
        }

        const average = values.reduce((total, value) => total + value, 0) / values.length;

        if (average <= 0) {
            return 0;
        }

        const variance = values.reduce((total, value) => total + (value - average) ** 2, 0) / values.length;
        return Math.sqrt(variance) / average;

    }

    function calculateSymmetry(layout, occupied) {

        if (layout.columns <= 1 || layout.rows <= 0) {
            return 1;
        }

        let comparisons = 0;
        let matches = 0;

        for (let row = 1; row <= layout.rows; row += 1) {
            for (let column = 1; column <= Math.floor(layout.columns / 2); column += 1) {
                const mirrorColumn = layout.columns - column + 1;
                comparisons += 1;
                if (occupied.has(`${row}:${column}`) === occupied.has(`${row}:${mirrorColumn}`)) {
                    matches += 1;
                }
            }
        }

        return comparisons ? matches / comparisons : 1;

    }

    function calculateBalance(layout, occupied) {

        if (!layout.cards.length || !layout.rows || !layout.columns) {
            return 0;
        }

        const rowLoads = Array(layout.rows).fill(0);
        const columnLoads = Array(layout.columns).fill(0);

        occupied.forEach((cell) => {
            const [row, column] = cell.split(":").map(Number);
            rowLoads[row - 1] += 1;
            columnLoads[column - 1] += 1;
        });

        const rowBalance = 1 / (1 + coefficientOfVariation(rowLoads));
        const columnBalance = 1 / (1 + coefficientOfVariation(columnLoads));
        const symmetry = calculateSymmetry(layout, occupied);

        return rowBalance * 0.4 + columnBalance * 0.4 + symmetry * 0.2;

    }

    function calculateGoldenRatio(layout) {

        if (!layout.columns || !layout.rows) {
            return 0;
        }

        const target = layout.orientation === "portrait" ? 1 / goldenRatio : goldenRatio;
        const gridRatio = layout.columns / layout.rows;
        const gridFit = Math.exp(-Math.abs(Math.log(Math.max(gridRatio, 0.001) / target)));
        const spanRatios = layout.cards.map((card) => {
            const ratio = card.colSpan / card.rowSpan;
            return Math.exp(-Math.abs(Math.log(Math.max(ratio, 0.001) / goldenRatio)));
        });
        const cardFit = spanRatios.length
            ? spanRatios.reduce((total, fit) => total + fit, 0) / spanRatios.length
            : gridFit;

        return gridFit * 0.65 + cardFit * 0.35;

    }

    function calculateMetrics(layout) {

        if (!layout.cards.length) {
            return {
                balance: 0,
                density: 0,
                semantic: 0,
                hierarchy: 0,
                spacing: 0,
                goldenRatio: 0
            };
        }

        const occupied = buildGrid(layout);

        return {
            balance: calculateBalance(layout, occupied),
            density: calculateDensity(layout, occupied),
            semantic: calculateSemantic(layout),
            hierarchy: calculateHierarchy(layout.cards),
            spacing: calculateSpacing(layout, occupied),
            goldenRatio: calculateGoldenRatio(layout)
        };

    }

    function calculateScore(metrics, validation) {

        const weightedScore = Object.entries(scoreWeights).reduce(
            (total, [metric, weight]) => total + metrics[metric] * weight,
            0
        );
        const errorPenalty = Math.min(0.35, (validation.errors?.length || 0) * 0.1);
        const warningPenalty = Math.min(0.05, (validation.warnings?.length || 0) * 0.01);

        return round(weightedScore - errorPenalty - warningPenalty);

    }

    const layoutScore = Object.freeze({

        evaluate() {

            const validator = (global.Nexus || global.NX)?.layoutValidator;

            if (typeof validator?.validate !== "function") {
                const metrics = {
                    balance: 0,
                    density: 0,
                    semantic: 0,
                    hierarchy: 0,
                    spacing: 0,
                    goldenRatio: 0
                };

                return { score: 0, metrics };
            }

            const validation = validator.validate();
            const layout = validation?.normalizedLayout;

            if (!layout || !Array.isArray(layout.cards)) {
                const metrics = {
                    balance: 0,
                    density: 0,
                    semantic: 0,
                    hierarchy: 0,
                    spacing: 0,
                    goldenRatio: 0
                };

                return { score: 0, metrics };
            }

            const metrics = Object.fromEntries(
                Object.entries(calculateMetrics(layout)).map(([name, value]) => [name, round(value)])
            );

            return {
                score: calculateScore(metrics, validation),
                metrics
            };

        }

    });

    const nexus = global.NX || global.Nexus || {};
    global.NX = nexus;
    global.Nexus = nexus;
    nexus.layoutScore = layoutScore;

})(window);
