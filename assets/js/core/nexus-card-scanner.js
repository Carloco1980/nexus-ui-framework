/*
==================================================
Nexus UI Framework

Module : Card Scanner
==================================================
*/

(function (global) {

    "use strict";

    const cardSelector = [
        ".nx-card",
        ".nx-panel",
        ".nx-kpi",
        ".nx-kpi-card",
        ".nx-chart-card",
        ".nx-table-card",
        ".nx-result-summary",
        ".nx-component-card",
        ".nx-design-card",
        ".nx-feature-card",
        ".nx-template-card"
    ].join(", ");

    const cardScanner = Object.freeze({

        scan() {

            return Array.from(document.querySelectorAll(cardSelector), (card) => {

                const bounds = card.getBoundingClientRect();
                const title = card.querySelector(
                    'h1, h2, h3, h4, h5, h6, [role="heading"], [data-card-title], .nx-card-title'
                );
                const normalizedText = (card.textContent || "")
                    .replace(/\s+/g, " ")
                    .trim();
                const normalizedTitle = (title?.textContent || "")
                    .replace(/\s+/g, " ")
                    .trim();

                return {
                    element: card,
                    width: bounds.width,
                    height: bounds.height,
                    position: {
                        x: bounds.x,
                        y: bounds.y,
                        top: bounds.top,
                        right: bounds.right,
                        bottom: bounds.bottom,
                        left: bounds.left
                    },
                    hasImage: Boolean(card.querySelector(
                        'img, picture, [data-media-type="image"]'
                    )),
                    hasVideo: Boolean(card.querySelector(
                        'video, [data-media-type="video"]'
                    )),
                    hasChart: Boolean(card.querySelector(
                        'canvas, [data-chart], [role="graphics-document"], [role="graphics-symbol"]'
                    )),
                    hasTable: Boolean(card.querySelector(
                        'table, [role="table"], [role="grid"]'
                    )),
                    hasButtons: Boolean(card.querySelector(
                        'button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"], a.nx-button'
                    )),
                    hasFooter: Boolean(card.querySelector(
                        'footer, [role="contentinfo"], [data-card-footer], .nx-card-footer'
                    )),
                    hasBadge: Boolean(card.querySelector(
                        'mark, [role="status"], [data-badge], [data-nx-badge], [class*="badge" i], [class*="tag" i]'
                    )),
                    textLength: normalizedText.length,
                    titleLength: normalizedTitle.length
                };

            });

        }

    });

    const nexus = global.NX || global.Nexus || {};
    global.NX = nexus;
    global.Nexus = nexus;
    nexus.cardScanner = cardScanner;

})(window);
