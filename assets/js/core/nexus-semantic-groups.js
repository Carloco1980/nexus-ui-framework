/*
==================================================
Nexus UI Framework

Module : Semantic Groups
==================================================
*/

(function (global) {

    "use strict";

    const rules = [
        {
            group: "project-detail",
            types: ["profile", "project", "text"],
            required: ["profile", "project", "text"],
            confidence: 0.97
        },
        {
            group: "analytics",
            types: ["chart", "kpi"],
            required: ["chart", "kpi"],
            confidence: 0.95
        },
        {
            group: "media-section",
            types: ["media", "text"],
            required: ["media", "text"],
            confidence: 0.92
        },
        {
            group: "statistics",
            types: ["chart", "table"],
            required: ["chart", "table"],
            confidence: 0.97
        }
    ];

    function getBounds(card) {

        const position = card?.position;
        const width = Number(card?.width);
        const height = Number(card?.height);
        const left = Number(position?.left ?? position?.x);
        const top = Number(position?.top ?? position?.y);
        const right = Number(position?.right ?? (left + width));
        const bottom = Number(position?.bottom ?? (top + height));

        if (![left, top, right, bottom, width, height].every(Number.isFinite)) {
            return null;
        }

        if (width <= 0 || height <= 0) {
            return null;
        }

        return { left, top, right, bottom, width, height };

    }

    function getGap(first, second) {

        const horizontal = Math.max(
            0,
            first.left - second.right,
            second.left - first.right
        );
        const vertical = Math.max(
            0,
            first.top - second.bottom,
            second.top - first.bottom
        );

        return Math.hypot(horizontal, vertical);

    }

    function getProximityLimit(first, second) {

        const largestDimension = Math.max(
            first.width,
            first.height,
            second.width,
            second.height
        );

        return Math.max(280, Math.min(720, largestDimension * 1.25));

    }

    function areNeighbors(first, second) {

        const gap = getGap(first.bounds, second.bounds);
        const limit = getProximityLimit(first.bounds, second.bounds);

        return gap <= limit;

    }

    function getComponents(cards) {

        const visited = new Set();
        const components = [];

        cards.forEach((start) => {

            if (visited.has(start.index)) {
                return;
            }

            const component = [];
            const pending = [start];
            visited.add(start.index);

            while (pending.length) {

                const current = pending.pop();
                component.push(current);

                cards.forEach((candidate) => {

                    if (visited.has(candidate.index) || !areNeighbors(current, candidate)) {
                        return;
                    }

                    visited.add(candidate.index);
                    pending.push(candidate);

                });

            }

            components.push(component);

        });

        return components;

    }

    function getGroupConfidence(rule, cards) {

        const classifierConfidence = cards.reduce(
            (total, card) => total + Math.max(0, Math.min(1, Number(card.confidence) || 0)),
            0
        ) / cards.length;

        const proximity = cards.reduce((total, card) => {

            const nearestProximity = Math.max(...cards
                .filter((other) => other.index !== card.index)
                .map((other) => {
                    const gap = getGap(card.bounds, other.bounds);
                    const limit = getProximityLimit(card.bounds, other.bounds);
                    return Math.max(0, 1 - gap / limit);
                }));

            return total + nearestProximity;

        }, 0) / cards.length;

        const confidence = rule.confidence * 0.8
            + classifierConfidence * proximity * 0.2;

        return Number(Math.max(0, Math.min(1, confidence)).toFixed(2));

    }

    const semanticGroups = Object.freeze({

        detect() {

            const nexus = global.Nexus || global.NX;
            const scanner = nexus?.cardScanner;
            const classifier = nexus?.cardClassifier;

            if (typeof scanner?.scan !== "function" || typeof classifier?.classify !== "function") {
                return [];
            }

            const scannedCards = scanner.scan();
            const classifiedCards = classifier.classify();
            const count = Math.min(scannedCards.length, classifiedCards.length);
            const cards = [];

            for (let index = 0; index < count; index += 1) {

                const bounds = getBounds(scannedCards[index]);

                if (!bounds) {
                    continue;
                }

                cards.push({
                    index,
                    type: classifiedCards[index].type,
                    confidence: classifiedCards[index].confidence,
                    bounds
                });

            }

            const groups = [];

            rules.forEach((rule) => {

                const candidates = cards.filter((card) => rule.types.includes(card.type));

                getComponents(candidates).forEach((component) => {

                    const presentTypes = new Set(component.map((card) => card.type));
                    const matches = rule.required.every((type) => presentTypes.has(type));

                    if (!matches) {
                        return;
                    }

                    groups.push({
                        group: rule.group,
                        cards: component
                            .map((card) => card.index + 1)
                            .sort((first, second) => first - second),
                        confidence: getGroupConfidence(rule, component)
                    });

                });

            });

            return groups;

        }

    });

    const nexus = global.NX || global.Nexus || {};
    global.NX = nexus;
    global.Nexus = nexus;
    nexus.semanticGroups = semanticGroups;

})(window);
