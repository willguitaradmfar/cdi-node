const expect = require('chai').assert
const CDI = require('../../src/')

class Controller {
  constructor () {
    const cdi = new CDI()

    const _module = cdi.configure({})

    return _module
  }
}

describe('Class inject variable', function () {
  before(function () {
    this.target = new Controller()

    this.target.fn = async ({ _var1 }) => {
      return new Promise((resolve, reject) => {
        return resolve(_var1)
      })
    }
  })

  it('should pass _var1 and response', async function () {
    expect.equal(await this.target.fn({ _var1: 'test1' }), 'test1')
  })

  it('should throw error because accept one argument', async function () {
    try {
      await this.target.fn({ _var1: 'test1' }, 'second argument')
      throw new Error('test')
    } catch (err) {
      expect.equal(err.message, 'only 1 argument of object type is allowed')
    }
  })
})
