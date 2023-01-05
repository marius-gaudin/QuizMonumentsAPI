import Monument from '#components/monument/monument-model.js';

export async function getAll(ctx) {
    try {
        const monuments = await Monument.find({});

        ctx.ok(monuments)
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}
