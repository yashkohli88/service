// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const asyncMiddleware = require('../middleware/asyncMiddleware')
const router = require('express').Router()
const { uniq } = require('lodash')
const { callFetch } = require('../lib/fetch')

// RubyGems API documentation: https://guides.rubygems.org/rubygems-org-api-v2/
router.get(
  '/:name/revisions',
  asyncMiddleware(async (request, response) => {
    const { name } = request.params
    const url = `https://rubygems.org/api/v1/versions/${name}.json`
    const answer = await callFetch({ url, method: 'GET', responseType: 'json' })
    const result = answer.map(entry => entry.number)
    return response.status(200).send(uniq(result))
  })
)

router.get(
  '/:name',
  asyncMiddleware(async (request, response) => {
    const { name } = request.params
    const url = `https://rubygems.org/api/v1/search.json?query=${name}`
    const answer = await callFetch({ url, method: 'GET', responseType: 'json' })
    const result = answer.map(entry => {
      return { id: entry.name }
    })
    return response.status(200).send(result)
  })
)

function setup() {
  return router
}

module.exports = setup
