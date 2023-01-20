import Question from '../components/question/question-model.js'
import Quiz from '../components/quiz/quiz-model.js'

export function getRandomNumbers(nbNumber, max) {
    if(typeof nbNumber !== 'number' || typeof max !== 'number') return null
    let randomNumbers = []
    while(randomNumbers.length < nbNumber){
        let random = Math.floor(Math.random() * max)
        if(randomNumbers.indexOf(random) === -1) randomNumbers.push(random)
    }
    return randomNumbers
}

export function getTime(start, end) {
    if(!start || !end) return null
    try {
        const time = (end.getTime() - start.getTime())/1000
        const minutes = Math.floor(time/60)
        const seconds = Math.floor(time - (minutes*60))
        return {minutes, seconds}
    } catch(e) {
        return null
    }

}

export function calculScore(distance) {
    if(typeof distance !== 'number') return null
    const maxPoint = 3000
    const maxDistance = 1600
    const minDistance = 1

    let score = 0
    if(distance <= minDistance) score += maxPoint
    else if(distance < maxDistance) {
        const radiusZone = (maxDistance - minDistance)
        score+=(radiusZone - (distance - minDistance)) * (maxPoint/radiusZone)
    }

    return Math.round(score)
}

export function getDistance(lat1, lng1, lat2, lng2) {
    const earthRadius = 6371;
    const result = earthRadius * Math.acos(Math.sin(degrees_to_radians(lat1)) * Math.sin(degrees_to_radians(lat2)) + Math.cos(degrees_to_radians(lat1)) * Math.cos(degrees_to_radians(lat2)) * Math.cos(degrees_to_radians(lng2 - lng1)))
    return {
            value: Math.round(result*1000)/1000,
            unit: 'km'
            }
}

export function degrees_to_radians(degrees)
{
  const pi = Math.PI
  return degrees * (pi/180)
}

export async function getTotalScore(idQuiz) {
    const result = await Question.aggregate([{$match: { quiz: idQuiz }}, {$group: {_id: '$quiz', total: {$sum: '$score'}}}])
    if(result.length > 0) return result[0].total
    return null
}

export async function canCreateNewQuiz(userId) {
    const nbQuizPerDay = 3
    const now = new Date(Date.now())
    const nbQuizToday = await Quiz.count({user: userId, updatedAt: {$gt: new Date(now.getFullYear(), now.getMonth(), now.getDate())}})
    console.log(nbQuizToday)
    if(nbQuizToday && nbQuizToday >= nbQuizPerDay) {
        return false
    }
    return true
}