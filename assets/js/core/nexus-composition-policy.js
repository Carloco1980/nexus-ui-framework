/*
==================================================
Nexus UI Framework

Module : Composition Policy
==================================================
*/

(function (global) {

    "use strict";

    const devicePolicies = {
        mobile: {
            layoutMode: "stacked",
            maxColumns: 1,
            adaptiveColumns: false,
            useGoldenRatio: false,
            targetRatio: 1,
            baseDensity: 0.48,
            responsiveMode: "mobile-first"
        },
        tablet: {
            layoutMode: "balanced",
            maxColumns: 2,
            adaptiveColumns: true,
            useGoldenRatio: false,
            targetRatio: 1.33,
            baseDensity: 0.54,
            responsiveMode: "fluid"
        },
        desktop: {
            layoutMode: "balanced",
            maxColumns: 4,
            adaptiveColumns: true,
            useGoldenRatio: true,
            targetRatio: 1.618,
            baseDensity: 0.58,
            responsiveMode: "fluid"
        },
        ultrawide: {
            layoutMode: "expanded",
            maxColumns: 6,
            adaptiveColumns: true,
            useGoldenRatio: false,
            targetRatio: 1.85,
            baseDensity: 0.64,
            responsiveMode: "wide"
        }
    };

    function clamp(value, minimum, maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    function round(value) {
        return Number(value.toFixed(2));
    }

    const compositionPolicy = Object.freeze({

        get() {

            const nexus = global.Nexus || global.NX;
            const context = typeof nexus?.layoutContext?.get === "function"
                ? nexus.layoutContext.get()
                : {};
            const groups = typeof nexus?.semanticGroups?.detect === "function"
                ? nexus.semanticGroups.detect()
                : [];
            const device = devicePolicies[context.device]
                ? context.device
                : "desktop";
            const policy = devicePolicies[device];
            const availableColumns = Math.max(1, Number(context.maxColumns) || policy.maxColumns);
            const maxColumns = Math.max(1, Math.min(policy.maxColumns, availableColumns));
            const currentDensity = clamp(Number(context.layoutDensity) || 0, 0, 1);
            const hasReadingGroups = groups.some((item) =>
                item.group === "project-detail" || item.group === "media-section"
            );
            const hasSemanticGroups = groups.length > 0;
            const targetDensity = clamp(
                policy.baseDensity
                    + (0.5 - currentDensity) * 0.12
                    - Math.min(groups.length, 4) * 0.01,
                0.35,
                0.75
            );
            const compactMode = device === "mobile" || currentDensity >= 0.78;
            const spacingMode = compactMode
                ? "compact"
                : device === "ultrawide" && currentDensity < 0.65
                    ? "spacious"
                    : "comfortable";

            return {
                device,
                layoutMode: policy.layoutMode,
                maxColumns,
                adaptiveColumns: policy.adaptiveColumns && maxColumns > 1,
                useGoldenRatio: policy.useGoldenRatio && maxColumns > 1,
                targetRatio: policy.targetRatio,
                spacingMode,
                readingPriority: hasReadingGroups || device !== "ultrawide"
                    ? "high"
                    : "balanced",
                preserveSemanticGroups: hasSemanticGroups,
                compactMode,
                responsiveMode: policy.responsiveMode,
                targetDensity: round(targetDensity)
            };

        }

    });

    const nexus = global.NX || global.Nexus || {};
    global.NX = nexus;
    global.Nexus = nexus;
    nexus.compositionPolicy = compositionPolicy;

})(window);
