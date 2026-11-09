/*
==================================================
Nexus UI Framework

Module : Visual Weight
==================================================
*/

(function (global) {

    "use strict";

    const formulaWeights = Object.freeze({
        media: 0.18,
        text: 0.18,
        interaction: 0.12,
        semantic: 0.2,
        context: 0.14,
        importance: 0.18
    });

    const typeMediaPrior = Object.freeze({
        profile: 0.18,
        project: 0.14,
        text: 0.04,
        media: 0.84,
        analytics: 0.58,
        chart: 0.68,
        table: 0.36,
        gallery: 0.76,
        kpi: 0.24
    });

    const typeImportance = Object.freeze({
        profile: 0.7,
        project: 0.78,
        text: 0.66,
        media: 0.64,
        analytics: 0.88,
        chart: 0.84,
        table: 0.84,
        gallery: 0.6,
        kpi: 0.9
    });

    const groupImportance = Object.freeze({
        "project-detail": 0.95,
        analytics: 0.9,
        "media-section": 0.82,
        statistics: 0.9
    });

    const deviceAffinity = Object.freeze({
        mobile: Object.freeze({ text: 0.95, profile: 0.82, kpi: 0.82, media: 0.68 }),
        tablet: Object.freeze({ text: 0.82, profile: 0.78, kpi: 0.78, media: 0.74 }),
        desktop: Object.freeze({ analytics: 0.9, chart: 0.88, table: 0.86, project: 0.82 }),
        ultrawide: Object.freeze({ analytics: 0.95, chart: 0.93, table: 0.9, project: 0.84 })
    });

    function clamp(value, minimum = 0, maximum = 1) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    function round(value) {
        return Number(clamp(value).toFixed(2));
    }

    function calculateMediaWeight(card, type) {

        const signals = [
            card.hasImage ? 0.72 : 0,
            card.hasVideo ? 0.88 : 0,
            card.hasChart ? 0.66 : 0,
            card.hasTable ? 0.38 : 0
        ];
        const combinedSignal = 1 - signals.reduce(
            (remaining, signal) => remaining * (1 - signal),
            1
        );

        return clamp(Math.max(combinedSignal, typeMediaPrior[type] || 0));

    }

    function calculateTextWeight(card, policy) {

        const bodySignal = 1 - Math.exp(-Math.max(0, Number(card.textLength) || 0) / 360);
        const titleSignal = 1 - Math.exp(-Math.max(0, Number(card.titleLength) || 0) / 36);
        const bodyPriority = policy.readingPriority === "high" ? 0.8 : 0.7;

        return clamp(bodySignal * bodyPriority + titleSignal * (1 - bodyPriority));

    }

    function calculateInteractionWeight(card) {

        return clamp(
            (card.hasButtons ? 0.75 : 0)
            + (card.hasFooter ? 0.15 : 0)
            + (card.hasBadge ? 0.1 : 0)
        );

    }

    function calculateSemanticWeight(memberships) {

        const contributions = memberships.map((group) => {
            const relevance = groupImportance[group.group] || 0.7;
            const confidence = clamp(Number(group.confidence) || 0);
            return relevance * confidence;
        });

        return contributions.length ? clamp(Math.max(...contributions)) : 0;

    }

    function calculateContextWeight(card, type, layout, policy, semanticWeight) {

        const currentDensity = clamp(Number(layout.layoutDensity) || 0);
        const targetDensity = clamp(Number(policy.targetDensity) || 0);
        const densityFit = 1 - Math.abs(currentDensity - targetDensity);
        const device = policy.device || layout.device || "desktop";
        const affinity = deviceAffinity[device]?.[type] ?? 0.74;
        const compactFit = policy.compactMode
            ? (type === "kpi" || type === "text" ? 0.9 : 0.68)
            : 0.78;
        const groupFit = policy.preserveSemanticGroups && semanticWeight > 0 ? 1 : 0.72;
        const sizeFit = Number(card.width) > 0 && Number(card.height) > 0 ? 1 : 0.5;

        return clamp(
            densityFit * 0.4
            + affinity * 0.28
            + compactFit * 0.14
            + groupFit * 0.12
            + sizeFit * 0.06
        );

    }

    function calculateImportanceWeight(type, textWeight, interactionWeight, semanticWeight, policy) {

        const typePriority = typeImportance[type] || 0.6;
        const readingBoost = policy.readingPriority === "high"
            && ["profile", "project", "text"].includes(type)
            ? 0.08
            : 0;

        return clamp(
            typePriority * 0.58
            + semanticWeight * 0.2
            + interactionWeight * 0.1
            + textWeight * 0.12
            + readingBoost
        );

    }

    function calculateTotalWeight(weights) {

        return clamp(
            weights.mediaWeight * formulaWeights.media
            + weights.textWeight * formulaWeights.text
            + weights.interactionWeight * formulaWeights.interaction
            + weights.semanticWeight * formulaWeights.semantic
            + weights.contextWeight * formulaWeights.context
            + weights.importanceWeight * formulaWeights.importance
        );

    }

    const visualWeight = Object.freeze({

        calculate() {

            const nexus = global.Nexus || global.NX;
            const scanner = nexus?.cardScanner;
            const classifier = nexus?.cardClassifier;
            const semanticGroups = nexus?.semanticGroups;
            const layoutContext = nexus?.layoutContext;
            const compositionPolicy = nexus?.compositionPolicy;

            if (
                typeof scanner?.scan !== "function"
                || typeof classifier?.classify !== "function"
                || typeof semanticGroups?.detect !== "function"
                || typeof layoutContext?.get !== "function"
                || typeof compositionPolicy?.get !== "function"
            ) {
                return [];
            }

            const cards = scanner.scan();
            const classifications = classifier.classify();
            const groups = semanticGroups.detect();
            const layout = layoutContext.get();
            const policy = compositionPolicy.get();
            const memberships = new Map();

            groups.forEach((group) => {
                group.cards.forEach((cardId) => {
                    const cardGroups = memberships.get(cardId) || [];
                    cardGroups.push(group);
                    memberships.set(cardId, cardGroups);
                });
            });

            return Array.from({ length: cards.length }, (_, index) => {

                const card = cards[index];
                const type = classifications[index]?.type || "text";
                const cardId = index + 1;
                const groupsForCard = memberships.get(cardId) || [];
                const mediaWeight = calculateMediaWeight(card, type);
                const textWeight = calculateTextWeight(card, policy);
                const interactionWeight = calculateInteractionWeight(card);
                const semanticWeight = calculateSemanticWeight(groupsForCard);
                const contextWeight = calculateContextWeight(
                    card,
                    type,
                    layout,
                    policy,
                    semanticWeight
                );
                const importanceWeight = calculateImportanceWeight(
                    type,
                    textWeight,
                    interactionWeight,
                    semanticWeight,
                    policy
                );
                const weights = {
                    mediaWeight: round(mediaWeight),
                    textWeight: round(textWeight),
                    interactionWeight: round(interactionWeight),
                    semanticWeight: round(semanticWeight),
                    contextWeight: round(contextWeight),
                    importanceWeight: round(importanceWeight)
                };

                return {
                    id: cardId,
                    type,
                    ...weights,
                    totalWeight: round(calculateTotalWeight(weights))
                };

            });

        }

    });

    const nexus = global.NX || global.Nexus || {};
    global.NX = nexus;
    global.Nexus = nexus;
    nexus.visualWeight = visualWeight;

})(window);
