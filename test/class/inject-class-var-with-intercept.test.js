const expect = require('chai').assert
const CDI = require('../../src/')

class Controller {
  constructor () {
    const cdi = new CDI()

    cdi.addInterceptorVariable('_var1', async (fnName, args) => {
      return args._var1 ? args._var1 + '_interceptor' : '_interceptor'
    })

    cdi.addInterceptorVariable('_notexitst', async (fnName, args) => {
      return '_notexitst'
    })

    const _module = cdi.configure({})

    return _module
  }
}

describe('Class inject variable with intercept', function () {
  before(function () {
    this.target = new Controller()

    this.target.fn = async ({ _var1 }) => {
      return new Promise((resolve, reject) => {
        return resolve(_var1)
      })
    }
  })

  it('should pass _var1 and response with interceptor', async function () {
    expect.equal(await this.target.fn({ _var1: 'test222' }), 'test222_interceptor')
  })

  it('should pass _var1 undefined and response with interceptor', async function () {
    expect.equal(await this.target.fn({ }), '_interceptor')
  })
})
