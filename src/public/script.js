const svgContainer = document.getElementById("estado-svg");

function carregarEstados() {
    fetch('/api/estados')
        .then(response => response.json())
        .then(data => {
            let estadoSelect = document.getElementById('estado');
            estadoSelect.innerHTML = '<option value="">Selecione um estado</option>';
            data.forEach(estado => {
                let option = document.createElement('option');
                option.value = estado.id;
                option.textContent = estado.nome;
                estadoSelect.appendChild(option);
            });
        })
        .catch(error => console.log('Erro ao carregar estados:', error));
}

function carregarMunicipios(estadoId) {
    fetch(`/api/estados/${estadoId}/municipios`)
        .then(response => response.json())
        .then(data => {
            let municipioSelect = document.getElementById('municipio');
            municipioSelect.innerHTML = '<option value="">Selecione um município</option>';
            data.forEach(municipio => {
                let option = document.createElement('option');
                option.value = municipio.id;
                option.textContent = municipio.nome;
                municipioSelect.appendChild(option);
            });
        })
        .catch(error => console.log('Erro ao carregar municípios:', error));
}

document.getElementById('estado').addEventListener('change', function () {
    let estadoId = this.value;
    if (estadoId) {
        carregarMapa(estadoId);
        carregarMunicipios(estadoId);
    } else {
        document.getElementById('municipio').innerHTML = '<option value="">Selecione um município</option>';
        document.getElementById('estado-svg').innerHTML = '';
    }
});

document.getElementById('municipio').addEventListener('change', function () {
    let municipioNome = this.options[this.selectedIndex].textContent;
    if (municipioNome) {
        let estadoId = document.getElementById('estado').value;
        carregarMapa(estadoId, municipioNome);
    }
});

function createStatePath(svgPathData) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", svgPathData);
    path.setAttribute("stroke", "black");
    path.setAttribute("fill", "green");
    path.setAttribute("stroke-width", "0.01");
    return path;
}

function carregarMapa(estadoId, municipioNome = null) {
    const svgContainer = document.getElementById('estado-svg');
    svgContainer.innerHTML = ''; // Limpa o conteúdo atual do SVG

    if (municipioNome) {
        fetch(`/api/municipios-svg/${municipioNome}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível carregar o SVG do município');
                }
                return response.text();
            })
            .then(svgPathData => {
                const pathElement = createStatePath(svgPathData);
                svgContainer.appendChild(pathElement);
            })
            .catch(error => {
                console.error('Erro ao carregar mapa do município:', error);
            });
    } else {
        fetch(`/api/estados-svg/${estadoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível carregar o SVG do estado');
                }
                return response.text();
            })
            .then(svgPathData => {
                const pathElement = createStatePath(svgPathData);
                svgContainer.appendChild(pathElement);
            })
            .catch(error => {
                console.error('Erro ao carregar mapa do estado:', error);
            });
    }
}

// function createSvgContainer() {
//     const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//     svgElement.setAttribute("viewBox", "-50 -50 100 100");
//     svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
//     svgElement.style.width = "100%"; 
//     svgElement.style.height = "auto";
//     return svgElement;
// }

carregarEstados();
