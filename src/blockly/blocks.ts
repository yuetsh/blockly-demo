import * as Blockly from 'blockly/core'

export const defineBlocks = () => {
  Blockly.Blocks['cn_print'] = {
    init() {
      this.appendValueInput('TEXT').setCheck(null).appendField('打印')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour('#4F6D7A')
      this.setTooltip('在控制台输出文本或变量内容')
      this.setHelpUrl('')
    },
  }

  Blockly.Blocks['cn_input'] = {
    init() {
      this.appendValueInput('PROMPT').setCheck(null).appendField('获取用户输入')
      this.setOutput(true, 'String')
      this.setColour('#A65D7B')
      this.setTooltip('读取用户输入的文本内容')
      this.setHelpUrl('')
    },
  }
}
