import Monument from '#components/monument/monument-model.js'
import Quiz from '#components/quiz/quiz-model.js'
import Question from '#components/question/question-model.js'
import * as userService from '#services/user-service.js'
import * as quizService from '#services/quiz-service.js'
import * as mapsService from '#services/maps-service.js'
import Joi from 'joi'

// Get all user quizzes
export async function getAll(ctx) {
    try {
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const quizzes = await Quiz.find({user: userId}).sort({createdAt: 'desc'}).populate('user', 'pseudo -_id')
        ctx.ok(quizzes)
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}

// Create new quizz
export async function newQuiz(ctx) {
    try {
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        // Si le dernier quiz n'a pas été terminé on le supprime
        const lastQuiz = await Quiz.findOne({user: userId, finalScore: null}).sort({createdAt: 'desc'})
        if(lastQuiz) {
            await Quiz.deleteOne({'_id': lastQuiz._id})
            await Question.deleteMany({'quiz': lastQuiz._id})
        }

        const quiz = await Quiz.create({user: userId})
        const nbQuestion = 5
        const nbMonuments = await Monument.count({})
        const randomNumbers = quizService.getRandomNumbers(nbQuestion, nbMonuments)
        let questions = []

        for (const [i, number] of randomNumbers.entries()) {
            let monument = await Monument.findOne({}).skip(number)
            let question = await Question.create({
                quiz: quiz._id,
                monument: monument._id,
                number: (i+1)
            })
            questions.push({'number': question.number, '_id': question._id })
        }

        ctx.ok({ _id: quiz._id, questions })
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}

export async function getQuestion(ctx) {
    try {
        const userId = userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const quizId = ctx.params.quizId
        const quiz = await Quiz.findOne({ _id: quizId, user: userId })
        if(quiz === null) return ctx.badRequest({ message: 'quizID invalide' })
        const questionId = ctx.params.questionId
        const question = await Question.findOne({ quiz: quizId, _id: questionId }).populate('monument')
        if(question === null) return ctx.badRequest({ message: 'questionID invalide' })
        const monument = await mapsService.getPlaceInfos(question.monument.name)

        let result = JSON.parse(JSON.stringify(question))
        if(question.score) {
            result.monument = monument
            result.distance = quizService.getDistance(question.userAnswerLatitude, question.userAnswerLongitude, monument.latitude, monument.longitude)
            result.totalScore = await quizService.getTotalScore(quiz._id)
        } else {
            result.monument = {
                _id: question.monument._id,
                name: monument.name,
                photo: monument.photo
            }
        }

        const dateNow = new Date(Date.now())
        if(!question.timeStart) {
            question.timeStart = dateNow
            question.save()
        }

        result.time = quizService.getTime(question.timeStart, dateNow)

        ctx.ok(result)
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}

export async function setQuestionAnswer(ctx) {
    try {
        const dateNow = new Date(Date.now())
        const userId = userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const quizId = ctx.params.quizId
        const quiz = await Quiz.findOne({ _id: quizId, user: userId })
        if(quiz === null) return ctx.badRequest({ message: 'quizID invalide' })
        const questionId = ctx.params.questionId
        const question = await Question.findOne({ quiz: quizId, _id: questionId }).populate('monument')
        if(question === null) return ctx.badRequest({ message: 'monumentId invalide' })

        if(question.timeStart === null) {
            return ctx.badRequest({ message: `Impossible de répondre à la question avant de l'avoir commencé` })
        }

        if(question.score !== null) {
            return ctx.badRequest({ message: `Vous avez déjà répondue à la question` })
        }
    
        const coordinates = Joi.object({
            latitude: Joi.number().required(),
            longitude: Joi.number().required()
        })

        const { error, value } = coordinates.validate(ctx.request.body)
        if(error) return ctx.badRequest({ message: error })

        let monument = await mapsService.getPlaceInfos(question.monument.name)
        monument._id = question.monument._id

        question.timeEnd = dateNow
        question.userAnswerLatitude = value.latitude
        question.userAnswerLongitude = value.longitude
        const distance = quizService.getDistance(value.latitude, value.longitude, monument.latitude, monument.longitude)
        question.score = quizService.calculScore(distance.value)
        await question.save()

        const time = quizService.getTime(question.timeStart, dateNow)
        const totalScore = await quizService.getTotalScore(quiz._id)

        const numberOfRemainingQuestions = await Question.count({ quiz: quizId, score: null })
        if(numberOfRemainingQuestions === 0) {
            quiz.finalScore = totalScore
            await quiz.save()
        }

        let result = JSON.parse(JSON.stringify(question))

        result.monument = monument
        result.distance = distance
        result.time = time
        result.totalScore = totalScore

        ctx.ok(result)
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}

export async function getById(ctx) {
    try {
        const quizId = ctx.params.quizId
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const quiz = await Quiz.findOne({user: userId, _id: quizId}).sort({createdAt: 'desc'}).populate('user', 'pseudo -_id')
        if(quiz === null) return ctx.badRequest({ message: 'ID invalide' })
        let questions = await Question.find({ quiz: quiz._id })
                                        .sort({ number: 'asc' })
                                        .populate('monument', 'name -_id')

        let questionsDetail = []
        let timeFromStart = {
            seconds: 0,
            minutes: 0
        }
        questions.forEach(question => {
            const questionDetail = JSON.parse(JSON.stringify(question))
            if(question.timeEnd !== null && question.timeStart !== null) {
                questionDetail.time = quizService.getTime(question.timeStart, question.timeEnd)
                timeFromStart.minutes += questionDetail.time.minutes
                timeFromStart.seconds += questionDetail.time.seconds
            } else if (question.score === null && question.timeEnd === null && question.timeStart === null) {
                questionDetail.monument = null
            }
            questionsDetail.push(questionDetail)
        });
        const quizInfo = JSON.parse(JSON.stringify(quiz))
        if(timeFromStart.seconds > 59) {
            const mnt = Math.floor(timeFromStart.seconds/60)
            timeFromStart.minutes += mnt
            timeFromStart.seconds -= (mnt*60)
        }
        quizInfo.time = timeFromStart
        quizInfo.questions = questionsDetail
        ctx.ok(quizInfo)
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}

export async function deleteById(ctx) {
    try {
        const quizId = ctx.params.quizId
        const userId = await userService.getCurrentUserIdByToken(ctx.request.header.authorization)
        const result = await Quiz.deleteOne({user: userId, _id: quizId})
        if(result.deletedCount === 0) return ctx.badRequest({ message: 'quizId invalide' })
        await Question.deleteMany({ quiz: quizId })
        return ctx.ok(true)
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}