const expect = require('chai').assert
const CDI = require('../../src/')

let _cdi
class Controller {
  constructor () {
    const cdi = new CDI()

    _cdi = cdi

    cdi.addInterceptorVariable('_var1', async (fnName, args) => {
      return args._var1 ? args._var1 + '_interceptor' : '_interceptor'
    })

    cdi.setInterceptorDone(async (response, fnName, args) => {
      if (response === 'done') {
        return response + ' + ' + fnName
      }

      throw new Error(response)
    })

    const _module = cdi.configure({})

    return _module
  }
}

describe('Done inject variable with intercept', function () {
  before(function () {
    this.target = new Controller()

    this.target.fn = async ({ _var1 }) => {
      return 'done'
    }

    this.target._fn = async ({ _var1 }) => {
      return 'error'
    }
  })

  it('should pass message error with concatened effect of interceptor', async function () {
    expect.equal(await this.target.fn({ _var1: 'test222' }), 'done + fn')
  })

  it('should catch error because rethrow error', async function () {
    try {
      await this.target._fn({ })
      throw new Error()
    } catch (err) {
      expect.equal(err.message, 'error')
    }
  })

  it('should catch error because reset Done function', async function () {
    try {
      _cdi.setInterceptorDone(async (err, args) => {
        if (args._var1) {
          return err.message + ' + effect'
        }

        throw err
      })
    } catch (err) {
      expect.equal(err.message, 'already exists a configured Done Interceptor')
    }
  })
})
