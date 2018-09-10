'user strict'

/*
* This class loads the Filter configuration and validates the confiuration
* @Author: Ben Smith
* @Date: Sept 9th, 2018
*/

// 'Private' class variables
const _logger = Symbol('logger')
const _jsonObj = Symbol('JSONObj')
const _filterRules = Symbol('FilterRules')
const _shouldThrowError = Symbol('shouldThrowError')

// 'Private' class methods
const _validateShouldThrowError = Symbol('validateShouldThrowError')
const _validateFilterRule = Symbol('validateFilterRule')

class FilterConfig {

  constructor (logger, jsonObj) {
    this[_logger] = logger
    this[_jsonObj] = jsonObj
    this[_logger].debug(`FilterConfig Object has received the following config ${JSON.stringify(jsonObj, null, 2)}
  }

  async loadConfigurations() {
    // Validate shouldThrowError Configuration
    this[_shouldThrowError] = await [_validateShouldThrowError](this[_jsonObj])
    const filterRules = this[_jsonObj]['filterRules']

    // Validate filterRules
    this[_filterRules] = []
    for (const filterRule of filterRules){
      this[_filterRules].add(await this[_validateThrowErrorConfig](this[_jsonObj]))
    }
  }

  async [_validateShouldThrowError](jsonObj) {
    const shouldThrowError= jsonObj['shouldThrowError']
    if (typeof throwsError !== 'boolean') {
      const errorDesc = `A Filter rule for the key ${key} has encountered '${shouldThrowError}' for the throwsError. ThrowsError can only be a Boolean.`
      this[_logger].error(errorDesc)
      throw new Error(errorDesc)
    }
    return shouldThrowError
  }

  async [_validateFilterRule](filterRule) {

    // Checking the surface level configuration for existence and they are the arrays
    if (!('key' in filterRule ) || !('acceptedValues' in filterRule) || !('location' in filterRule) || !('typeOfMatch' in filterRule)) {
      const errorDesc = `Filter configuration is missing either 'key', 'acceptedValues', 'location', 'typeOfMatch', or 'throwsError' for the filtered data ${filterRule}.`
      this[_logger].error(errorDesc)
      throw new Error(errorDesc)
    }

    const key = filterRule['key']
    if (typeof typeOfMatch !== 'string' && !(typeOfMatch instanceof String)) {
      const errorDesc = `A Filter rule for the key ${key} is not a string. The Key configuration can only be String.`
      this[_logger].error(errorDesc)
      throw new Error(errorDesc)
    }

    const acceptedValues = filterRule['acceptedValues']
    if (typeof acceptedValues !== 'object' || acceptedValues.constructor !== Array) {
      const errorDesc = `A Filter rule for the key ${key} has encountered '[${acceptedValues.join(', ')}]' for the acceptedValues. AcceptedValues can only be an Array.`
      this[_logger].error(errorDesc)
      throw new Error(errorDesc)
    }

    const locationOfData = filterRule['location']
    if (typeof locationOfData !== 'object' || locationOfData.constructor !== Array) {
      const errorDesc = `A Filter rule for the key ${key} has encountered '[${locationOfData.join(', ')}]' for the locationOfData. LocationOfData can only be an Array.`
      this[_logger].error(errorDesc)
      throw new Error(errorDesc)
    }

    const typeOfMatch = filterRule['typeOfMatch']
    if (typeof typeOfMatch !== 'string' && !(typeOfMatch instanceof String)) {
      const errorDesc = `A Filter rule for the key ${key} has encountered '[${typeOfMatch.join(', ')}]' for the typeOfMatch .TypeOfMatch can only be a String.`
      this[_logger].error(errorDesc)
      throw new Error(errorDesc)
    }

    return filterRule
  }
  
  get filterRules () {
    return this[_filterRules]
  }

  get shouldThrowError() {
    return this[_shouldThrowError]
  }
} 

module.exports = FilterConfig
