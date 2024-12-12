import { Router } from "express";
import Geolocalizacao from "../services/geolocalizacao.mjs";

const router = Router();
const geoService = new Geolocalizacao();

router.get('/api/estados', async (request, response) => {
    try {
        const fetchResponse = await fetch('http://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const estados = await fetchResponse.json();
        response.json(estados);
    } catch (error) {
        console.error("Erro ao carregar estados:", error);
        response.status(500).json({ message: 'Erro ao carregar estados', error });
    }
});

router.get('/api/municipios', async (request, response) => {
    try {
        const fetchResponse = await fetch('http://servicodados.ibge.gov.br/api/v1/localidades/municipios');
        const municipios = await fetchResponse.json();
        response.json(municipios);
    } catch (error) {
        console.error("Erro ao carregar municípios:", error);
        response.status(500).json({ message: 'Erro ao carregar municípios', error });
    }
});

router.get('/api/estados/:idEstado/municipios', async (request, response) => {
    const { idEstado } = request.params;

    try {
        const fetchResponse = await fetch(`http://servicodados.ibge.gov.br/api/v1/localidades/estados/${idEstado}/municipios`);
        const municipios = await fetchResponse.json();
        response.json(municipios);
    } catch (error) {
        console.error(`Erro ao carregar municípios para o estado ${idEstado}:`, error);
        response.status(500).json({ message: 'Erro ao carregar municípios', error });
    }
});

// Aqui você estava comentando a rota, então vou mantê-la como está por enquanto
// router.get('/api/:estadoId/:municipioId', async (request, response) => { ...

// A rota abaixo deve vir antes da exportação do router
// router.get('/api/estados-svg/:idEstado', async (request, response) => {
//     let { idEstado } = request.params;
//     idEstado = parseInt(idEstado, 10);

//     try {
//         const svgResult = await geoService.getSvgByEntityId(idEstado, "estado");

//         if (!svgResult) {
//             return response.status(404).json({ error: "Estado não encontrado." });
//         }

//         const viewBox = await geoService.getViewboxByEntityId(idEstado, "estado");

//         if (!viewBox) {
//             return response.status(404).json({ error: "ViewBox não encontrado para o estado." });
//         }

//         response.json({
//             svg: svgResult,
//             viewBox: viewBox
//         });

//     } catch (error) {
//         console.error(`Erro ao buscar SVG do estado ${idEstado}:`, error);
//         response.status(500).json({ error: "Erro interno no servidor." });
//     }
// });

router.get('/api/estados-svg/:name', async (request, response) => {
    let { name } = request.params;
    console.log(request.url)

    try {
        const svgResult = await geoService.getSvgByEntityName(name, "estado");

        if (!svgResult) {
            return response.status(404).json({ error: "Estado não encontrado." });
        }

        const viewBox = await geoService.getViewboxByEntityName(name, "estado");

        if (!viewBox) {
            return response.status(404).json({ error: "ViewBox não encontrado para o estado." });
        }

        response.json({
            svg: svgResult,
            viewBox: viewBox
        });

    } catch (error) {
        console.error(`Erro ao buscar SVG do estado ${name}:`, error);
        response.status(500).json({ error: "Erro interno no servidor." });
    }
});

router.get('/api/municipios-svg/:name', async (request, response) => {
    let { name } = request.params;
    console.log(request.url)

    try {
        const svgResult = await geoService.getSvgByEntityName(name, "municipio");

        if (!svgResult) {
            return response.status(404).json({ error: "Municipio não encontrado." });
        }

        const viewBox = await geoService.getViewboxByEntityName(name, "municipio");

        if (!viewBox) {
            return response.status(404).json({ error: "ViewBox não encontrado para o municipio." });
        }

        response.json({
            svg: svgResult,
            viewBox: viewBox
        });

    } catch (error) {
        console.error(`Erro ao buscar SVG do municipio ${name}:`, error);
        response.status(500).json({ error: "Erro interno no servidor." });
    }
});

export default router;
