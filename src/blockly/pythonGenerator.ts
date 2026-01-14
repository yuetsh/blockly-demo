import { pythonGenerator } from 'blockly/python'
import type { Block } from 'blockly/core'

export const initPythonGenerator = () => {
  pythonGenerator.forBlock['cn_print'] = (block: Block, generator) => {
    const text = generator.valueToCode(block, 'TEXT', generator.ORDER_NONE) || "''"
    return `print(${text})\n`
  }

  pythonGenerator.forBlock['cn_input'] = (block: Block, generator) => {
    const prompt = generator.valueToCode(block, 'PROMPT', generator.ORDER_NONE)
    const code = prompt ? `input(${prompt})` : 'input()'
    return [code, generator.ORDER_FUNCTION_CALL]
  }

  pythonGenerator.addReservedWords('input,print')

  return pythonGenerator
}
