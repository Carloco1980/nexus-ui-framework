/* Nexus UI Framework — shared Chart.js card tooltip. */
(function (global) {
    "use strict";

    const tooltipClass = "nx-chart-tooltip";

    function getTooltipElement() {
        let element = document.querySelector(`.${tooltipClass}`);

        if (!element) {
            element = document.createElement("div");
            element.className = tooltipClass;
            element.setAttribute("role", "tooltip");
            element.setAttribute("aria-hidden", "true");
            document.body.append(element);
        }

        return element;
    }

    function renderTooltip(context) {
        const { chart, tooltip } = context;
        const element = getTooltipElement();

        if (!tooltip || tooltip.opacity === 0 || !tooltip.dataPoints?.length) {
            element.style.opacity = "0";
            element.setAttribute("aria-hidden", "true");
            return;
        }

        const fragment = document.createDocumentFragment();
        const title = document.createElement("div");
        title.className = `${tooltipClass}__title`;
        title.textContent = tooltip.title?.join(" ") || "";
        fragment.append(title);

        const rows = document.createElement("div");
        rows.className = `${tooltipClass}__rows`;

        tooltip.dataPoints.forEach((point) => {
            const row = document.createElement("div");
            row.className = `${tooltipClass}__row`;

            const label = document.createElement("span");
            label.className = `${tooltipClass}__label`;
            label.textContent = point.dataset.label || point.label || "";

            const value = document.createElement("span");
            value.className = `${tooltipClass}__value`;
            value.textContent = point.formattedValue ?? String(point.raw ?? "");

            const marker = document.createElement("span");
            marker.className = `${tooltipClass}__marker`;
            marker.setAttribute("aria-hidden", "true");
            const color = point.dataset.borderColor || point.dataset.backgroundColor;
            marker.style.backgroundColor = Array.isArray(color) ? color[point.dataIndex] : color;

            row.append(marker, label, value);
            rows.append(row);
        });

        fragment.append(rows);
        element.replaceChildren(fragment);
        element.style.opacity = "1";
        element.setAttribute("aria-hidden", "false");

        const rect = chart.canvas.getBoundingClientRect();
        const desiredLeft = rect.left + tooltip.caretX;
        const halfWidth = element.offsetWidth / 2;
        const left = Math.max(halfWidth + 8, Math.min(desiredLeft, global.innerWidth - halfWidth - 8));
        element.style.left = `${left}px`;
        element.style.top = `${rect.top + tooltip.caretY}px`;
    }

    function install(ChartLibrary = global.Chart) {
        if (!ChartLibrary?.defaults?.plugins?.tooltip) return;

        ChartLibrary.defaults.plugins.tooltip = {
            ...ChartLibrary.defaults.plugins.tooltip,
            enabled: false,
            external: renderTooltip
        };
    }

    global.NXChartTooltip = Object.freeze({ install, external: renderTooltip });
    install();
})(window);
