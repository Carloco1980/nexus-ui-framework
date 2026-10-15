const cards = [...document.querySelectorAll("#component-catalog [data-category]")];
const status = document.getElementById("catalog-status");
const filter = document.getElementById("category-filter");

function applyFilter(category) {
    let visibleCount = 0;

    cards.forEach((card) => {
        const visible = category === "all" || card.dataset.category === category;
        card.hidden = !visible;
        visibleCount += Number(visible);
    });

    status.textContent = `${visibleCount} componentes`;
}

filter.addEventListener("change", () => applyFilter(filter.value));

async function loadFragment(element) {
    const response = await fetch(element.dataset.previewSrc);
    if (!response.ok) {
        throw new Error(`No se pudo cargar ${element.dataset.previewSrc}`);
    }
    element.innerHTML = await response.text();
}

async function loadCatalog() {
    const previews = [...document.querySelectorAll("[data-preview-src]")];
    const jobs = previews.map((preview) => loadFragment(preview));

    const navbar = document.getElementById("showcase-navbar");
    jobs.push(fetch("components/navbar/navbar.html").then(async (response) => {
        if (!response.ok) throw new Error("No se pudo cargar la Navbar");
        navbar.innerHTML = await response.text();
        navbar.firstElementChild?.setAttribute("id", "showcase-navbar-header");
    }));

    const results = await Promise.allSettled(jobs);
    results.forEach((result, index) => {
        if (result.status === "rejected") {
            const target = previews[index];
            if (target) target.textContent = "Vista previa no disponible.";
            if (window.NX?.config?.debug?.enabled) console.error(result.reason);
        }
    });

    applyFilter("all");
}

await loadCatalog().catch((error) => {
    status.textContent = "No se pudieron cargar las vistas previas. Abre Showcase mediante un servidor local.";
    if (window.NX?.config?.debug?.enabled) console.error(error);
});
