
import NodeCache from 'node-cache'
import * as countryService from './country-service.js'

const cache = new NodeCache()

const urlApiPlace = 'https://maps.googleapis.com/maps/api/place/'

const urlPlaceByText = 'findplacefromtext/json?fields=place_id%2Cphotos%2Cgeometry%2Cname%2Ctypes&inputtype=textquery&input='
const urlPlacePhoto = 'photo?maxwidth=1500&photo_reference='
const urlPlaceDetails = 'details/json?fields=address_components&place_id='

const key = `&key=${process.env.GOOGLE_API_KEY}`

export async function getPlaceInfos(searchText) {

    const placeCache = cache.get(searchText)
    if(typeof placeCache !== 'undefined') return placeCache

    const place = (await getPlace(searchText))?.candidates[0]
    if(!place) return null

    const flag = await getDetails(place?.place_id)
    const latitude = place?.geometry?.location?.lat
    const longitude = place?.geometry?.location?.lng
    const photoRef = place?.photos[0]?.photo_reference
    const name = place?.name

    if(typeof latitude !== 'number' || typeof longitude !== 'number') return null

    const photo = await getPhoto(photoRef)

    const result = {
        latitude,
        longitude,
        flag,
        name,
        photo
    }

    cache.set(searchText, result)
    return result
}

async function getPlace(searchText) {
    if(typeof searchText !== 'string' || searchText == '') return null

    try {
        const urlPlace = `${urlApiPlace}${urlPlaceByText}${searchText}${key}`
        const response = await fetch(urlPlace)
        if(!response) return null
        return await response.json()
    } catch(error) {
        console.log(error)
        return null
    }
}

async function getPhoto(photoRef) {
    if(typeof photoRef !== 'string') return null

    try {
        const urlPhoto = `${urlApiPlace}${urlPlacePhoto}${photoRef}${key}`
        const response = (await fetch(urlPhoto)).url
        if(!response) return null
        return response
    } catch(error) {
        console.log(error)
        return null
    }
}

async function getDetails(id) {
    if(typeof id !== 'string') return null
    try {
        const urlDetails = `${urlApiPlace}${urlPlaceDetails}${id}${key}`
        const response = await fetch(urlDetails)
        if(!response) return null
        const codeIso = (await response.json())?.result?.address_components?.find(adr => adr.types.includes('country'))?.short_name
        if(!codeIso) return null
        return await countryService.getFlag(codeIso)
    }catch(error) {
        console.log(error)
        return null
    }
}