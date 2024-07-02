// (c) Copyright 2024, SAP SE and ClearlyDefined contributors. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const axios = require("axios")

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
        if (!request.simple)
          return status >= 200
        else
          return status >= 200 && status < 300; // default
      }
    })
    if (request.resolveWithFullResponse) return response
    return response.data
  }
  catch (error) {
    return error.response
  }
}
module.exports = { callFetch };
