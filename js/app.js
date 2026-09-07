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
        filtered: [],
        tipo: "todos",
        categoria: "todas",
        query: "",
        soloSinResidencia: false,
        soloPagoIntl: false,
        pagina: 1,
        porPagina: 10
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
    const $pagination = document.getElementById("pagination");
    const $pageInfo = document.getElementById("page-info");
    const $prevBtn = document.getElementById("prev-page");
    const $nextBtn = document.getElementById("next-page");

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

    function applyFilters() {
        state.filtered = state.all.filter(matchesFilters);
        state.filtered.sort(function(a, b) {
            if (!a.fecha_limite) return 1;
            if (!b.fecha_limite) return -1;
            return new Date(a.fecha_limite) - new Date(b.fecha_limite);
        });
        state.pagina = 1;
    }

    function render() {
        applyFilters();
        
        var totalItems = state.filtered.length;
        var totalPages = Math.ceil(totalItems / state.porPagina);
        
        if (state.pagina > totalPages) state.pagina = totalPages || 1;
        
        var start = (state.pagina - 1) * state.porPagina;
        var end = Math.min(start + state.porPagina, totalItems);
        var pageItems = state.filtered.slice(start, end);

        $manifestBody.innerHTML = "";

        if (pageItems.length === 0) {
            $empty.hidden = false;
            $pagination.style.display = 'none';
            updateStats(pageItems);
            return;
        }
        $empty.hidden = true;
        $pagination.style.display = 'flex';

        var frag = document.createDocumentFragment();

        pageItems.forEach(function(item) {
            var row = document.createElement("a");
            row.className = "manifest-row";
            row.href = "detalle.html?id=" + encodeURIComponent(item.id);
            row.target = "_self";

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
        updateStats(pageItems);
        updatePagination(totalItems, totalPages);
    }

    function updatePagination(totalItems, totalPages) {
        if (!$pageInfo) return;
        $pageInfo.textContent = 'Página ' + state.pagina + ' de ' + (totalPages || 1) + ' (' + totalItems + ' oportunidades)';
        
        if ($prevBtn) {
            $prevBtn.disabled = state.pagina <= 1;
        }
        if ($nextBtn) {
            $nextBtn.disabled = state.pagina >= totalPages;
        }
    }

    function goToPage(page) {
        var totalPages = Math.ceil(state.filtered.length / state.porPagina);
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages || 1;
        state.pagina = page;
        render();
        document.querySelector('.manifest').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function updateStats(items) {
        if ($statsCounter) {
            $statsCounter.textContent = state.filtered.length;
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

        if ($prevBtn) {
            $prevBtn.addEventListener("click", function() {
                goToPage(state.pagina - 1);
            });
        }

        if ($nextBtn) {
            $nextBtn.addEventListener("click", function() {
                goToPage(state.pagina + 1);
            });
        }
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
            var res = await fetch("oportunidades.json");
            
            if (!res.ok) throw new Error("HTTP " + res.status);
            var json = await res.json();
            state.all = (json.oportunidades || []).filter(function(i) {
                return i.tipo;
            });

            if (state.all.length === 0) {
                $manifestBody.innerHTML =
                    '<p class="empty-state"><i class="ti ti-inbox"></i> No hay oportunidades cargadas. ¡Se el primero en contribuir!</p>';
                $pagination.style.display = 'none';
                return;
            }
        } catch (err) {
            $manifestBody.innerHTML =
                '<p class="empty-state"><i class="ti ti-alert-circle"></i> No se pudo cargar el listado. Revisa el archivo <code>oportunidades.json</code> en la raiz.</p>';
            $pagination.style.display = 'none';
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
