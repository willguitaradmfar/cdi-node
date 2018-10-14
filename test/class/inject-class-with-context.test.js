const expect = require('chai').assert
const CDI = require('../../src/')

class Controller {
  constructor () {
    const cdi = new CDI()

    const _module = cdi.configure({})

    return _module
  }
}

describe('Class inject variable with context', function () {
  before(function () {
    this.target = new Controller()

    this.target.context = 'bar'

    this.target.fn = async function ({ _var1 }) {
      return new Promise((resolve, reject) => {
        return resolve(_var1 + this.context)
      })
    }
  })

  it('should pass _var1 and response with context', async function () {
    expect.equal(await this.target.fn({ _var1: 'test1' }), 'test1bar')
  })
})
