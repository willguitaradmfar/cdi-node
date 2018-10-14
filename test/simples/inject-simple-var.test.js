const expect = require('chai').assert
const CDI = require('../../src/')

describe('Simples inject variable', function () {
  before(function () {
    this.cdiClass = new CDI()

    this.target = this.cdiClass.configure({})

    this.target.fn = async ({ _var1 }) => {
      return new Promise((resolve, reject) => {
        return resolve(_var1)
      })
    }
  })
  it('should instance of CDI', function () {
    expect.instanceOf(this.cdiClass, CDI)
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

  it('should throw error because Property not found', async function () {
    try {
      await this.target.fn_notexists({ _var1: 'test1' })
      throw new Error('test')
    } catch (err) {
      expect.equal(err.message, 'Property not found')
    }
  })

  it('should throw error because only 1 argument of object type is allowed', async function () {
    try {
      await this.target.fn('ss')
      throw new Error('test')
    } catch (err) {
      expect.equal(err.message, 'only 1 argument of object type is allowed')
    }
  })

  it('should throw error because was missing the variable "target"', async function () {
    try {
      this.cdiClass.configure()
      throw new Error('test')
    } catch (err) {
      expect.equal(err.message, 'was missing the variable "target"')
    }
  })
})
