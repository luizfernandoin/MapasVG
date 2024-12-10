import { Router } from "express";
import sequelize from "../config/sequelize.mjs";


const router = Router();


router.get('/api/estados', async (request, response) => {
    try {
        const fetchResponse = await fetch('http://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const estados = await fetchResponse.json();
        response.json(estados);
    } catch (error) {
        response.status(500).json({ message: 'Erro ao carregar estados', error });
    }
});

router.get('/api/municipios', async (request, response) => {
    try {
        const fetchResponse = await fetch('http://servicodados.ibge.gov.br/api/v1/localidades/municipios');
        const municipios = await fetchResponse.json();
        response.json(municipios);
    } catch (error) {
        response.status(500).json({ message: 'Erro ao carregar municipios', error });
    }
});

router.get('/api/estados/:idEstado/municipios', async (request, response) => {
    const { idEstado } = request.params;

    try {
        const fetchResponse = await fetch(`http://servicodados.ibge.gov.br/api/v1/localidades/estados/${idEstado}/municipios`);
        const municipios = await fetchResponse.json();
        response.json(municipios);
    } catch (error) {
        response.status(500).json({ message: 'Erro ao carregar municipios', error });
    }
});


router.get('/api/municipios-svg/:nome', async (request, response) => {
    const { nome } = request.params;
    console.log("Nome recebido:", nome);

    try {
        const [result] = await sequelize.query(
            `SELECT ST_AsSVG(geom) AS svg FROM municipios WHERE nome ILIKE $1`,
            {
                bind: [nome],
                type: sequelize.QueryTypes.SELECT,
            }
        );

        console.log("Resultado da consulta:", result);

        if (result && result.svg) {
            response.type('image/svg+xml');
            return response.send(result.svg);
        } else {
            console.log("Município não encontrado.");
            return response.status(404).send({ error: "Município não encontrado." });
        }
    } catch (error) {
        console.error("Erro ao buscar SVG:", error);
        return response.status(500).send({ error: "Erro interno no servidor." });
    }
});


export default router;