import Question from '#components/question/question-model.js';
import * as pexelsService from '#services/pexels-service.js'

export async function start(ctx) {
    try {
        const id = ctx.params.id
        const question = await Question.findById(id).populate('monument')
        if(!question) return ctx.badRequest({ message:'question inconnu' })

        const image = await pexelsService.search(question.monument.name)
        question.timeStart = Date.now()
        question.save()

        ctx.ok({
            'frenchName': question.monument.frenchName,
            'name': question.monument.name,
            image,
            'number': question.number,
            '_id': question._id
        })
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}
