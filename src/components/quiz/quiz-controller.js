import Monument from '#components/monument/monument-model.js';
import Quiz from '#components/quiz/quiz-model.js';
import User from '#components/user/user-model.js';
import Question from '#components/question/question-model.js';
import jwt from 'jsonwebtoken';

export async function create(ctx) {
    try {
        let token = ctx.request.header.authorization
        token = token.slice(token.indexOf(' ')+1)
        const tokenInfo = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({pseudo: tokenInfo.data.pseudo})
        const quiz = await Quiz.create({user: user._id})

        const nbMonuments = await Monument.count({})
        let randomNumbers = []
        while(randomNumbers.length < 5){
            let random = Math.floor(Math.random() * nbMonuments)
            if(randomNumbers.indexOf(random) === -1) randomNumbers.push(random)
        }

        let questions = []
        for (const number of randomNumbers) {
            let monument = await Monument.findOne({}).skip(number)
            let newQuestion = await Question.create({
                quiz: quiz._id,
                monument: monument._id,
                number: (questions.length+1)
            })
            questions.push(newQuestion._id)
        }

        ctx.ok({questions})
    } catch(e) {
        ctx.badRequest({ message: e.message })
    }
}