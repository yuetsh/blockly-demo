import { pythonGenerator, Order } from 'blockly/python'
import type { Block } from 'blockly/core'

export const initPythonGenerator = () => {
  pythonGenerator.forBlock['cn_print'] = (block: Block, generator) => {
    const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''"
    return `print(${text})\n`
  }

  pythonGenerator.forBlock['cn_input'] = (block: Block, generator) => {
    const prompt = generator.valueToCode(block, 'PROMPT', Order.NONE)
    const code = prompt ? `input(${prompt})` : 'input()'
    return [code, Order.FUNCTION_CALL]
  }

  pythonGenerator.forBlock['cn_int'] = (block: Block, generator) => {
    const value = generator.valueToCode(block, 'VALUE', Order.NONE) || '0'
    return [`int(${value})`, Order.FUNCTION_CALL]
  }

  pythonGenerator.forBlock['cn_float'] = (block: Block, generator) => {
    const value = generator.valueToCode(block, 'VALUE', Order.NONE) || '0'
    return [`float(${value})`, Order.FUNCTION_CALL]
  }

  pythonGenerator.addReservedWords('input,print,int,float')

  return pythonGenerator
}
