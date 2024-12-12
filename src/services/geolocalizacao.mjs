import { QueryTypes } from "sequelize";
import sequelize from "../config/sequelize.mjs";

class Geolocalizacao {
    async getSvgByEntityName(name, entityType) {
        if (!['estado', 'municipio'].includes(entityType)) {
            throw new Error('Tipo de entidade inválido. Use "estado" ou "municipio".');
        }
        if (!name || typeof name !== 'string') {
            throw new Error('Nome inválido.');
        }

        try {
            const [result] = await sequelize.query(
                "SELECT get_svg_by_name(:entityType, :name) AS svg",
                {
                    replacements: { entityType, name },
                    type: QueryTypes.SELECT,
                }
            );
            return result?.svg || null;
        } catch (error) {
            console.error("Erro ao buscar o SVG por nome:", error);
            throw new Error("Falha ao buscar SVG por nome.");
        }
    }

    async getSvgByEntityId(id, entityType) {
        if (!['estado', 'municipio'].includes(entityType)) {
            throw new Error('Tipo de entidade inválido. Use "estado" ou "municipio".');
        }
        if (!id || typeof id !== 'number') {
            throw new Error('ID inválido.');
        }

        try {
            const [result] = await sequelize.query(
                "SELECT get_svg_by_id(:entityType, :id) AS svg",
                {
                    replacements: { entityType, id },
                    type: QueryTypes.SELECT,
                }
            );
            return result?.svg || null;
        } catch (error) {
            console.error("Erro ao buscar o SVG por ID:", error);
            throw new Error("Falha ao buscar SVG por ID.");
        }
    }

    async getViewboxByEntityId(id, entityType) {
        if (!['estado', 'municipio'].includes(entityType)) {
            throw new Error('Tipo de entidade inválido. Use "estado" ou "municipio".');
        }
        if (!id || typeof id !== 'number') {
            throw new Error('ID inválido.');
        }

        try {
            const [result] = await sequelize.query(
                "SELECT getViewBoxById(:id, :entityType) AS viewbox",
                {
                    replacements: { id, entityType },
                    type: QueryTypes.SELECT,
                }
            );
            return result?.viewbox || null;
        } catch (error) {
            console.error("Erro ao buscar o ViewBox:", error);
            throw new Error("Falha ao buscar ViewBox.");
        }
    }

    async getViewboxByEntityName(name, entityType) {
        if (!['estado', 'municipio'].includes(entityType)) {
            throw new Error('Tipo de entidade inválido. Use "estado" ou "municipio".');
        }
        if (!name) {
            throw new Error('Nome inválido.');
        }

        try {
            const [result] = await sequelize.query(
                "SELECT getViewBoxByName(:name, :entityType) AS viewbox",
                {
                    replacements: { name, entityType },
                    type: QueryTypes.SELECT,
                }
            );
            return result?.viewbox || null;
        } catch (error) {
            console.error("Erro ao buscar o ViewBox:", error);
            throw new Error("Falha ao buscar ViewBox.");
        }
    }
}

export default Geolocalizacao;
