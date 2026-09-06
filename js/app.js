(function() {
    "use strict";

    const TIPO_LABEL = {
        empleo: '<i class="ti ti-briefcase"></i> Empleo',
        beca: '<i class="ti ti-school"></i> Beca',
        curso: '<i class="ti ti-book"></i> Curso',
        freelance: '<i class="ti ti-device-laptop"></i> Freelance',
        recurso: '<i class="ti ti-file-text"></i> Recurso'
    };

    const MODALIDAD_LABEL = {
        remoto: '<i class="ti ti-world"></i> Remoto',
        presencial: '<i class="ti ti-building"></i> Presencial',
        hibrido: '<i class="ti ti-arrows-split"></i> Hibrido',
        recurso: '<i class="ti ti-file-text"></i> Recurso'
    };

    const CATEGORIA_ICONO = {
        "Administracion": "ti-tie",
        "Diseno": "ti-palette",
        "Redaccion": "ti-edit",
        "Marketing": "ti-chart-bar",
        "Traduccion": "ti-language",
        "Audiovisual": "ti-video",
        "Idiomas": "ti-messages",
        "Programacion": "ti-code",
        "Educacion": "ti-school",
        "Salud": "ti-heart",
        "Arte": "ti-palette",
        "Finanzas": "ti-coin",
        "Ventas": "ti-chart-arrows",
        "Legal": "ti-scale",
        "Recursos Humanos": "ti-users"
    };

    const state = {
        all: [],
        tipo: "todos",
        categoria: "todas",
        query: "",
        soloSinResidencia: false,
        soloPagoIntl: false
    };

    const $manifestBody = document.getElementById("manifest-body");
    const $empty = document.getElementById("empty-state");
    const $search = document.getElementById("search");
    const $chips = document.querySelectorAll(".chip");
    const $toggleResidencia = document.getElementById("toggle-residencia");
    const $togglePago = document.getElementById("toggle-pago");
    const $categoriaFilter = document.getElementById("categoria-filter");
    const $statsCounter = document.getElementById("stats-counter");
    const $statsCategorias = document.getElementById("stats-categorias");
    const $statsPaises = document.getElementById("stats-paises");

    function formatFecha(iso) {
        if (!iso) return "Abierto";
        var d = new Date(iso + "T00:00:00");
        if (isNaN(d.getTime())) return iso;
        return d.toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
    }

    function escapeHtml(str) {
        var div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    function getCategoriaIcon(categoria) {
        var icon = CATEGORIA_ICONO[categoria] || "ti-tag";
        return '<i class="ti ' + icon + '"></i> ';
    }

    function getUniqueValues(arr, key) {
        var values = [];
        arr.forEach(function(item) {
            if (item[key] && values.indexOf(item[key]) === -1) {
                values.push(item[key]);
            }
        });
        return values;
    }

    function matchesFilters(item) {
        if (state.tipo !== "todos" && item.tipo !== state.tipo) return false;
        if (state.categoria !== "todas" && item.categoria !== state.categoria) return false;
        if (state.soloSinResidencia && !item.sin_residencia) return false;
        if (state.soloPagoIntl && !item.pago_internacional) return false;

        if (state.query) {
            var haystack = (item.titulo + " " + item.organizacion + " " + (item.categoria || "") + " " + (item.descripcion || "")).toLowerCase();
            if (haystack.indexOf(state.query.toLowerCase()) === -1) return false;
        }
        return true;
    }

    function render() {
        var items = state.all.filter(matchesFilters);
        $manifestBody.innerHTML = "";

        if (items.length === 0) {
            $empty.hidden = false;
            updateStats(items);
            return;
        }
        $empty.hidden = true;

        var frag = document.createDocumentFragment();

        items.forEach(function(item) {
            var row = document.createElement("a");
            row.className = "manifest-row";
            row.href = item.enlace || "#";
            row.target = "_blank";
            row.rel = "noopener noreferrer";

            var tipoLabel = TIPO_LABEL[item.tipo] || item.tipo;
            var modalidadLabel = MODALIDAD_LABEL[item.modalidad] || item.modalidad;
            var categoriaIcon = getCategoriaIcon(item.categoria);

            row.innerHTML = `
                <span class="row-type">${tipoLabel}</span>
                <span>
                    <span class="row-title">${escapeHtml(item.titulo)}</span>
                    <span class="row-org">${escapeHtml(item.organizacion)}</span>
                    ${item.categoria ? `<span class="row-categoria">${categoriaIcon}${escapeHtml(item.categoria)}</span>` : ''}
                </span>
                <span class="row-modalidad">${modalidadLabel}</span>
                <span class="row-pago ${item.pago_internacional ? 'yes' : 'no'}">
                    ${item.pago_internacional ? 'Si' : 'No'}
                </span>
                <span class="row-fecha">${formatFecha(item.fecha_limite)}</span>
            `;

            frag.appendChild(row);
        });

        $manifestBody.appendChild(frag);
        updateStats(items);
    }

    function updateStats(items) {
        if ($statsCounter) {
            $statsCounter.textContent = items.length;
        }

        if ($statsCategorias) {
            var categorias = getUniqueValues(state.all, 'categoria');
            $statsCategorias.textContent = categorias.length;
        }

        if ($statsPaises) {
            var paises = getUniqueValues(state.all, 'pais_organizacion');
            $statsPaises.textContent = paises.length;
        }
    }

    function wireControls() {
        $chips.forEach(function(chip) {
            chip.addEventListener("click", function() {
                $chips.forEach(function(c) { c.classList.remove("is-active"); });
                chip.classList.add("is-active");
                state.tipo = chip.dataset.type;
                render();
            });
        });

        $search.addEventListener("input", function(e) {
            state.query = e.target.value.trim();
            render();
        });

        $toggleResidencia.addEventListener("change", function(e) {
            state.soloSinResidencia = e.target.checked;
            render();
        });

        $togglePago.addEventListener("change", function(e) {
            state.soloPagoIntl = e.target.checked;
            render();
        });

        $categoriaFilter.addEventListener("change", function(e) {
            state.categoria = e.target.value;
            render();
        });
    }

    function populateCategoryFilter() {
        var categorias = getUniqueValues(state.all, 'categoria');
        var select = $categoriaFilter;

        while (select.options.length > 0) {
            select.remove(0);
        }

        var allOption = document.createElement('option');
        allOption.value = 'todas';
        allOption.textContent = 'Todas las categorias';
        select.appendChild(allOption);

        categorias.sort().forEach(function(cat) {
            var option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
    }

    function wireBoardFlip() {
        var el = document.getElementById("flip-text");
        if (!el || state.all.length === 0) return;

        var titles = state.all.slice(0, 8).map(function(i) { return i.titulo; });
        if (titles.length === 0) return;

        var i = 0;
        var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.textContent = titles[0];

        if (reduceMotion) return;

        setInterval(function() {
            i = (i + 1) % titles.length;
            el.style.opacity = "0";
            setTimeout(function() {
                el.textContent = titles[i];
                el.style.transition = "opacity 0.35s ease";
                el.style.opacity = "1";
            }, 250);
        }, 3500);
    }

    function setupShare() {
        var shareBtn = document.getElementById('share-btn');
        if (!shareBtn) return;

        if (navigator.share) {
            shareBtn.hidden = false;
            shareBtn.addEventListener('click', function() {
                navigator.share({
                    title: 'cu_JobsHub — Oportunidades para todo talento cubano',
                    text: 'Conectando talento cubano con oportunidades globales. ¡Descubrelo!',
                    url: window.location.href
                }).catch(function() {});
            });
        }
    }

    function setupBackToTop() {
        var btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', function() {
            btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
        });

        btn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function setupFeedback() {
        var link = document.getElementById('feedback-link');
        if (!link) return;

        link.addEventListener('click', function(e) {
            e.preventDefault();
            var message = encodeURIComponent(
                'Feedback para cu_JobsHub\n\n' +
                'Que te gusta?\n' +
                'Que mejorarias?\n' +
                'Que oportunidades buscas?\n\n' +
                'Gracias por ayudarnos a mejorar!'
            );
            window.open('https://t.me/cujobshub?text=' + message, '_blank');
        });
    }

    async function init() {
        try {
            var res = await fetch("data/oportunidades.json");
            if (!res.ok) throw new Error("HTTP " + res.status);
            var json = await res.json();
            state.all = (json.oportunidades || []).filter(function(i) {
                return i.tipo;
            });

            if (state.all.length === 0) {
                $manifestBody.innerHTML =
                    '<p class="empty-state"><i class="ti ti-inbox"></i> No hay oportunidades cargadas. ¡Se el primero en contribuir!</p>';
                return;
            }
        } catch (err) {
            $manifestBody.innerHTML =
                '<p class="empty-state"><i class="ti ti-alert-circle"></i> No se pudo cargar el listado. Revisa <code>data/oportunidades.json</code>.</p>';
            console.error("Error cargando oportunidades:", err);
            return;
        }

        populateCategoryFilter();
        wireControls();
        wireBoardFlip();
        setupShare();
        setupBackToTop();
        setupFeedback();
        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
