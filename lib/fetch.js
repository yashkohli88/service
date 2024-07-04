// (c) Copyright 2024, SAP SE and ClearlyDefined contributors. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const axios = require('axios')

async function callFetch(request) {
  try {
    // @ts-ignore
    const response = await axios({
      method: request.method,
      url: request.url,
      responseType: request.responseType,
      headers: request.headers,
      data: request.body,
      withCredentials: request.withCredentials,
      validateStatus: function (status) {
        if (request.simple === false) return status >= 200
        //Below line is default setting for validateStatus
        //Reference : https://github.com/axios/axios/blob/v1.6.8/README.md?plain=1#L522
        return status >= 200 && status < 300
      }
    })
    if (request.resolveWithFullResponse) return response
    return response.data
  } catch (error) {
    return error.response
  }
}
module.exports = { callFetch }
