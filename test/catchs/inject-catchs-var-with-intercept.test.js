const expect = require('chai').assert
const CDI = require('../../src/')

class Controller {
  constructor () {
    const cdi = new CDI()

    cdi.addInterceptorVariable('_var1', async (args) => {
      return args._var1 ? args._var1 + '_interceptor' : '_interceptor'
    })

    cdi.addInterceptorsCatch('fn', async (err, args) => {
      if (args._var1) {
        return err.message + ' + effect'
      }

      throw err
    })

    cdi.addInterceptorsCatch('fn_notexists', async (err, args) => {
      if (args._var1) {
        return err.message + ' + effect'
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

    this.target.fn = async ({ _var1 }) => {
      throw new Error(`capture error catch interceptor`)
    }
  })

  it('should pass message error with concatened effect of interceptor', async function () {
    expect.equal(await this.target.fn({ _var1: 'test222' }), 'capture error catch interceptor + effect')
  })

  it('should catch error because rethrow error', async function () {
    try {
      await this.target.fn({ })
    } catch (err) {
      expect.equal(err.message, 'capture error catch interceptor')
    }
  })
})
