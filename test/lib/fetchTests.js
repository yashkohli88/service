
const { expect } = require('chai')
const fs = require('fs')
const { callFetch } = require('../../lib/fetch')

describe('CallFetch', () => {
  it('checks if the response is JSON while sending GET request', async () => {
    const response = await callFetch({
      url: 'https://registry.npmjs.com/redis/0.1.0',
      method: 'GET',
      responseType: 'json'
    })
    expect(response).to.be.deep.equal(JSON.parse(fs.readFileSync('test/fixtures/fetch/redis-0.1.0.json')))
  })

  it('checks if the full response is fetched', async () => {
    const response = await callFetch({
      url: 'https://registry.npmjs.com/redis/0.1.0',
      method: 'GET',
      responseType: 'json',
      resolveWithFullResponse: true
    })
    expect(response.status).to.be.equal(200)
    expect(response.statusText).to.be.equal('OK')
  })

  it('checks if the full response is fetched with error code', async () => {
    const response = await callFetch({
      url: 'https://registry.npmjs.com/redis/0.',
      method: 'GET',
      responseType: 'json',
      resolveWithFullResponse: true
    })
    expect(response.status).to.be.equal(404)
    expect(response.statusText).to.be.equal('Not Found')
  })

  it('checks if the response is text while sending GET request', async () => {
    const response = await callFetch({
      url: 'https://proxy.golang.org/rsc.io/quote/@v/v1.3.0.mod',
      method: 'GET',
      responseType: 'text'
    })
    expect(response).to.be.equal('module "rsc.io/quote"\n')
  })

  it('checks for the response while sending a POST request', async () => {
    const name = 'STARSCREAMFORK'
    const algolia = {
      appID: 'WBHHAMHYNM',
      apiKey: '4f7544ca8701f9bf2a4e55daff1b09e9'
    }
    const url = `https://${algolia.appID}-dsn.algolia.net/1/indexes/cocoapods/query?x-algolia-application-id=${algolia.appID}&x-algolia-api-key=${algolia.apiKey}`
    const answer = await callFetch({
      url,
      method: 'POST',
      body: {
        params: `query=${name}`
      },
      responseType: 'json'
    })
    //console.log(JSON.stringify(answer))
    expect(answer.hits.length).to.be.equal(2)
  })

  it('checks for the response when simple parameter is set to be false', async () => {
    const request = {
      url: 'https://registry.npmjs.com/redis/0.',
      method: 'GET',
      simple: false
    }
    const response = await callFetch(request)
    expect(response).to.be.equal('version not found: 0.')
  })

  it('checks for the response when simple parameter is set to be true', async () => {
    const request = {
      url: 'https://registry.npmjs.com/redis/0.',
      method: 'GET',
    }
    const response = await callFetch(request)
    expect(response.status).to.be.equal(404)
  })

})
