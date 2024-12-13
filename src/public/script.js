const estadoSelect = document.getElementById('estado');
const municipioSelect = document.getElementById('municipio');
const svgContainer = document.getElementById('estado-svg');

function clearSelectOptions(selectElement, defaultOptionText) {
    selectElement.innerHTML = `<option value="">${defaultOptionText}</option>`;
}

function populateSelectOptions(selectElement, data, valueKey, textKey) {
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[textKey];
        selectElement.appendChild(option);
    });
}

async function fetchEstados() {
    try {
        const response = await fetch('/api/estados');
        if (!response.ok) throw new Error('Erro ao carregar estados');
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

async function fetchMunicipios(estadoId) {
    try {
        const response = await fetch(`/api/estados/${estadoId}/municipios`);
        if (!response.ok) throw new Error('Erro ao carregar municípios');
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

async function fetchSvgPath(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Erro ao carregar SVG');
        
        const data = await response.json();
        console.log('Dados do SVG:', data);
        
        if (!data || !data.svg || !data.viewBox) {
            throw new Error('Dados inválidos para o SVG ou viewBox');
        }
        
        return data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

async function carregarEstados() {
    const estados = await fetchEstados();
    clearSelectOptions(estadoSelect, 'Selecione um estado');
    populateSelectOptions(estadoSelect, estados, 'id', 'nome');
}

async function carregarMunicipios(estadoId) {
    const municipios = await fetchMunicipios(estadoId);
    clearSelectOptions(municipioSelect, 'Selecione um município');
    populateSelectOptions(municipioSelect, municipios, 'id', 'nome');
}

function createPath(svgPathData, id, fillColor) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', svgPathData);
    path.setAttribute('id', id);
    path.setAttribute('stroke', 'black');
    path.setAttribute('fill', fillColor);
    path.setAttribute('stroke-width', '0.01');
    return path;
}


let estadoViewBox = null;
async function carregarMapa(estadoNome, municipioNome = null) {
    const endpoint = municipioNome
        ? `/api/municipios-svg/${municipioNome}`
        : `/api/estados-svg/${estadoNome}`;

    const data = await fetchSvgPath(endpoint);

    if (data && data.svg && data.viewBox) {
        if (!municipioNome && data.viewBox) {
            estadoViewBox = data.viewBox;
            svgContainer.setAttribute('viewBox', estadoViewBox);
        } else if (!estadoViewBox) {
            console.error('Erro: viewBox do estado não definido');
            return;
        }

        let stateGroup = svgContainer.querySelector('#state-group');
        let municipalityGroup = svgContainer.querySelector('#municipality-group');

        if (!stateGroup) {
            stateGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            stateGroup.setAttribute('id', 'state-group');
            svgContainer.appendChild(stateGroup);
        }

        if (!municipalityGroup) {
            municipalityGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            municipalityGroup.setAttribute('id', 'municipality-group');
            svgContainer.appendChild(municipalityGroup);
        }

        if (!municipioNome) {
            stateGroup.innerHTML = '';
            const statePath = createPath(data.svg, 'state-path', 'green');
            stateGroup.appendChild(statePath);
            municipalityGroup.innerHTML = '';
        } else {
            municipalityGroup.innerHTML = '';
            const municipalityPath = createPath(data.svg, 'municipality-path', 'red');
            municipalityGroup.appendChild(municipalityPath);
        }
    } else {
        console.error('Dados inválidos para o SVG ou viewBox');
    }
}

function setupEventListeners() {
    estadoSelect.addEventListener('change', async function () {
        const estadoId = this.value;
        const estadoNome = this.options[this.selectedIndex].textContent;
        if (estadoId) {
            await carregarMunicipios(estadoId);
            carregarMapa(estadoNome);
        } else {
            clearSelectOptions(municipioSelect, 'Selecione um município');
            svgContainer.innerHTML = '';
            estadoViewBox = null;
        }
    });

    municipioSelect.addEventListener('change', function () {
        const municipioNome = this.options[this.selectedIndex].textContent;
        if (municipioNome) {
            const estadoNome = estadoSelect.options[estadoSelect.selectedIndex].textContent;
            carregarMapa(estadoNome, municipioNome);
        }
    });
}

function init() {
    carregarEstados();
    setupEventListeners();
}

init();
