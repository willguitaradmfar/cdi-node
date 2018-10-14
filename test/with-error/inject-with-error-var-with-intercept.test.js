const expect = require('chai').assert
const CDI = require('../../src/')

describe('throw error normal and Interceptor', function () {
  before(function () {
    this.cdiClass = new CDI()

    this.target = this.cdiClass.configure({})

    this.target.fn = async ({ _var1 }) => {
      throw new Error(`error from function`)
    }
  })

  it('should pass _var1 and response with interceptor', async function () {
    try {
      await this.target.fn({ _var1: 'test222' })
    } catch (err) {
      expect.equal(err.message, 'error from function')
    }
  })

  it('should pass _var1 undefined and response with interceptor', async function () {
    this.cdiClass.addInterceptorVariable('_var1', async (args) => {
      throw new Error(`error from interceptor`)
    })
    try {
      await this.target.fn({ _var1: 'test222' })
    } catch (err) {
      expect.equal(err.message, 'error from interceptor')
    }
  })
})
