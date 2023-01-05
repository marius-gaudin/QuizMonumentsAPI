import { createClient } from 'pexels'
import NodeCache from 'node-cache'

const client = createClient(process.env.PEXELS_API_KEY)
const cache = new NodeCache()

export async function search(query) 
{
    try {
        let image = cache.get(query)
        if(image == undefined) {
            console.log('pas de cache');
            const result = await client.photos.search({query, per_page: 1})
            image = {
                'photographer': {
                    'name': result?.photos[0]?.photographer,
                    'url': result?.photos[0]?.photographer_url
                },
                'url': result?.photos[0]?.src?.large ?? result?.photos[0]?.src?.original,
                'alt': result?.photos[0]?.alt
            }
            cache.set(query, image)
        } else {
            console.log('utilisation du cache');
        }
        
        return image
    }
    catch(error) {
        console.log(error)
    }
    return null
}