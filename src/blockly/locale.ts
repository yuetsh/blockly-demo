import * as Blockly from 'blockly'
import * as zhHans from 'blockly/msg/zh-hans'

export const setBlocklyLocale = () => {
  Blockly.setLocale(zhHans)
}
