/**
 * Common JavaScript functions for exercises pages
 * Used across multiple pages in the MatematicasDiscretas project
 */

/**
 * Toggle visibility of exercise solutions
 * @param {string} solutionId - The ID of the solution element to toggle
 */
function toggleSolution(solutionId) {
    const solution = document.getElementById(solutionId);
    const button = solution.previousElementSibling.querySelector('.toggle-btn');
    const icon = button.querySelector('i');
    
    if (solution.style.display === 'none') {
        solution.style.display = 'block';
        button.innerHTML = '<i class="fas fa-chevron-down"></i> Ocultar Solución';
    } else {
        solution.style.display = 'none';
        button.innerHTML = '<i class="fas fa-chevron-right"></i> Ver Solución';
    }
}

/**
 * Toggle visibility of step-by-step solutions (used in translation exercises)
 * @param {string} stepId - The ID of the step element to toggle
 */
function toggleStep(stepId) {
    const stepContent = document.getElementById(stepId);
    const stepHeader = stepContent.previousElementSibling;
    const icon = stepHeader.querySelector('.toggle-icon');
    
    if (stepContent.style.display === 'none') {
        stepContent.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        stepContent.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

/**
 * Load logic connectors from JSON file (used in conectores.html)
 */
async function cargarConectores() {
    console.log('Iniciando carga de conectores...');
    
    try {
        // Get the base URL dynamically
        let baseUrl = '';
        if (typeof window !== 'undefined' && window.location) {
            console.log('URL actual:', window.location.href);
            console.log('Pathname:', window.location.pathname);
            
            const pathSegments = window.location.pathname.split('/').filter(segment => segment.length > 0);
            console.log('Segmentos de path:', pathSegments);
            
            // Check if we're on GitHub Pages (containing repo name in path)
            if (pathSegments.length > 0 && pathSegments[0] === 'MatematicasDiscretas-Virtual-05-N0279') {
                baseUrl = '/MatematicasDiscretas-Virtual-05-N0279';
                console.log('Detectado GitHub Pages, baseUrl:', baseUrl);
            } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                // Local development
                baseUrl = '';
                console.log('Detectado desarrollo local, baseUrl:', baseUrl);
            } else {
                // Try to detect from current path
                baseUrl = '';
                console.log('Usando baseUrl por defecto:', baseUrl);
            }
        }
        
        // Try multiple possible paths for the JSON file
        const possiblePaths = [
            `${baseUrl}/assets/js/conectores.json`,
            `/assets/js/conectores.json`,
            `./assets/js/conectores.json`,
            `../../../assets/js/conectores.json`
        ];
        
        console.log('Rutas a probar:', possiblePaths);
        
        let response = null;
        let lastError = null;
        
        for (const path of possiblePaths) {
            try {
                console.log('Intentando cargar:', path);
                response = await fetch(path);
                console.log('Respuesta para', path, ':', response.status, response.statusText);
                if (response.ok) {
                    console.log('¡Éxito cargando desde:', path);
                    break;
                }
            } catch (error) {
                console.log('Error al intentar', path, ':', error.message);
                lastError = error;
                continue;
            }
        }
        
        if (!response || !response.ok) {
            throw new Error(`No se pudo cargar conectores.json. Último error: ${lastError?.message || 'Unknown error'}`);
        }
        
        const conectores = await response.json();
        console.log('Conectores cargados:', conectores.length, 'elementos');
        
        const container = document.getElementById('tabla-conectores');
        conectores.forEach(c => {
            container.innerHTML += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 compact-card">
                    <div class="card-header">
                        <h5 class="mb-0">${c.nombre}</h5>
                        <div class="symbol">$${c.simbolo}$</div>
                    </div>
                    <div class="card-body">
                        <div class="truth-table">
                            <table class="table table-sm table-bordered compact-table">
                                <thead class="primary-header">
                                    <tr>
                                        <th class="text-center">$p$</th>
                                        <th class="text-center">$q$</th>
                                        <th class="text-center result-header">$${c.simbolo}$</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${['V', 'V', 'F', 'F'].map((val, i) => `
                                        <tr>
                                            <td class="text-center">${val}</td>
                                            <td class="text-center">${['V','F','V','F'][i]}</td>
                                            <td class="text-center ${c.tabla[i] === 'V' ? 'result-true' : 'result-false'}">${c.tabla[i]}</td>
                                        </tr>`).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        
        // Update MathJax after loading content
        if (typeof MathJax !== 'undefined') {
            MathJax.typeset();
        }
    } catch (error) {
        console.error('Error al cargar los conectores:', error);
        document.getElementById('tabla-conectores').innerHTML = 
            '<div class="col-12"><div class="alert alert-danger">Error al cargar los conectores lógicos.</div></div>';
    }
}

// Auto-initialize functions based on page content
document.addEventListener('DOMContentLoaded', function() {
    // Load connectors if the container exists
    if (document.getElementById('tabla-conectores')) {
        cargarConectores();
    }
});
