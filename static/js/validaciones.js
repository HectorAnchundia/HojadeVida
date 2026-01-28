/**
 * Validaciones para el formulario de la hoja de vida
 * Implementa restricciones para fechas y estados en diferentes secciones
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configurar validaciones para experiencia laboral
    setupExperienciaLaboral();
    
    // Configurar validaciones para estudios
    setupEstudios();
    
    // Configurar validaciones para cursos
    setupCursos();
    
    // Verificar estados actuales al cargar la página
    verificarEstadosActuales();
});

/**
 * Obtiene la fecha actual del sistema
 * @returns {Date} Fecha actual
 */
function obtenerFechaActual() {
    return new Date();
}

/**
 * Calcula la fecha mínima permitida para experiencia laboral (13 años después de la fecha de nacimiento)
 * @param {Date} fechaNacimiento - Fecha de nacimiento del usuario
 * @returns {Date} Fecha mínima permitida
 */
function calcularFechaMinimaExperiencia(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    
    const fechaMinima = new Date(fechaNacimiento);
    fechaMinima.setFullYear(fechaMinima.getFullYear() + 13);
    return fechaMinima;
}

/**
 * Configura las validaciones para la sección de experiencia laboral
 */
function setupExperienciaLaboral() {
    // Obtener elementos del formulario de experiencia laboral
    const formExperiencia = document.getElementById('form-experiencia-laboral');
    if (!formExperiencia) return;
    
    const fechaInicioInput = formExperiencia.querySelector('input[name="fechainiciocontrato"]');
    const fechaFinInput = formExperiencia.querySelector('input[name="fechafincontrato"]');
    const trabajoActualCheckbox = formExperiencia.querySelector('input[name="trabajo_actual"]');
    
    if (!fechaInicioInput || !fechaFinInput || !trabajoActualCheckbox) return;
    
    // Obtener fecha de nacimiento del usuario (desde datos personales)
    const fechaNacimientoStr = document.getElementById('fecha-nacimiento-usuario')?.value;
    const fechaNacimiento = fechaNacimientoStr ? new Date(fechaNacimientoStr) : null;
    
    // Configurar fecha mínima para inicio de contrato (13 años después del nacimiento)
    if (fechaNacimiento) {
        const fechaMinima = calcularFechaMinimaExperiencia(fechaNacimiento);
        fechaInicioInput.min = fechaMinima.toISOString().split('T')[0];
    }
    
    // Configurar fecha máxima para inicio de contrato (fecha actual)
    const fechaActual = obtenerFechaActual();
    const fechaActualStr = fechaActual.toISOString().split('T')[0];
    fechaInicioInput.max = fechaActualStr;
    
    // Validar fecha de inicio al cambiar
    fechaInicioInput.addEventListener('change', function() {
        const fechaInicio = new Date(this.value);
        
        // Validar que la fecha no sea menor a 13 años después del nacimiento
        if (fechaNacimiento) {
            const fechaMinima = calcularFechaMinimaExperiencia(fechaNacimiento);
            if (fechaInicio < fechaMinima) {
                alert('La fecha de inicio no puede ser menor a 13 años después de su fecha de nacimiento.');
                this.value = '';
                return;
            }
        }
        
        // Validar que la fecha no sea futura
        if (fechaInicio > fechaActual) {
            alert('La fecha de inicio no puede ser futura.');
            this.value = '';
            return;
        }
        
        // Actualizar fecha mínima para fin de contrato
        if (fechaFinInput) {
            fechaFinInput.min = this.value;
        }
    });
    
    // Validar fecha de fin al cambiar
    fechaFinInput.addEventListener('change', function() {
        const fechaFin = new Date(this.value);
        const fechaInicio = new Date(fechaInicioInput.value);
        const fechaActual = obtenerFechaActual();
        
        // Validar que la fecha fin sea posterior a la fecha inicio
        if (fechaFin < fechaInicio) {
            alert('La fecha de finalización debe ser posterior a la fecha de inicio.');
            this.value = '';
            return;
        }
        
        // Si la fecha es futura
        if (fechaFin > fechaActual) {
            // Verificar si ya existe otro trabajo marcado como actual
            const otrosTrabajoActual = document.querySelectorAll('input[name="trabajo_actual"]:checked');
            if (otrosTrabajoActual.length > 0 && !trabajoActualCheckbox.checked) {
                alert('Ya existe otro trabajo marcado como actual. Solo puede tener un trabajo actual a la vez.');
                this.value = '';
                return;
            }
            
            // Marcar automáticamente como trabajo actual y deshabilitar el checkbox
            trabajoActualCheckbox.checked = true;
            trabajoActualCheckbox.disabled = true;
        } else {
            // Si la fecha no es futura, habilitar el checkbox
            trabajoActualCheckbox.disabled = false;
            
            // Si la fecha de fin es un día después de la fecha actual, desmarcar "trabajo actual"
            const unDiaDespues = new Date(fechaActual);
            unDiaDespues.setDate(unDiaDespues.getDate() + 1);
            
            if (fechaFin.toISOString().split('T')[0] === unDiaDespues.toISOString().split('T')[0]) {
                trabajoActualCheckbox.checked = false;
            }
        }
    });
    
    // Manejar cambios en el checkbox de trabajo actual
    trabajoActualCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Verificar si ya existe otro trabajo marcado como actual
            const otrosTrabajoActual = document.querySelectorAll('input[name="trabajo_actual"]:checked');
            if (otrosTrabajoActual.length > 1) {
                // Desmarcar los otros trabajos actuales (excepto este)
                otrosTrabajoActual.forEach(checkbox => {
                    if (checkbox !== this) {
                        checkbox.checked = false;
                        
                        // Si el otro trabajo tenía fecha futura, limpiar esa fecha
                        const otroFormGroup = checkbox.closest('.form-group') || checkbox.closest('.mb-3');
                        if (otroFormGroup) {
                            const otroFechaFinInput = otroFormGroup.querySelector('input[name="fechafincontrato"]');
                            if (otroFechaFinInput) {
                                const otroFechaFin = new Date(otroFechaFinInput.value);
                                const fechaActual = obtenerFechaActual();
                                
                                if (otroFechaFin > fechaActual) {
                                    otroFechaFinInput.value = '';
                                }
                            }
                        }
                    }
                });
            }
            
            // Permitir fechas futuras para fin de contrato
            if (fechaFinInput) {
                fechaFinInput.max = ''; // Quitar restricción de fecha máxima
            }
        } else {
            // Si se desmarca, verificar que la fecha de fin no sea futura
            if (fechaFinInput && fechaFinInput.value) {
                const fechaFin = new Date(fechaFinInput.value);
                const fechaActual = obtenerFechaActual();
                
                if (fechaFin > fechaActual) {
                    alert('No puede desmarcar la opción "Actual" si la fecha de finalización es futura.');
                    this.checked = true; // Volver a marcar
                    return;
                }
            }
            
            // Restringir fechas futuras para fin de contrato
            if (fechaFinInput) {
                fechaFinInput.max = obtenerFechaActual().toISOString().split('T')[0];
            }
        }
    });
}

/**
 * Configura las validaciones para la sección de estudios
 */
function setupEstudios() {
    // Obtener elementos del formulario de estudios
    const formEstudios = document.getElementById('form-estudios');
    if (!formEstudios) return;
    
    const fechaInicioInput = formEstudios.querySelector('input[name="fecha_inicio"]');
    const fechaFinInput = formEstudios.querySelector('input[name="fecha_fin"]');
    const enCursoCheckbox = formEstudios.querySelector('input[name="en_curso"]');
    
    if (!fechaInicioInput || !fechaFinInput || !enCursoCheckbox) return;
    
    // Validar fecha de inicio al cambiar
    fechaInicioInput.addEventListener('change', function() {
        const fechaInicio = new Date(this.value);
        
        // Actualizar fecha mínima para fin de estudio
        if (fechaFinInput) {
            fechaFinInput.min = this.value;
        }
    });
    
    // Manejar cambios en el checkbox de estudio en curso
    enCursoCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Verificar si ya existen 2 estudios en curso
            const estudiosEnCurso = document.querySelectorAll('input[name="en_curso"]:checked');
            if (estudiosEnCurso.length > 2) {
                alert('Solo puede tener un máximo de 2 estudios en curso simultáneamente.');
                this.checked = false;
                return;
            }
            
            // Permitir fecha de fin vacía o futura
            if (fechaFinInput) {
                fechaFinInput.value = '';
                fechaFinInput.required = false;
                fechaFinInput.disabled = true;
            }
        } else {
            // Requerir fecha de fin cuando no está en curso
            if (fechaFinInput) {
                fechaFinInput.required = true;
                fechaFinInput.disabled = false;
            }
        }
    });
    
    // Validar fecha de fin al cambiar
    fechaFinInput.addEventListener('change', function() {
        const fechaFin = new Date(this.value);
        const fechaInicio = new Date(fechaInicioInput.value);
        const fechaActual = obtenerFechaActual();
        
        // Validar que la fecha fin sea posterior a la fecha inicio
        if (fechaFin < fechaInicio) {
            alert('La fecha de finalización debe ser posterior a la fecha de inicio.');
            this.value = '';
            return;
        }
        
        // Si la fecha es futura, verificar que esté marcado como "en curso"
        if (fechaFin > fechaActual && !enCursoCheckbox.checked) {
            alert('Para fechas futuras, debe marcar el estudio como "En curso".');
            this.value = '';
            return;
        }
        
        // Si la fecha es un día antes de la fecha actual, quitar automáticamente "en curso"
        const unDiaAntes = new Date(fechaActual);
        unDiaAntes.setDate(unDiaAntes.getDate() - 1);
        
        if (fechaFin.toISOString().split('T')[0] === unDiaAntes.toISOString().split('T')[0]) {
            enCursoCheckbox.checked = false;
        }
    });
}

/**
 * Configura las validaciones para la sección de cursos
 */
function setupCursos() {
    // Obtener elementos del formulario de cursos
    const formCursos = document.getElementById('form-cursos');
    if (!formCursos) return;
    
    const fechaInicioInput = formCursos.querySelector('input[name="fechainicio"]');
    const fechaFinInput = formCursos.querySelector('input[name="fechafin"]');
    const enCursoCheckbox = formCursos.querySelector('input[name="en_curso"]');
    
    if (!fechaInicioInput || !fechaFinInput || !enCursoCheckbox) return;
    
    // Validar fecha de inicio al cambiar
    fechaInicioInput.addEventListener('change', function() {
        const fechaInicio = new Date(this.value);
        
        // Actualizar fecha mínima para fin de curso
        if (fechaFinInput) {
            fechaFinInput.min = this.value;
        }
    });
    
    // Manejar cambios en el checkbox de curso en curso
    enCursoCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Verificar si ya existen 3 cursos en curso
            const cursosEnCurso = document.querySelectorAll('input[name="en_curso"]:checked');
            if (cursosEnCurso.length > 3) {
                alert('Solo puede tener un máximo de 3 cursos en curso simultáneamente.');
                this.checked = false;
                return;
            }
            
            // Permitir fecha de fin futura
            if (fechaFinInput) {
                fechaFinInput.value = '';
                fechaFinInput.required = true; // Los cursos siempre necesitan fecha de fin
                fechaFinInput.disabled = false;
            }
        } else {
            // Requerir fecha de fin cuando no está en curso
            if (fechaFinInput) {
                fechaFinInput.required = true;
                fechaFinInput.disabled = false;
            }
        }
    });
    
    // Validar fecha de fin al cambiar
    fechaFinInput.addEventListener('change', function() {
        const fechaFin = new Date(this.value);
        const fechaInicio = new Date(fechaInicioInput.value);
        const fechaActual = obtenerFechaActual();
        
        // Validar que la fecha fin sea posterior a la fecha inicio
        if (fechaFin < fechaInicio) {
            alert('La fecha de finalización debe ser posterior a la fecha de inicio.');
            this.value = '';
            return;
        }
        
        // Si la fecha es futura, verificar que esté marcado como "en curso"
        if (fechaFin > fechaActual && !enCursoCheckbox.checked) {
            alert('Para fechas futuras, debe marcar el curso como "En curso".');
            this.value = '';
            return;
        }
        
        // Si la fecha es un día antes de la fecha actual, quitar automáticamente "en curso"
        const unDiaAntes = new Date(fechaActual);
        unDiaAntes.setDate(unDiaAntes.getDate() - 1);
        
        if (fechaFin.toISOString().split('T')[0] === unDiaAntes.toISOString().split('T')[0]) {
            enCursoCheckbox.checked = false;
        }
    });
}

/**
 * Verifica los estados actuales de todos los formularios al cargar la página
 */
function verificarEstadosActuales() {
    const fechaActual = obtenerFechaActual();
    
    // Verificar trabajos actuales
    const trabajosActuales = document.querySelectorAll('input[name="trabajo_actual"]:checked');
    if (trabajosActuales.length > 1) {
        // Mantener solo el primer trabajo como actual
        for (let i = 1; i < trabajosActuales.length; i++) {
            trabajosActuales[i].checked = false;
            
            // Si el trabajo tenía fecha futura, limpiar esa fecha
            const formGroup = trabajosActuales[i].closest('.form-group') || trabajosActuales[i].closest('.mb-3');
            if (formGroup) {
                const fechaFinInput = formGroup.querySelector('input[name="fechafincontrato"]');
                if (fechaFinInput && fechaFinInput.value) {
                    const fechaFin = new Date(fechaFinInput.value);
                    if (fechaFin > fechaActual) {
                        fechaFinInput.value = '';
                    }
                }
            }
        }
    }
    
    // Verificar fechas futuras en experiencia laboral y bloquear checkbox si es necesario
    const fechasFinExperiencia = document.querySelectorAll('input[name="fechafincontrato"]');
    
    fechasFinExperiencia.forEach(input => {
        if (input.value) {
            const fechaFin = new Date(input.value);
            
            if (fechaFin > fechaActual) {
                // Buscar el checkbox de trabajo actual correspondiente
                const formGroup = input.closest('.form-group') || input.closest('.mb-3');
                if (formGroup) {
                    const trabajoActualCheckbox = formGroup.querySelector('input[name="trabajo_actual"]');
                    if (trabajoActualCheckbox) {
                        // Verificar si ya existe otro trabajo marcado como actual
                        const otrosTrabajoActual = document.querySelectorAll('input[name="trabajo_actual"]:checked');
                        
                        if (otrosTrabajoActual.length > 0 && otrosTrabajoActual[0] !== trabajoActualCheckbox) {
                            // Si ya hay otro trabajo actual, limpiar esta fecha futura
                            input.value = '';
                        } else {
                            // Marcar como trabajo actual y bloquear
                            trabajoActualCheckbox.checked = true;
                            trabajoActualCheckbox.disabled = true;
                        }
                    }
                }
            }
        }
    });
    
    // Verificar estudios en curso
    const estudiosEnCurso = document.querySelectorAll('input[name="en_curso"]:checked');
    if (estudiosEnCurso.length > 2) {
        // Mantener solo los dos primeros estudios como en curso
        for (let i = 2; i < estudiosEnCurso.length; i++) {
            estudiosEnCurso[i].checked = false;
            
            // Habilitar el campo de fecha fin correspondiente
            const formGroup = estudiosEnCurso[i].closest('.form-group') || estudiosEnCurso[i].closest('.mb-3');
            if (formGroup) {
                const fechaFinInput = formGroup.querySelector('input[name="fecha_fin"]');
                if (fechaFinInput) {
                    fechaFinInput.disabled = false;
                    fechaFinInput.required = true;
                }
            }
        }
    }
    
    // Verificar cursos en curso
    const cursosEnCurso = document.querySelectorAll('input[name="en_curso"]:checked');
    if (cursosEnCurso.length > 3) {
        // Mantener solo los tres primeros cursos como en curso
        for (let i = 3; i < cursosEnCurso.length; i++) {
            cursosEnCurso[i].checked = false;
        }
    }
}