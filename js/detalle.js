(function() {
    "use strict";

    // Obtener el ID de la URL
    function getParam(param) {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    var id = getParam('id');

    if (!id) {
        document.getElementById('detalle-container').innerHTML = `
            <div class="detalle-error">
                <i class="ti ti-alert-circle"></i>
                <h2>No se encontró la oportunidad</h2>
                <p>El ID de la oportunidad no es válido.</p>
                <a href="index.html" class="cta"><i class="ti ti-arrow-left"></i> Volver al listado</a>
            </div>
        `;
        return;
    }

    // Cargar los datos
    fetch('oportunidades.json')
        .then(function(res) {
            if (!res.ok) throw new Error('No se pudo cargar el archivo');
            return res.json();
        })
        .then(function(json) {
            var oportunidades = json.oportunidades || [];
            var item = oportunidades.find(function(o) { return o.id === id; });

            if (!item) {
                document.getElementById('detalle-container').innerHTML = `
                    <div class="detalle-error">
                        <i class="ti ti-alert-circle"></i>
                        <h2>Oportunidad no encontrada</h2>
                        <p>La oportunidad que buscas no existe o fue eliminada.</p>
                        <a href="index.html" class="cta"><i class="ti ti-arrow-left"></i> Volver al listado</a>
                    </div>
                `;
                return;
            }

            renderDetalle(item);
        })
        .catch(function(err) {
            document.getElementById('detalle-container').innerHTML = `
                <div class="detalle-error">
                    <i class="ti ti-alert-circle"></i>
                    <h2>Error al cargar los datos</h2>
                    <p>${err.message}</p>
                    <a href="index.html" class="cta"><i class="ti ti-arrow-left"></i> Volver al listado</a>
                </div>
            `;
            console.error(err);
        });

    function renderDetalle(item) {
        var container = document.getElementById('detalle-container');

        // Mapeo de tipos
        var tipoMap = {
            'empleo': '💼 Empleo',
            'beca': '🎓 Beca',
            'curso': '📚 Curso',
            'freelance': '💻 Freelance',
            'recurso': '📌 Recurso'
        };

        var modalidadMap = {
            'remoto': '🌐 Remoto',
            'presencial': '🏢 Presencial',
            'hibrido': '🔄 Híbrido',
            'recurso': '📌 Recurso'
        };

        var categoriaIconMap = {
            'Administracion': 'ti-tie',
            'Diseno': 'ti-palette',
            'Redaccion': 'ti-edit',
            'Marketing': 'ti-chart-bar',
            'Traduccion': 'ti-language',
            'Audiovisual': 'ti-video',
            'Idiomas': 'ti-messages',
            'Programacion': 'ti-code',
            'Educacion': 'ti-school',
            'Salud': 'ti-heart',
            'Arte': 'ti-palette',
            'Finanzas': 'ti-coin',
            'Ventas': 'ti-chart-arrows',
            'Legal': 'ti-scale',
            'Recursos Humanos': 'ti-users'
        };

        var categoriaIcon = categoriaIconMap[item.categoria] || 'ti-tag';

        // Formatear fecha
        function formatFecha(iso) {
            if (!iso) return 'Abierto';
            var d = new Date(iso + 'T00:00:00');
            if (isNaN(d.getTime())) return iso;
            return d.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
        }

        // Construir HTML
        var html = `
            <div class="detalle-card">
                <div class="detalle-header">
                    <span class="detalle-tipo">${tipoMap[item.tipo] || item.tipo}</span>
                    <span class="detalle-categoria"><i class="ti ${categoriaIcon}"></i> ${item.categoria || 'General'}</span>
                </div>

                <h1 class="detalle-titulo">${escapeHtml(item.titulo)}</h1>
                <p class="detalle-organizacion"><i class="ti ti-building"></i> ${escapeHtml(item.organizacion)}</p>
                <p class="detalle-pais"><i class="ti ti-map-pin"></i> ${escapeHtml(item.pais_organizacion || 'No especificado')}</p>

                <div class="detalle-grid">
                    <div class="detalle-info">
                        <span class="detalle-label"><i class="ti ti-device-laptop"></i> Modalidad</span>
                        <span class="detalle-value">${modalidadMap[item.modalidad] || item.modalidad}</span>
                    </div>
                    <div class="detalle-info">
                        <span class="detalle-label"><i class="ti ti-coin"></i> Pago internacional</span>
                        <span class="detalle-value ${item.pago_internacional ? 'yes' : 'no'}">${item.pago_internacional ? '✅ Sí' : '❌ No'}</span>
                    </div>
                    <div class="detalle-info">
                        <span class="detalle-label"><i class="ti ti-home"></i> Residencia</span>
                        <span class="detalle-value ${item.sin_residencia ? 'yes' : 'no'}">${item.sin_residencia ? '✅ Sin residencia requerida' : '❌ Requiere residencia'}</span>
                    </div>
                    <div class="detalle-info">
                        <span class="detalle-label"><i class="ti ti-calendar"></i> Fecha límite</span>
                        <span class="detalle-value">${formatFecha(item.fecha_limite)}</span>
                    </div>
                    <div class="detalle-info">
                        <span class="detalle-label"><i class="ti ti-chart-bar"></i> Nivel</span>
                        <span class="detalle-value">${escapeHtml(item.nivel || 'Todos')}</span>
                    </div>
                    <div class="detalle-info">
                        <span class="detalle-label"><i class="ti ti-source-code"></i> Fuente</span>
                        <span class="detalle-value">${escapeHtml(item.fuente || 'No especificada')}</span>
                    </div>
                </div>

                ${item.metodos_pago && item.metodos_pago.length > 0 ? `
                <div class="detalle-metodos">
                    <span class="detalle-label"><i class="ti ti-wallet"></i> Métodos de pago</span>
                    <div class="detalle-pagos">
                        ${item.metodos_pago.map(function(m) { return '<span class="pago-badge">' + escapeHtml(m) + '</span>'; }).join('')}
                    </div>
                </div>
                ` : ''}

                ${item.habilidades && item.habilidades.length > 0 ? `
                <div class="detalle-habilidades">
                    <span class="detalle-label"><i class="ti ti-tools"></i> Habilidades</span>
                    <div class="detalle-skills">
                        ${item.habilidades.map(function(h) { return '<span class="skill-badge">' + escapeHtml(h) + '</span>'; }).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="detalle-descripcion">
                    <span class="detalle-label"><i class="ti ti-file-text"></i> Descripción</span>
                    <p>${escapeHtml(item.descripcion || 'Sin descripción disponible.')}</p>
                </div>

                <div class="detalle-botones">
                    ${item.telefono ? `
                    <a href="tel:${escapeHtml(item.telefono)}" class="cta contact-btn">
                        <i class="ti ti-phone"></i> Contactar por teléfono
                    </a>
                    ` : ''}
                    
                    ${item.email ? `
                    <a href="mailto:${escapeHtml(item.email)}" class="cta contact-btn email-btn">
                        <i class="ti ti-mail"></i> Contactar por email
                    </a>
                    ` : ''}

                    ${item.enlace && item.enlace !== '#' ? `
                    <a href="${escapeHtml(item.enlace)}" target="_blank" rel="noopener" class="cta link-btn">
                        <i class="ti ti-external-link"></i> Ver oportunidad original
                    </a>
                    ` : ''}
                </div>

                <div class="detalle-compartir">
                    <button onclick="compartir()" class="share-btn">
                        <i class="ti ti-share"></i> Compartir esta oportunidad
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Actualizar título de la página
        document.title = item.titulo + ' — cu_JobsHub';
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Función para compartir
    window.compartir = function() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Oportunidad en cu_JobsHub',
                url: window.location.href
            }).catch(function() {});
        } else {
            // Fallback: copiar al portapapeles
            var dummy = document.createElement('textarea');
            dummy.value = window.location.href;
            document.body.appendChild(dummy);
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            alert('Enlace copiado al portapapeles!');
        }
    };

})();
