/**
 * --------------------------------------------------------
 * Nexus UI Framework
 * Catalog Module
 * --------------------------------------------------------
 */

const NexusCatalog = {

    registry: [],
    categories: [],
    statuses: [],

    async init() {

        if (!document.getElementById("component-catalog")) return;

        try {
            await this.loadRegistry();
            this.buildCatalog();
            await this.loadPreviews();
            this.bindEvents();
            this.applyFilter("all");
        } catch (error) {
            const status = document.getElementById("catalog-status");
            if (status) status.textContent = "No se pudo cargar el catálogo.";
            if (window.NX?.config?.debug?.enabled) {
                console.error("Nexus catalog could not be initialized.", error);
            }
        }

    },

    async loadRegistry() {

        const [components, categories, statuses] = await Promise.all([

            fetch("components/registry/components.json"),
            fetch("components/registry/categories.json"),
            fetch("components/registry/statuses.json")

        ]);

        if (![components, categories, statuses].every(response => response.ok)) {
            throw new Error("Catalog registry request failed.");
        }

        this.registry = await components.json();
        this.categories = await categories.json();
        this.statuses = await statuses.json();

    },

    buildCatalog() {

        const container = document.getElementById("component-catalog");

        if (!container) return;

        container.innerHTML = "";

        this.registry
            .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
            .forEach(component => {

                container.appendChild(this.buildCard(component));

            });

    },

    buildCard(component) {

        const article = document.createElement("article");

        article.className = "nx-component-card";
        article.dataset.category = component.category;

        article.innerHTML = `

<header class="nx-component-card-header">

<span class="nx-badge nx-badge-${component.status}">
● ${this.getStatus(component.status)}
</span>

</header>

<h3>${component.name}</h3>

<p>${component.description}</p>

<div class="nx-component-meta">

${component.responsive ? '<span class="nx-badge">Responsive</span>' : ''}

${component.darkMode ? '<span class="nx-badge">Dark Mode</span>' : ''}

${component.javascript ? '<span class="nx-badge">JavaScript</span>' : ''}

${component.accessibility ? '<span class="nx-badge">Accessible</span>' : ''}

</div>

${component.preview ? `<div class="nx-component-preview" data-preview-src="${component.preview}"></div>` : ''}

<footer>

${component.preview ? `<a class="nx-button nx-button-outline" href="${component.preview}">Ver componente</a>` : ''}

</footer>

`;

        return article;

    },

    getStatus(id) {

        return this.statuses.find(s => s.id === id)?.label ?? id;

    },

    async loadPreviews() {

        const previews = [...document.querySelectorAll("[data-preview-src]")];

        await Promise.allSettled(

            previews.map(async preview => {

                try {

                    const response = await fetch(preview.dataset.previewSrc);

                    if (!response.ok) {
                        throw new Error("Preview request failed.");
                    }

                    preview.innerHTML = await response.text();

                }

                catch {

                    preview.innerHTML =
                        "<small>Vista previa no disponible</small>";

                }

            })

        );

    },

    applyFilter(category) {

        const cards = [...document.querySelectorAll(".nx-component-card")];

        let visible = 0;

        cards.forEach(card => {

            const show = category === "all"
                || card.dataset.category === category;

            card.hidden = !show;

            if (show) visible++;

        });

        const status = document.getElementById("catalog-status");

        if (status)
            status.textContent = `${visible} componentes`;

    },

    bindEvents() {

        const filter = document.getElementById("category-filter");

        if (!filter) return;

        filter.addEventListener("change", () => {

            this.applyFilter(filter.value);

        });

    }

};

document.addEventListener("DOMContentLoaded", () => {

    NexusCatalog.init();

});
