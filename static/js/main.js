// Script personalizado para la hoja de vida

document.addEventListener('DOMContentLoaded', function() {
    // Manejo de navegación por secciones
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    // Mostrar la pantalla de bienvenida inicialmente
    showWelcomeScreen();
    
    // Configurar los botones de control
    setupControlButtons();
    
    // Configurar el header deslizable
    setupSlideDownHeader();
    
    // Configurar la sidebar colapsable
    setupCollapsibleSidebar();
    
    // Configurar los switches en los elementos de navegación
    setupNavSwitches();
    
    // Configurar el overlay de detalles
    setupDetailOverlay();
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Si estamos en la pantalla de bienvenida, ocultarla
            const welcomeScreen = document.getElementById('welcome-screen');
            if (welcomeScreen) {
                welcomeScreen.style.display = 'none';
            }
            
            // Remover clase activa de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar clase activa al enlace clickeado
            this.classList.add('active');
            
            // Ocultar todas las secciones
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Mostrar solo la sección activa
            const sectionId = this.getAttribute('data-section');
            const sectionToShow = document.getElementById(sectionId);
            if (sectionToShow) {
                sectionToShow.style.display = 'block';
            }
            
            // Animar la transición
            animateSection(sectionToShow);
        });
    });
    
    function showWelcomeScreen() {
        // Solo mostrar la pantalla de bienvenida si no estamos en la página de venta de garaje
        if (document.body.classList.contains('garaje-mode')) {
            return;
        }
        
        // Ocultar todas las secciones
        sections.forEach(section => {
            if (section.id !== 'welcome-screen') {
                section.style.display = 'none';
            }
        });
        
        // Mostrar la pantalla de bienvenida
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
        }
    }
    
    function animateSection(section) {
        if (section) {
            section.classList.add('animated');
            
            setTimeout(() => {
                section.classList.remove('animated');
            }, 500);
        }
    }
    
    // Manejo de click en elementos de experiencia laboral
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // No activar si se hizo clic en el botón de toggle
            if (e.target.closest('.btn-toggle-details')) {
                return;
            }
            
            const detailsId = 'exp-details-' + this.getAttribute('data-id');
            const detailsElement = document.getElementById(detailsId);
            
            if (!detailsElement) return;
            
            // Toggle detalles
            if (detailsElement.style.display === 'none' || !detailsElement.style.display) {
                // Cerrar todos los otros detalles abiertos
                document.querySelectorAll('[id^="exp-details-"]').forEach(el => {
                    if (el.id !== detailsId) {
                        el.style.display = 'none';
                    }
                });
                
                // Abrir este detalle con animación
                detailsElement.style.display = 'block';
                detailsElement.classList.add('fade-in');
            } else {
                detailsElement.style.display = 'none';
                detailsElement.classList.remove('fade-in');
            }
        });
    });
    
    // Configurar los botones de control en el sidebar
    function setupControlButtons() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        
        // Verificar si ya existen los botones de control
        if (sidebar.querySelector('.control-buttons')) {
            return;
        }
        
        // Crear el contenedor de botones de control
        const controlButtons = document.createElement('div');
        controlButtons.className = 'control-buttons';
        controlButtons.innerHTML = `
            <button id="theme-toggle" class="control-button" data-tooltip="Modo Oscuro">
                <i class="fas fa-moon"></i>
            </button>
            <button id="view-control" class="control-button" data-tooltip="Control de Vista">
                <i class="fas fa-eye"></i>
            </button>
            <button id="admin-access" class="control-button" data-tooltip="Administración">
                <i class="fas fa-cog"></i>
            </button>
        `;
        sidebar.appendChild(controlButtons);
        
        // Manejar el cambio de tema
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', function() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                this.classList.remove('active');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                this.classList.add('active');
            }
        });
        
        // Verificar el tema guardado
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.classList.add('active');
        }
        
        // Manejar el control de vista
        const viewControl = document.getElementById('view-control');
        viewControl.addEventListener('click', function() {
            document.body.classList.toggle('view-control-active');
            this.classList.toggle('active');
            
            // Si el control de vista está desactivado, ocultar elementos con switch desactivado
            if (!this.classList.contains('active')) {
                // Ocultar elementos con switch desactivado
                document.querySelectorAll('.nav-toggle input[type="checkbox"]:not(:checked)').forEach(checkbox => {
                    const navItem = checkbox.closest('.nav-item');
                    if (navItem) {
                        navItem.style.display = 'none';
                    }
                });
            } else {
                // Mostrar todos los elementos cuando el control está activo
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.style.display = 'flex';
                });
            }
            
            // Guardar el estado en localStorage
            localStorage.setItem('view-control-active', this.classList.contains('active'));
        });
        
        // Verificar el estado guardado del control de vista
        const savedViewControl = localStorage.getItem('view-control-active');
        if (savedViewControl === 'true') {
            document.body.classList.add('view-control-active');
            viewControl.classList.add('active');
        } else {
            // Si el control de vista está desactivado, ocultar elementos con switch desactivado
            document.querySelectorAll('.nav-toggle input[type="checkbox"]:not(:checked)').forEach(checkbox => {
                const navItem = checkbox.closest('.nav-item');
                if (navItem) {
                    navItem.style.display = 'none';
                }
            });
        }
        
        // Manejar el acceso a administración
        const adminAccess = document.getElementById('admin-access');
        adminAccess.addEventListener('click', function() {
            window.location.href = '/admin/';
        });
    }
    
    // Configurar el header deslizable
    function setupSlideDownHeader() {
        const headerTrigger = document.getElementById('header-trigger');
        const slideDownHeader = document.getElementById('slide-down-header');
        
        if (!headerTrigger || !slideDownHeader) return;
        
        // Mostrar el header al pasar el ratón sobre el trigger
        headerTrigger.addEventListener('mouseenter', function() {
            slideDownHeader.classList.add('active');
        });
        
        // Mantener el header visible cuando el mouse está sobre él
        slideDownHeader.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
        
        // Ocultar el header al alejar el ratón
        slideDownHeader.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
        
        // Manejar los botones de navegación
        const navButtons = document.querySelectorAll('.header-nav-button');
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover clase activa de todos los botones
                navButtons.forEach(btn => btn.classList.remove('active'));
                
                // Agregar clase activa al botón clickeado
                this.classList.add('active');
                
                // Redirigir según el botón seleccionado
                const target = this.getAttribute('data-target');
                if (target === 'garage-sale') {
                    // Redirigir a la página de venta de garaje
                    window.location.href = '/venta-garaje/';
                } else {
                    // Redirigir a la hoja de vida
                    window.location.href = '/';
                }
            });
        });
    }
    
    // Configurar la sidebar colapsable
    function setupCollapsibleSidebar() {
        if (!sidebar || !content) return;
        
        // Colapsar la sidebar al cargar la página en pantallas grandes
        if (window.innerWidth > 991) {
            sidebar.classList.add('collapsed');
            content.classList.add('expanded');
        }
        
        // Colapsar la sidebar cuando el mouse sale de ella
        sidebar.addEventListener('mouseleave', function() {
            if (window.innerWidth > 991) { // Solo en pantallas grandes
                sidebar.classList.add('collapsed');
                content.classList.add('expanded');
            }
        });
        
        // Expandir la sidebar cuando el mouse entra en ella
        sidebar.addEventListener('mouseenter', function() {
            sidebar.classList.remove('collapsed');
            content.classList.remove('expanded');
        });
        
        // Para dispositivos móviles, agregar un botón para mostrar/ocultar la sidebar
        if (window.innerWidth <= 991) {
            // Verificar si ya existe el botón de toggle
            if (!document.querySelector('.sidebar-toggle')) {
                const sidebarToggle = document.createElement('div');
                sidebarToggle.className = 'sidebar-toggle';
                sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.appendChild(sidebarToggle);
                
                sidebarToggle.addEventListener('click', function() {
                    sidebar.classList.toggle('active');
                });
                
                // Cerrar la sidebar al hacer clic en un enlace (en móviles)
                navLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        if (window.innerWidth <= 991) {
                            sidebar.classList.remove('active');
                        }
                    });
                });
            }
        }
    }
    
    // Configurar los switches en los elementos de navegación
    function setupNavSwitches() {
        // Crear un contenedor para cada elemento de navegación
        navLinks.forEach(link => {
            // Obtener el elemento padre (nav-item)
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';
            
            // Clonar el enlace para insertarlo en el nuevo contenedor
            const clonedLink = link.cloneNode(true);
            
            // Crear el switch
            const navToggle = document.createElement('div');
            navToggle.className = 'nav-toggle';
            navToggle.innerHTML = `
                <label class="switch">
                    <input type="checkbox" class="section-toggle" data-section="${link.getAttribute('data-section')}" checked>
                    <span class="slider"></span>
                </label>
            `;
            
            // Agregar los elementos al contenedor
            navItem.appendChild(clonedLink);
            navItem.appendChild(navToggle);
            
            // Reemplazar el enlace original con el nuevo contenedor
            link.parentNode.replaceChild(navItem, link);
            
            // Manejar el evento de clic en el enlace clonado
            clonedLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Si estamos en la pantalla de bienvenida, ocultarla
                const welcomeScreen = document.getElementById('welcome-screen');
                if (welcomeScreen) {
                    welcomeScreen.style.display = 'none';
                }
                
                // Remover clase activa de todos los enlaces
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                
                // Agregar clase activa al enlace clickeado
                this.classList.add('active');
                
                // Ocultar todas las secciones
                sections.forEach(section => {
                    section.style.display = 'none';
                });
                
                // Mostrar solo la sección activa
                const sectionId = this.getAttribute('data-section');
                const sectionToShow = document.getElementById(sectionId);
                if (sectionToShow) {
                    sectionToShow.style.display = 'block';
                }
                
                // Animar la transición
                animateSection(sectionToShow);
            });
            
            // Manejar el cambio en el switch
            const toggle = navToggle.querySelector('input[type="checkbox"]');
            toggle.addEventListener('change', function() {
                const sectionId = this.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                const navLink = navItem.querySelector('.nav-link');
                
                if (this.checked) {
                    // Cuando se activa una sección, primero ocultar todas las demás
                    sections.forEach(s => {
                        s.style.display = 'none';
                    });
                    
                    // Mostrar solo esta sección
                    if (section) section.style.display = 'block';
                    
                    // Actualizar la navegación
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    navLink.classList.add('active');
                    
                    navLink.style.opacity = '1';
                    navLink.style.pointerEvents = 'auto';
                    navItem.style.display = 'flex';
                    
                    // Animar la transición
                    animateSection(section);
                } else {
                    // Ocultar la sección
                    if (section) section.style.display = 'none';
                    navLink.style.opacity = '0.5';
                    navLink.style.pointerEvents = 'none';
                    
                    // Si el control de vista está desactivado, ocultar completamente el elemento
                    if (!document.body.classList.contains('view-control-active')) {
                        navItem.style.display = 'none';
                    }
                    
                    // Si la sección activa se oculta, mostrar la pantalla de bienvenida
                    if (navLink.classList.contains('active')) {
                        showWelcomeScreen();
                        navLink.classList.remove('active');
                    }
                }
                
                // Guardar el estado en localStorage
                localStorage.setItem(`section-${sectionId}-visible`, this.checked);
            });
            
            // Verificar el estado guardado
            const savedState = localStorage.getItem(`section-${link.getAttribute('data-section')}-visible`);
            if (savedState === 'false') {
                toggle.checked = false;
                const navLink = navItem.querySelector('.nav-link');
                navLink.style.opacity = '0.5';
                navLink.style.pointerEvents = 'none';
                const section = document.getElementById(link.getAttribute('data-section'));
                if (section) section.style.display = 'none';
                
                // Si el control de vista está desactivado, ocultar completamente el elemento
                if (!document.body.classList.contains('view-control-active')) {
                    navItem.style.display = 'none';
                }
            }
        });
    }
    
    // Configurar el overlay de detalles para cursos, títulos y reconocimientos
    function setupDetailOverlay() {
        const overlay = document.getElementById('detail-overlay');
        if (!overlay) return; // Salir si no existe el overlay
        
        const overlayContent = overlay.querySelector('.detail-overlay-content');
        const overlayBody = overlay.querySelector('.detail-overlay-body');
        const closeBtn = overlay.querySelector('.detail-close-btn');
        const viewCertBtn = document.getElementById('view-certificate-btn');
        const downloadCertBtn = document.getElementById('download-certificate-btn');
        
        // Agregar evento de click a todos los elementos de cursos
        const courseItems = document.querySelectorAll('.course-item');
        courseItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // No activar si se hizo clic en el botón de toggle o en los detalles ya abiertos
                if (e.target.closest('.btn-toggle-details') || e.target.closest('.course-details')) {
                    return;
                }
                
                e.preventDefault(); // Prevenir comportamiento por defecto
                
                // Obtener los datos del curso
                const title = this.querySelector('h4').textContent;
                const meta = this.querySelector('.course-meta');
                const dates = meta ? meta.querySelector('.date').textContent.trim() : '-------------';
                const hours = meta ? meta.querySelector('.hours').textContent.trim() : '-------------';
                
                // Obtener detalles del curso (pueden estar ocultos)
                const detailsElement = this.querySelector('.course-details');
                let institution = '-------------';
                let contact = '-------------';
                let phone = '-------------';
                let email = '-------------';
                let description = '-------------';
                let certificateUrl = null;
                
                if (detailsElement) {
                    const detailItems = detailsElement.querySelectorAll('.detail-item');
                    
                    detailItems.forEach((item, index) => {
                        const label = item.querySelector('.detail-label');
                        const value = item.querySelector('.detail-value');
                        
                        if (label && value) {
                            const labelText = label.textContent.toLowerCase();
                            
                            if (labelText.includes('institución')) {
                                institution = value.textContent;
                            } else if (labelText.includes('contacto')) {
                                contact = value.textContent;
                            } else if (labelText.includes('teléfono')) {
                                phone = value.textContent;
                            } else if (labelText.includes('email')) {
                                email = value.textContent;
                            } else if (labelText.includes('descripción')) {
                                description = value.textContent;
                            }
                        }
                    });
                    
                    // Verificar si hay certificado
                    const certLink = detailsElement.querySelector('.detail-actions a');
                    if (certLink) {
                        certificateUrl = certLink.getAttribute('href');
                    }
                }
                
                // Si no hay descripción detallada, usar la descripción corta
                if (description === '-------------') {
                    const shortDesc = this.querySelector('.course-description');
                    if (shortDesc) {
                        description = shortDesc.textContent;
                    }
                }
                
                // Construir el contenido HTML para el overlay
                let html = `
                    <div class="detail-overlay-header">
                        <h3>${title}</h3>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Fechas:</span>
                        <span class="detail-value">${dates}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Horas:</span>
                        <span class="detail-value">${hours}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Institución:</span>
                        <span class="detail-value">${institution}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Contacto:</span>
                        <span class="detail-value">${contact}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Teléfono:</span>
                        <span class="detail-value">${phone}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${email}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Descripción:</span>
                        <p class="detail-value">${description}</p>
                    </div>
                `;
                
                // Actualizar el contenido del overlay
                overlayBody.innerHTML = html;
                
                // Configurar los botones de certificado
                if (certificateUrl) {
                    viewCertBtn.textContent = "Ver certificado";
                    viewCertBtn.classList.remove('disabled');
                    viewCertBtn.onclick = function() {
                        window.open(certificateUrl, '_blank');
                    };
                    
                    downloadCertBtn.classList.remove('disabled');
                    downloadCertBtn.onclick = function() {
                        // Crear un enlace temporal para descargar
                        const a = document.createElement('a');
                        a.href = certificateUrl;
                        a.download = title.replace(/\s+/g, '_') + '_certificado';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    };
                } else {
                    viewCertBtn.textContent = "No existe certificado";
                    viewCertBtn.classList.add('disabled');
                    viewCertBtn.onclick = null;
                    
                    downloadCertBtn.classList.add('disabled');
                    downloadCertBtn.onclick = null;
                }
                
                // Oscurecer la sección actual
                const cursosSection = document.getElementById('cursos');
                if (cursosSection) {
                    cursosSection.classList.add('dimmed');
                }
                
                // Mostrar el overlay
                overlay.classList.add('active');
            });
        });
        
        // Agregar evento de click a todos los elementos de educación
        const educationItems = document.querySelectorAll('.education-item');
        educationItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // No activar si se hizo clic en el botón de toggle o en los detalles ya abiertos
                if (e.target.closest('.btn-toggle-details') || e.target.closest('.education-details')) {
                    return;
                }
                
                e.preventDefault(); // Prevenir comportamiento por defecto
                
                // Obtener los datos del título
                const title = this.querySelector('h4').textContent;
                const institution = this.querySelector('h5').textContent;
                const meta = this.querySelector('.education-meta');
                const dates = meta ? meta.querySelector('.date').textContent.trim() : '-------------';
                
                // Obtener detalles de la educación (pueden estar ocultos)
                const detailsElement = this.querySelector('.education-details');
                let location = '-------------';
                let email = '-------------';
                let area = '-------------';
                let level = '-------------';
                let subarea = '-------------';
                let description = '-------------';
                let titleUrl = null;
                
                if (detailsElement) {
                    const detailItems = detailsElement.querySelectorAll('.detail-item');
                    
                    detailItems.forEach((item, index) => {
                        const label = item.querySelector('.detail-label');
                        const value = item.querySelector('.detail-value');
                        
                        if (label && value) {
                            const labelText = label.textContent.toLowerCase();
                            
                            if (labelText.includes('ubicación')) {
                                location = value.textContent;
                            } else if (labelText.includes('email')) {
                                email = value.textContent;
                            } else if (labelText.includes('área de conocimiento')) {
                                area = value.textContent;
                            } else if (labelText.includes('nivel de título')) {
                                level = value.textContent;
                            } else if (labelText.includes('subárea')) {
                                subarea = value.textContent;
                            } else if (labelText.includes('descripción')) {
                                description = value.textContent;
                            }
                        }
                    });
                    
                    // Verificar si hay título
                    const titleLink = detailsElement.querySelector('.detail-actions a');
                    if (titleLink) {
                        titleUrl = titleLink.getAttribute('href');
                    }
                }
                
                // Construir el contenido HTML para el overlay
                let html = `
                    <div class="detail-overlay-header">
                        <h3>${title}</h3>
                        <h4>${institution}</h4>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Fechas:</span>
                        <span class="detail-value">${dates}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Ubicación:</span>
                        <span class="detail-value">${location}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${email}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Área de Conocimiento:</span>
                        <span class="detail-value">${area}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Nivel de Título:</span>
                        <span class="detail-value">${level}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Subárea de Conocimiento:</span>
                        <span class="detail-value">${subarea}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Descripción:</span>
                        <p class="detail-value">${description}</p>
                    </div>
                `;
                
                // Actualizar el contenido del overlay
                overlayBody.innerHTML = html;
                
                // Configurar los botones de título
                if (titleUrl) {
                    viewCertBtn.textContent = "Ver título";
                    viewCertBtn.classList.remove('disabled');
                    viewCertBtn.onclick = function() {
                        window.open(titleUrl, '_blank');
                    };
                    
                    downloadCertBtn.textContent = "Descargar título";
                    downloadCertBtn.classList.remove('disabled');
                    downloadCertBtn.onclick = function() {
                        // Crear un enlace temporal para descargar
                        const a = document.createElement('a');
                        a.href = titleUrl;
                        a.download = title.replace(/\s+/g, '_') + '_titulo';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    };
                } else {
                    viewCertBtn.textContent = "No existe título";
                    viewCertBtn.classList.add('disabled');
                    viewCertBtn.onclick = null;
                    
                    downloadCertBtn.textContent = "Descargar título";
                    downloadCertBtn.classList.add('disabled');
                    downloadCertBtn.onclick = null;
                }
                
                // Oscurecer la sección actual
                const cursosSection = document.getElementById('cursos');
                if (cursosSection) {
                    cursosSection.classList.add('dimmed');
                }
                
                // Mostrar el overlay
                overlay.classList.add('active');
            });
        });
        
        // Agregar evento de click a todos los elementos de reconocimientos
        const recognitionItems = document.querySelectorAll('.recognition-item');
        recognitionItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // No activar si se hizo clic en el botón de toggle o en los detalles ya abiertos
                if (e.target.closest('.btn-toggle-details') || e.target.closest('.recognition-details')) {
                    return;
                }
                
                e.preventDefault(); // Prevenir comportamiento por defecto
                
                // Obtener los datos del reconocimiento
                const title = this.querySelector('h4').textContent;
                const meta = this.querySelector('.recognition-meta');
                const date = meta ? meta.querySelector('.date').textContent.trim() : '-------------';
                const shortDesc = this.querySelector('.recognition-description');
                
                // Obtener detalles del reconocimiento (pueden estar ocultos)
                const detailsElement = this.querySelector('.recognition-details');
                let entity = '-------------';
                let contact = '-------------';
                let phone = '-------------';
                let description = shortDesc ? shortDesc.textContent : '-------------';
                let recognitionUrl = null;
                
                if (detailsElement) {
                    const detailItems = detailsElement.querySelectorAll('.detail-item');
                    
                    detailItems.forEach((item, index) => {
                        const label = item.querySelector('.detail-label');
                        const value = item.querySelector('.detail-value');
                        
                        if (label && value) {
                            const labelText = label.textContent.toLowerCase();
                            
                            if (labelText.includes('entidad')) {
                                entity = value.textContent;
                            } else if (labelText.includes('otorgado por')) {
                                contact = value.textContent;
                            } else if (labelText.includes('teléfono')) {
                                phone = value.textContent;
                            } else if (labelText.includes('descripción completa')) {
                                description = value.textContent;
                            }
                        }
                    });
                    
                    // Verificar si hay reconocimiento
                    const recLink = detailsElement.querySelector('.detail-actions a');
                    if (recLink) {
                        recognitionUrl = recLink.getAttribute('href');
                    }
                }
                
                // Construir el contenido HTML para el overlay
                let html = `
                    <div class="detail-overlay-header">
                        <h3>${title}</h3>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Fecha:</span>
                        <span class="detail-value">${date}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Entidad Patrocinadora:</span>
                        <span class="detail-value">${entity}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Otorgado por:</span>
                        <span class="detail-value">${contact}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Teléfono de contacto:</span>
                        <span class="detail-value">${phone}</span>
                    </div>
                    <div class="detail-field">
                        <span class="detail-label">Descripción:</span>
                        <p class="detail-value">${description}</p>
                    </div>
                `;
                
                // Actualizar el contenido del overlay
                overlayBody.innerHTML = html;
                
                // Configurar los botones de reconocimiento
                if (recognitionUrl) {
                    viewCertBtn.textContent = "Ver reconocimiento";
                    viewCertBtn.classList.remove('disabled');
                    viewCertBtn.onclick = function() {
                        window.open(recognitionUrl, '_blank');
                    };
                    
                    downloadCertBtn.textContent = "Descargar reconocimiento";
                    downloadCertBtn.classList.remove('disabled');
                    downloadCertBtn.onclick = function() {
                        // Crear un enlace temporal para descargar
                        const a = document.createElement('a');
                        a.href = recognitionUrl;
                        a.download = title.replace(/\s+/g, '_') + '_reconocimiento';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    };
                } else {
                    viewCertBtn.textContent = "No existe reconocimiento";
                    viewCertBtn.classList.add('disabled');
                    viewCertBtn.onclick = null;
                    
                    downloadCertBtn.textContent = "Descargar reconocimiento";
                    downloadCertBtn.classList.add('disabled');
                    downloadCertBtn.onclick = null;
                }
                
                // Oscurecer la sección actual
                const reconocimientosSection = document.getElementById('reconocimientos');
                if (reconocimientosSection) {
                    reconocimientosSection.classList.add('dimmed');
                }
                
                // Mostrar el overlay
                overlay.classList.add('active');
            });
        });
        
        // Cerrar el overlay al hacer clic en el botón de cerrar
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                overlay.classList.remove('active');
                
                // Quitar el oscurecimiento de las secciones
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.remove('dimmed');
                });
            });
        }
        
        // Cerrar el overlay al hacer clic fuera del contenido
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                
                // Quitar el oscurecimiento de las secciones
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.remove('dimmed');
                });
            }
        });
    }
    
    // Manejo de botones de toggle para detalles
    const toggleButtons = document.querySelectorAll('.btn-toggle-details');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que el clic se propague
            
            const targetId = this.getAttribute('data-target');
            const detailsElement = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (!detailsElement) return;
            
            if (detailsElement.style.display === 'none' || !detailsElement.style.display) {
                detailsElement.style.display = 'block';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                detailsElement.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
    
    // Agregar efecto de glow a los botones
    const glowButtons = document.querySelectorAll('.btn-glow');
    glowButtons.forEach(button => {
        // Asegurar que el botón tiene el efecto de pulsación
        button.classList.add('btn-pulse');
    });
});