// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const logger = require('../logging/logger')
const { callFetch } = require('../../lib/fetch')

class CrawlingHarvester {
  constructor(options) {
    this.logger = logger()
    this.options = options
  }

  async harvest(spec, turbo) {
    const headers = {
      'X-token': this.options.authToken
    }
    const body = (Array.isArray(spec) ? spec : [spec]).map(entry => {
      return {
        type: entry.tool || 'component',
        url: `cd:/${entry.coordinates.toString().replace(/[/]+/g, '/')}`,
        policy: entry.policy
      }
    })
    const url = turbo ? `${this.options.url}/requests` : `${this.options.url}/requests/later`
    return callFetch({ url, method: 'POST', body, headers, responeType: 'json' })
  }
}

module.exports = options => new CrawlingHarvester(options)
