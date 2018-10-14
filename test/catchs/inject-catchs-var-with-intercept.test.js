const expect = require('chai').assert
const CDI = require('../../src/')

let _cdi
class Controller {
  constructor () {
    const cdi = new CDI()

    _cdi = cdi

    cdi.addInterceptorVariable('_var1', async (fnName, args) => {
      return args && args._var1 ? args._var1 + '_interceptor' : '_interceptor'
    })

    cdi.setInterceptorCatch(async (err, fnName, args) => {
      if (args && args._var1) {
        return err.message + ' + effect + ' + fnName
      }

      throw err
    })

    const _module = cdi.configure({})

    return _module
  }
}

describe('Catchs inject variable with intercept', function () {
  before(function () {
    this.target = new Controller()

    this.target.fn = async () => {
      throw new Error(`capture error catch interceptor`)
    }
  })

  it('should pass message error with concatened effect of interceptor', async function () {
    expect.equal(await this.target.fn({ _var1: 'test222' }), 'capture error catch interceptor + effect + fn')
  })

  it('should catch error because rethrow error', async function () {
    try {
      await this.target.fn()

      throw new Error()
    } catch (err) {
      expect.equal(err.message, 'capture error catch interceptor')
    }
  })

  it('should catch error because reset Catch function', async function () {
    try {
      _cdi.setInterceptorCatch(async (err, args) => {
        if (args._var1) {
          return err.message + ' + effect'
        }

        throw err
      })

      throw new Error()
    } catch (err) {
      expect.equal(err.message, 'already exists a configured Error Interceptor')
    }
  })
})
