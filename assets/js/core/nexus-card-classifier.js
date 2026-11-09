/*
==================================================
Nexus UI Framework

Module : Card Classifier
==================================================
*/

(function (global) {

    "use strict";

    const types = [
        "profile",
        "project",
        "text",
        "media",
        "analytics",
        "chart",
        "table",
        "gallery",
        "kpi"
    ];

    const ids = new WeakMap();
    let nextId = 1;

    function getId(card, index) {

        const element = card?.element;

        if (!element || (typeof element !== "object" && typeof element !== "function")) {
            return `nace-card-${index + 1}`;
        }

        if (!ids.has(element)) {
            ids.set(element, `nace-card-${nextId++}`);
        }

        return ids.get(element);

    }

    function classifyCard(card) {

        const width = Math.max(0, Number(card?.width) || 0);
        const height = Math.max(0, Number(card?.height) || 0);
        const area = width * height;
        const aspectRatio = height > 0 ? width / height : 0;
        const textLength = Math.max(0, Number(card?.textLength) || 0);
        const titleLength = Math.max(0, Number(card?.titleLength) || 0);
        const hasImage = Boolean(card?.hasImage);
        const hasVideo = Boolean(card?.hasVideo);
        const hasChart = Boolean(card?.hasChart);
        const hasTable = Boolean(card?.hasTable);
        const hasButtons = Boolean(card?.hasButtons);
        const hasFooter = Boolean(card?.hasFooter);
        const hasBadge = Boolean(card?.hasBadge);
        const hasMedia = hasImage || hasVideo;
        const scores = Object.fromEntries(types.map((type) => [type, 0]));

        if (hasChart) {
            scores.chart = 0.88;
        }

        if (hasTable) {
            scores.table = 0.9;
        }

        if (hasChart && hasTable) {
            scores.analytics = 0.96;
            scores.chart = 0.5;
            scores.table = 0.5;
        } else if (hasChart && hasButtons && hasFooter && textLength > 160) {
            scores.analytics = 0.82;
        }

        if (hasVideo) {
            scores.media = 0.92;
        }

        if (hasImage) {
            scores.media = Math.max(scores.media, 0.58);

            if (titleLength > 0) {
                scores.profile = 0.46;
                scores.project = 0.44;

                if (textLength <= 180) scores.profile += 0.1;
                if (hasBadge) scores.profile += 0.13;
                if (hasButtons) scores.profile += 0.08;
                if (aspectRatio >= 0.75 && aspectRatio <= 1.25) scores.profile += 0.08;

                if (textLength > 140) scores.project += 0.2;
                else if (textLength > 70) scores.project += 0.1;
                if (hasButtons) scores.project += 0.13;
                if (hasFooter) scores.project += 0.12;
                if (aspectRatio > 1.25) scores.project += 0.05;
            }

            if (aspectRatio > 1.35) scores.gallery = 0.64;
            if (aspectRatio > 1.35 && textLength < 100) scores.gallery += 0.16;
            if (aspectRatio > 1.35 && titleLength < 40) scores.gallery += 0.06;
            if (aspectRatio > 1.35 && !hasButtons) scores.gallery += 0.05;
        }

        if (!hasMedia && !hasChart && !hasTable) {
            if (textLength > 280) scores.text = 0.9;
            else if (textLength > 160) scores.text = 0.82;
            else if (textLength > 80) scores.text = 0.72;
            else scores.text = 0.55;

            if (titleLength > 0) scores.text += 0.05;

            if (textLength <= 120) {
                scores.kpi = 0.55;
                if (titleLength > 0 && titleLength <= 32) scores.kpi += 0.1;
                if (hasBadge) scores.kpi += 0.14;
                if (!hasButtons && !hasFooter) scores.kpi += 0.08;
                if (area > 0 && area < 200000) scores.kpi += 0.08;
            }
        }

        const [type, confidence] = Object.entries(scores)
            .sort((a, b) => b[1] - a[1])[0];

        return {
            type,
            confidence: Math.max(0, Math.min(1, Number(confidence.toFixed(2))))
        };

    }

    const cardClassifier = Object.freeze({

        classify() {

            const scanner = global.Nexus?.cardScanner || global.NX?.cardScanner;

            if (typeof scanner?.scan !== "function") {
                return [];
            }

            return scanner.scan().map((card, index) => {
                const classification = classifyCard(card);

                return {
                    id: getId(card, index),
                    type: classification.type,
                    confidence: classification.confidence
                };
            });

        }

    });

    const nexus = global.NX || global.Nexus || {};
    global.NX = nexus;
    global.Nexus = nexus;
    nexus.cardClassifier = cardClassifier;

})(window);
