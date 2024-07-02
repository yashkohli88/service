// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const asyncMiddleware = require('../middleware/asyncMiddleware')
const router = require('express').Router()
const { uniq } = require('lodash')
const { callFetch } = require('../lib/fetch')

// trunk.cocoapods.org API documentation: https://github.com/CocoaPods/trunk.cocoapods.org-api-doc
router.get(
  '/:name/revisions',
  asyncMiddleware(async (request, response) => {
    const { name } = request.params
    const url = `https://trunk.cocoapods.org/api/v1/pods/${name}`
    const answer = await callFetch({ url, method: 'GET', responseType: 'json' })
    return response.status(200).send(uniq(answer.versions.map(x => x.name)))
  })
)

router.get(
  '/:name',
  asyncMiddleware(async (request, response) => {
    const { name } = request.params
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
    const result = answer.hits.map(x => {
      return { id: x.name }
    })
    return response.status(200).send(result)
  })
)

function setup() {
  return router
}

module.exports = setup
