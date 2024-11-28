// (c) Copyright 2024, SAP SE and ClearlyDefined contributors. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

const chaiAsPromised = require('chai-as-promised')
const chai = require('chai')
chai.use(chaiAsPromised)
const { expect } = require('chai')
const sinon = require('sinon')
const DefinitionQueueUpgrader = require('../../../providers/upgrade/defUpgradeQueue')

describe('DefinitionQueueUpgrader', () => {
  const definition = { coordinates: 'test', _meta: { schemaVersion: '1.0.0' } }
  let queue, upgrader

  beforeEach(async () => {
    const logger = { debug: sinon.stub() }
    queue = {
      queue: sinon.stub().resolves(),
      initialize: sinon.stub().resolves()
    }
    const queueFactory = sinon.stub().returns(queue)
    upgrader = new DefinitionQueueUpgrader({ logger, queue: queueFactory })
  })

  it('returns an instance of DefinitionQueueUpgrader', () => {
    expect(upgrader).to.be.an.instanceOf(DefinitionQueueUpgrader)
  })

  it('sets and gets current schema version', () => {
    upgrader.currentSchema = '1.0.0'
    expect(upgrader.currentSchema).to.equal('1.0.0')
  })

  it('initializes', async () => {
    await upgrader.initialize()
    expect(queue.initialize.calledOnce).to.be.true
  })

  it('connects to queue after setupProcessing', async () => {
    await upgrader.initialize()
    const definitionService = { currentSchema: '1.0.0' }
    const logger = { debug: sinon.stub() }
    queue.dequeueMultiple = sinon.stub().resolves([])
    upgrader.setupProcessing(definitionService, logger, true)
    expect(queue.dequeueMultiple.calledOnce).to.be.true
  })

  context('validate', () => {
    it('fails if current schema version is not set', async () => {
      await expect(upgrader.validate(definition)).to.be.rejectedWith(Error)
    })

    it('fails if it is not initialized', async () => {
      upgrader.currentSchema = '1.0.0'
      const stale = { coordinates: 'test', _meta: { schemaVersion: '0.0.1' } }
      await expect(upgrader.validate(stale)).to.be.rejectedWith(Error)
    })
  })

  context('validate after set up', () => {
    beforeEach(async () => {
      await upgrader.initialize()
      upgrader.currentSchema = '1.0.0'
    })

    it('does not queue null definition', async () => {
      const result = await upgrader.validate(null)
      expect(result).to.be.not.ok
      expect(queue.queue.called).to.be.false
    })

    it('does not queue an up-to-date definition', async () => {
      const definition = { coordinates: 'test', _meta: { schemaVersion: '1.0.0' } }
      const result = await upgrader.validate(definition)
      expect(result).to.deep.equal(definition)
      expect(queue.queue.called).to.be.false
    })

    it('queues and returns a stale definition', async () => {
      const definition = { coordinates: 'test', _meta: { schemaVersion: '0.0.1' } }
      const result = await upgrader.validate(definition)
      expect(result).to.deep.equal(definition)
      expect(queue.queue.calledOnce).to.be.true
    })
  })
})
