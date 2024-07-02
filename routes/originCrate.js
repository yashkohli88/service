// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const { callFetch } = require('../lib/fetch')
const asyncMiddleware = require('../middleware/asyncMiddleware')
const router = require('express').Router()
const { uniq } = require('lodash')
const defaultHeaders = { 'user-agent': 'clearlydefined.io' }

// crates.io API https://github.com/rust-lang/crates.io/blob/03666dd7e35d5985504087f7bf0553fa16380fac/src/router.rs
router.get(
  '/:name/revisions',
  asyncMiddleware(async (request, response) => {
    const { name } = request.params
    const url = `https://crates.io/api/v1/crates/${name}`
    const answer = await callFetch({ url, method: 'GET', responseType: 'json', headers: defaultHeaders })
    return response.status(200).send(uniq(answer.versions.map(x => x.num)))
  })
)

router.get(
  '/:name',
  asyncMiddleware(async (request, response) => {
    const { name } = request.params
    const url = `https://crates.io/api/v1/crates?per_page=100&q=${name}`
    const answer = await callFetch({ url, method: 'GET', responseType: 'json', headers: defaultHeaders })
    const result = answer.crates.map(x => {
      return { id: x.name }
    })
    return response.status(200).send(result)
  })
)

function setup() {
  return router
}

module.exports = setup
