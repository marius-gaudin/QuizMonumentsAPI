import * as convert from 'xml-js'

export async function getFlag (codeIso) {
    if(typeof codeIso !== 'string') return null
    const body = 
    `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
      <soap12:Body>
        <CountryFlag xmlns="http://www.oorsprong.org/websamples.countryinfo">
          <sCountryISOCode>${codeIso}</sCountryISOCode>
        </CountryFlag>
      </soap12:Body>
    </soap12:Envelope>`
    const url = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso'
    const response = await fetch(url, 
      {
        method: 'POST', 
        body: body, 
        headers: { 
          'Content-Type': 'application/soap+xml; charset=utf-8', 
        }
      })
    const jsonResult = JSON.parse(convert.xml2json(await response.text(), {
      compact: true
    }))
    return jsonResult['soap:Envelope']['soap:Body']['m:CountryFlagResponse']['m:CountryFlagResult']['_text']
}