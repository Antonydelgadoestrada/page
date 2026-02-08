// ============================================
// VALIDACIÓN Y FORMULARIO
// ============================================

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('form-message');
const submitBtn = document.querySelector('.submit-button');

/**
 * Validación en tiempo real de campos
 */
function validateField(fieldName, value) {
    const errors = {};
    
    switch(fieldName) {
        case 'nombre':
            if (!value || value.trim().length < 3) {
                errors.nombre = 'El nombre debe tener al menos 3 caracteres';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value || !emailRegex.test(value)) {
                errors.email = 'Email inválido';
            }
            break;
            
        case 'asunto':
            if (!value || value.trim().length < 5) {
                errors.asunto = 'El asunto debe tener al menos 5 caracteres';
            }
            break;
            
        case 'mensaje':
            if (!value || value.trim().length < 10) {
                errors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
            }
            break;
            
        case 'terminos':
            if (!document.getElementById('terminos').checked) {
                errors.terminos = 'Debes aceptar los términos';
            }
            break;
    }
    
    return errors;
}

/**
 * Mostrar/ocultar errores en campos
 */
function showFieldError(fieldName, hasError, message = '') {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    const formGroup = field.parentElement;
    
    if (!field) return;
    
    if (hasError) {
        formGroup.classList.add('error');
        if (errorElement && message) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    } else {
        formGroup.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
}

/**
 * Validación al abandonar campo (blur)
 */
function setupFieldValidation() {
    const fields = ['nombre', 'email', 'asunto', 'mensaje', 'terminos'];
    
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('blur', () => {
                const value = element.value;
                const errors = validateField(field, value);
                const hasError = Object.keys(errors).length > 0;
                showFieldError(field, hasError, errors[field] || '');
            });
        }
    });
}

/**
 * Validación completa del formulario
 */
function validateForm() {
    const fields = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        asunto: document.getElementById('asunto').value,
        mensaje: document.getElementById('mensaje').value,
        terminos: document.getElementById('terminos').checked
    };
    
    let allErrors = {};
    let isValid = true;
    
    Object.keys(fields).forEach(field => {
        const errors = validateField(field, fields[field]);
        if (Object.keys(errors).length > 0) {
            allErrors = { ...allErrors, ...errors };
            isValid = false;
            showFieldError(field, true, errors[field]);
        } else {
            showFieldError(field, false);
        }
    });
    
    return isValid;
}

/**
 * Envío del formulario
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
        showMessage('Por favor, completa todos los campos correctamente', 'error');
        return;
    }
    
    // Desabilitar botón durante envío
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    try {
        const formData = new FormData(contactForm);
        
        const response = await fetch('backend/handlers/form-handler.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage(data.message, 'success');
            contactForm.reset();
            // Limpiar errores
            document.querySelectorAll('.form-group.error').forEach(group => {
                group.classList.remove('error');
            });
            document.querySelectorAll('.error-message').forEach(msg => {
                msg.classList.remove('show');
            });
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al enviar el formulario. Intenta nuevamente.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar';
    }
}

/**
 * Mostrar mensaje de resultado
 */
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        if (type === 'success') {
            formMessage.className = 'form-message';
        }
    }, 5000);
    
    // Scroll al mensaje
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================
// NAVEGACIÓN MÓVIL
// ============================================

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ============================================
// ANIMACIONES AL SCROLL - INTERSECTION OBSERVER
// ============================================

/**
 * Sistema mejorado de animaciones con Intersection Observer
 * Las animaciones se disparan cuando el elemento entra en el viewport
 */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Obtener clase de animación del elemento
            const animations = entry.target.className.match(/fade-in(?:-\w+)?/g);
            
            if (animations) {
                // Aplicar la animación
                entry.target.style.animationPlayState = 'running';
                
                // Dejar de observar después de animar
                animationObserver.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

/**
 * Observar todos los elementos con clases de animación
 */
document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar elementos a animar
    const elementsToAnimate = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    
    elementsToAnimate.forEach(element => {
        animationObserver.observe(element);
    });
});

// ============================================
// TABS DE PROYECTOS
// ============================================

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
        // Remover clase active de todos los botones
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Agregar clase active al botón clickeado
        this.classList.add('active');
        
        // Mostrar detalle correspondiente con animaciones
        const tab = this.getAttribute('data-tab');
        showProjectDetail(tab);
    });
});

const projects = {
    planos: {
        title: 'Planos Técnicos Detallados',
        desc: 'Realizamos planos técnicos detallados para requerimientos de precisión y cumplimiento de normas. Entregamos documentación lista para fabricación y validación.',
        image: 'assets/images/planos-tecnicos-detallados.png',
    },
    proceso: {
        title: 'Montaje y Cableado',
        desc: 'Montaje, cableado y verificación de cada tablero eléctrico con controles de calidad estrictos y pruebas funcionales.',
        image: 'assets/images/montaje-cableado.png'
    },
    resultado: {
        title: 'Entrega y Puesta en Marcha',
        desc: 'Entrega final de tableros listos para operación, con pruebas realizadas y documentación técnica completa.',
        image: 'assets/images/entrega y puesta en marcha.png'
    }
};

function showProjectDetail(key) {
    const detail = document.getElementById('proyecto-detail');
    const img = document.getElementById('detail-image');
    const title = document.getElementById('detail-title');
    const desc = document.getElementById('detail-desc');
    const inner = document.querySelector('.detail-inner');

    if (!projects[key]) return;

    // Set content
    title.textContent = projects[key].title;
    desc.textContent = projects[key].desc;
    img.style.backgroundImage = `url('${projects[key].image}')`;
    img.style.backgroundSize = 'cover';
    img.style.backgroundPosition = 'center';

    // Orientation: proceso = image right (reverse)
    if (key === 'proceso') {
        inner.classList.add('reverse');
    } else {
        inner.classList.remove('reverse');
    }

    // Prepare animations
    img.classList.remove('animate-left','animate-right');
    title.classList.remove('animate-wow');
    desc.classList.remove('animate-wow');

    // Force reflow
    void img.offsetWidth;

    // Add animations
    if (key === 'proceso') {
        img.classList.add('animate-right');
    } else {
        img.classList.add('animate-left');
    }
    title.classList.add('animate-wow');
    desc.classList.add('animate-wow');

    // Show container
    detail.style.display = 'block';

    // Smooth scroll to detail
    detail.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Mostrar por defecto la primera pestaña al cargar
document.addEventListener('DOMContentLoaded', () => {
    const defaultBtn = document.querySelector('.tab-button.active') || document.querySelector('.tab-button[data-tab="planos"]');
    if (defaultBtn) {
        showProjectDetail(defaultBtn.getAttribute('data-tab'));
    }
});

// ============================================
// SMOOTH SCROLL PARA LINKS INTERNOS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// TABS DE EQUIPOS ELÉCTRICOS
// ============================================

document.querySelectorAll('.equipo-tabs .tab-button').forEach(button => {
    button.addEventListener('click', function() {
        // Remover clase active de todos los botones
        document.querySelectorAll('.equipo-tabs .tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Agregar clase active al botón clickeado
        this.classList.add('active');
        
        // Mostrar detalle correspondiente con animaciones
        const tab = this.getAttribute('data-tab');
        showEquipmentDetail(tab);
    });
});

const equipments = {
    domestico: {
        title: 'Doméstico',
        desc: 'Ofrecemos tableros domésticos en cajas de plástico resistente, diseñados para la protección y distribución eléctrica en viviendas. Son duraderos y personalizables según la cantidad de equipos a instalar, garantizando una solución segura y funcional.',
        image: 'assets/images/tablero-electrico-domestico.png',
    },
    adosado: {
        title: 'Adosado',
        desc: 'Los productos de HLN cumplen con las normas vigentes. Están diseñados para facilitar inspecciones, pruebas y mantenimiento, e incluyen una placa base para el montaje del sistema de barras de interruptores.',
        image: 'assets/images/equipo-adosado.jpg'
    },
    autosoportado: {
        title: 'Autosoportado',
        desc: 'Ofrecemos tableros autosoportados diseñados para instalaciones industriales y comerciales de alta demanda. Montados sobre una base sólida que brinda estabilidad, están fabricados en planchas galvanizadas y cuentan con puertas con cerraduras, ventilación adecuada y perforaciones pre troqueladas para el ingreso y salida de cables.',
        image: 'assets/images/equipo-autosoportado.jpg'
    },
    empotrables: {
        title: 'Empotrables',
        desc: 'Ofrecemos tableros empotrables para llaves termomagnéticas, ideales para centralizar líneas de distribución y circuitos en instalaciones residenciales, industriales y pequeñas comerciales de baja carga. Fabricados en planchas galvanizadas, incluyen perforaciones pre troqueladas de cables y se fijan a la pared.',
        image: 'assets/images/equipo-empotrables.jpg'
    }
};

function showEquipmentDetail(key) {
    const detail = document.getElementById('equipo-detail');
    const img = document.getElementById('equipo-detail-image');
    const title = document.getElementById('equipo-detail-title');
    const desc = document.getElementById('equipo-detail-desc');

    if (!equipments[key]) return;

    // Set content
    title.textContent = equipments[key].title;
    desc.textContent = equipments[key].desc;
    img.style.backgroundImage = `url('${equipments[key].image}')`;
    img.style.backgroundSize = 'cover';
    img.style.backgroundPosition = 'center';

    // Prepare animations
    img.classList.remove('animate-left','animate-right');
    title.classList.remove('animate-wow');
    desc.classList.remove('animate-wow');

    // Force reflow
    void img.offsetWidth;

    // Add animations
    img.classList.add('animate-left');
    title.classList.add('animate-wow');
    desc.classList.add('animate-wow');

    // Show container
    detail.style.display = 'block';

    // Smooth scroll to detail
    detail.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Mostrar por defecto la primera pestaña al cargar
document.addEventListener('DOMContentLoaded', () => {
    const defaultBtn = document.querySelector('.equipo-tabs .tab-button.active') || document.querySelector('.equipo-tabs .tab-button[data-tab="domestico"]');
    if (defaultBtn) {
        showEquipmentDetail(defaultBtn.getAttribute('data-tab'));
    }
});

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Setup validación de formulario
    setupFieldValidation();
    
    // Agregar listener al submit
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Log de inicialización
    console.log('✅ Página HLN Ingeniería iniciada correctamente');
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada:', event.reason);
});

/* ============================================
   WHATSAPP FLOAT - Inicialización
   ============================================ */

/**
 * Inicializa el botón flotante de WhatsApp.
 * @param {string} number - Número en formato internacional sin + (ej: '51981768092')
 * @param {string} message - Mensaje inicial
 */
function initWhatsAppFloat(number, message) {
    const float = document.getElementById('whatsappFloat');
    if (!float) return;
    const anchor = float.querySelector('a');
    if (!anchor) return;

    const encoded = encodeURIComponent(message || 'Hola, quiero más información');
    anchor.href = `https://wa.me/${number}?text=${encoded}`;

    // Pequeña animación de aparición (fade/pulse)
    float.style.opacity = '0';
    float.style.transform = 'translateY(8px)';
    setTimeout(() => {
        float.style.transition = 'opacity 300ms ease, transform 300ms ease';
        float.style.opacity = '1';
        float.style.transform = 'translateY(0)';
    }, 250);
}

/* ============================================
   CARRUSEL DE CLIENTES - INFINITO
   - Duplica los items para crear un loop perfecto
   - Calcula duración basada en ancho total
   - Pausa al hover
   ============================================ */
function initClientsCarousel() {
    const track = document.querySelector('.clients-track');
    if (!track) return;

    // Duplicar contenido solo una vez para efecto infinito
    if (!track.dataset.inited) {
        track.innerHTML = track.innerHTML + track.innerHTML;
        track.dataset.inited = '1';
    }

    // Calcular ancho original (la mitad del track duplicado)
    const originalWidth = Math.floor(track.scrollWidth / 2) || 0;

    // Usar desplazamiento en píxeles para evitar cortes: guardamos la distancia exacta
    track.style.setProperty('--scroll-distance', originalWidth + 'px');

    // Establecer duración en segundos (heurística: más rápida - 200px por segundo)
    const duration = Math.max(5, Math.round(originalWidth / 200));
    track.style.setProperty('--scroll-duration', duration + 's');

    // Recalcular duración/distancia al redimensionar (sin volver a duplicar)
    if (track._clientsResizeHandler) {
        window.removeEventListener('resize', track._clientsResizeHandler);
    }

    track._clientsResizeHandler = () => {
        clearTimeout(track._clientsResizeTimeout);
        track._clientsResizeTimeout = setTimeout(() => {
            const w = Math.floor(track.scrollWidth / 2) || 0;
            track.style.setProperty('--scroll-distance', w + 'px');
            const d = Math.max(5, Math.round(w / 200));
            track.style.setProperty('--scroll-duration', d + 's');
        }, 200);
    };

    window.addEventListener('resize', track._clientsResizeHandler, { passive: true });
}

/* ============================================
   CARRUSEL DE PROVEEDORES - INFINITO (MÁS LENTO)
   - Similar a clientes pero con duración mayor
   - 6 items proveedores
   ============================================ */
function initProvidersCarousel() {
    const track = document.querySelector('.providers-track');
    if (!track) return;

    // Duplicar contenido solo una vez para efecto infinito
    if (!track.dataset.inited) {
        track.innerHTML = track.innerHTML + track.innerHTML;
        track.dataset.inited = '1';
    }

    // Calcular ancho original (la mitad del track duplicado)
    const originalWidth = Math.floor(track.scrollWidth / 2) || 0;

    // Usar desplazamiento en píxeles para evitar cortes
    track.style.setProperty('--providers-distance', originalWidth + 'px');

    // Establecer duración más lenta para proveedores (heurística: ~150px por segundo)
    const duration = Math.max(10, Math.round(originalWidth / 150));
    track.style.setProperty('--providers-duration', duration + 's');

    // Recalcular duración/distancia al redimensionar (sin volver a duplicar)
    if (track._providersResizeHandler) {
        window.removeEventListener('resize', track._providersResizeHandler);
    }

    track._providersResizeHandler = () => {
        clearTimeout(track._providersResizeTimeout);
        track._providersResizeTimeout = setTimeout(() => {
            const w = Math.floor(track.scrollWidth / 2) || 0;
            track.style.setProperty('--providers-distance', w + 'px');
            const d = Math.max(10, Math.round(w / 150));
            track.style.setProperty('--providers-duration', d + 's');
        }, 200);
    };

    window.addEventListener('resize', track._providersResizeHandler, { passive: true });
}

function initGalleryCarousel() {
    const galleryData = [
        { type: 'image', src: 'assets/images/gallery/foto1.jpg', alt: 'Proyecto 1' },
        { type: 'image', src: 'assets/images/gallery/foto2.jpg', alt: 'Proyecto 2' },
        { type: 'video', src: 'assets/videos/video1.mp4', alt: 'Video 1' },
        { type: 'image', src: 'assets/images/gallery/foto3.jpg', alt: 'Proyecto 3' },
        { type: 'image', src: 'assets/images/gallery/foto4.jpg', alt: 'Proyecto 4' },
        { type: 'video', src: 'assets/videos/video2.mp4', alt: 'Video 2' },
        { type: 'image', src: 'assets/images/gallery/foto5.jpg', alt: 'Proyecto 5' },
        { type: 'image', src: 'assets/images/gallery/foto6.jpg', alt: 'Proyecto 6' }
    ];

    let currentIndex = 0;

    // Elementos del DOM
    const galleryDisplay = document.getElementById('galleryDisplay');
    const playBtn = document.getElementById('playBtn');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxDisplay = document.getElementById('lightboxDisplay');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryMain = document.querySelector('.gallery-main');

    function updateGallery(index) {
        currentIndex = (index + galleryData.length) % galleryData.length;
        const item = galleryData[currentIndex];

        // Actualizar display principal
        galleryDisplay.innerHTML = '';
        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt;
            img.className = 'gallery-img';
            galleryDisplay.appendChild(img);
            playBtn.style.display = 'none';
        } else {
            const video = document.createElement('video');
            video.src = item.src;
            video.className = 'gallery-video';
            galleryDisplay.appendChild(video);
            playBtn.style.display = 'flex';
        }

        // Actualizar miniaturas
        thumbnails.forEach((thumb, idx) => {
            thumb.classList.toggle('active', idx === currentIndex);
        });

        // Actualizar lightbox display
        lightboxDisplay.innerHTML = '';
        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt;
            img.className = 'lightbox-img';
            lightboxDisplay.appendChild(img);
        } else {
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            video.className = 'lightbox-video';
            lightboxDisplay.appendChild(video);
        }
    }

    // Event listeners para flechas
    galleryPrev?.addEventListener('click', () => updateGallery(currentIndex - 1));
    galleryNext?.addEventListener('click', () => updateGallery(currentIndex + 1));

    // Event listeners para miniaturas
    thumbnails.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => updateGallery(idx));
    });

    // Event listener para abrir lightbox
    galleryMain?.addEventListener('click', () => {
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Event listeners para lightbox
    lightboxClose?.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    lightboxPrev?.addEventListener('click', () => updateGallery(currentIndex - 1));
    lightboxNext?.addEventListener('click', () => updateGallery(currentIndex + 1));

    // Cerrar lightbox al hacer click fuera
    lightboxModal?.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Cerrar lightbox con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        // Navegar con flechas
        if (lightboxModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') updateGallery(currentIndex - 1);
            if (e.key === 'ArrowRight') updateGallery(currentIndex + 1);
        }
    });

    // Playback for video in main gallery
    playBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const video = galleryDisplay.querySelector('video');
        if (video) {
            video.play();
        }
    });

    // Inicializar
    updateGallery(0);
}

// ============================================
// ANIMACIÓN DE NÚMEROS (Conteo)
// ============================================

function animateCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                entry.target.setAttribute('data-animated', 'true');
                const target = parseInt(entry.target.getAttribute('data-target'));
                const suffix = entry.target.getAttribute('data-suffix') || '';
                const duration = 2000; // 2 segundos
                const start = Date.now();
                
                const animate = () => {
                    const now = Date.now();
                    const progress = Math.min((now - start) / duration, 1);
                    const current = Math.floor(progress * target);
                    
                    entry.target.textContent = current + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        entry.target.textContent = target + suffix;
                    }
                };
                
                animate();
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(number => observer.observe(number));
}

document.addEventListener('DOMContentLoaded', () => {
    initClientsCarousel();
    initProvidersCarousel();
    initGalleryCarousel();
    animateCountUp();
});

// Inicializar con el número proporcionado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    try {
        initWhatsAppFloat('51981768092', 'Hola HLN, quiero más info');
    } catch (e) {
        console.error('No se pudo inicializar WhatsApp float', e);
    }
});
