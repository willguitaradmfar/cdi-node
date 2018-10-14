const expect = require('chai').assert
const CDI = require('../../src/')

describe('Simples inject variable with intercept', function () {
  before(function () {
    this.cdiClass = new CDI()

    this.cdiClass.addInterceptor('_var1', async (args) => {
      return args._var1 ? args._var1 + '_interceptor' : '_interceptor'
    })

    this.target = this.cdiClass.configure({})

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
