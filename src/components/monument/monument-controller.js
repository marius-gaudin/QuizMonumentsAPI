import Monument from './monument-model.js';
import * as mapsService from '../../services/maps-service.js'

export async function getAll(ctx) {
    try {
        const monuments = await Monument.find({});
        ctx.ok(monuments)
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}

export async function getMonumentById(ctx) {
    try {
        const monumentId = ctx.params.monumentId
        const monument = JSON.parse(JSON.stringify(await Monument.findById(monumentId)))
        const monumentInfo = await mapsService.getPlaceInfos(monument.name)
        ctx.ok({...monument, ...monumentInfo})
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}