'use strict'

class CodedError extends Error {
  constructor (message, code = -1) {
    super(message)
    this.code = code
  }
}

module.exports = {
  CodedError,
  /**
   * 拒绝访问错误
   */ 
  ForbiddenError: class ForbiddenError extends CodedError {
    constructor (message = 'Forbidden') {
      super(message, 1)
    }
  },
  /**
   * 无效的用户输入错误
   */
  InvalidUserInputError: class InvalidUserInputError extends CodedError {
    constructor (message = 'Invalid user input') {
      super(message, 2)
    }
  },
  /**
   * 找不到指定的资源错误
   */
  NotFoundError: class NotFoundError extends CodedError {
    constructor (message = 'Not found') {
      super(message, 3)
    }
  }
}