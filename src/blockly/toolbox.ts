export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '基础',
      colour: '#4F6D7A',
      contents: [
        { kind: 'block', type: 'cn_print' },
        { kind: 'block', type: 'cn_input' },
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'variables_set' },
        { kind: 'block', type: 'variables_get' },
      ],
    },
    {
      kind: 'category',
      name: '逻辑',
      colour: '#5B7C99',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_boolean' },
        { kind: 'block', type: 'logic_null' },
      ],
    },
    {
      kind: 'category',
      name: '循环',
      colour: '#6C8F5C',
      contents: [
        { kind: 'block', type: 'controls_repeat_ext' },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for' },
        { kind: 'block', type: 'controls_flow_statements' },
      ],
    },
    {
      kind: 'category',
      name: '数学',
      colour: '#C07B4E',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'math_single' },
        { kind: 'block', type: 'math_random_int' },
        { kind: 'block', type: 'math_round' },
      ],
    },
    {
      kind: 'category',
      name: '文本',
      colour: '#B56B7A',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_join' },
        { kind: 'block', type: 'text_length' },
        { kind: 'block', type: 'text_isEmpty' },
        { kind: 'block', type: 'text_print' },
      ],
    },
    {
      kind: 'category',
      name: '列表',
      colour: '#7B6BB5',
      contents: [
        { kind: 'block', type: 'lists_create_with' },
        { kind: 'block', type: 'lists_length' },
        { kind: 'block', type: 'lists_getIndex' },
        { kind: 'block', type: 'lists_setIndex' },
      ],
    },
    {
      kind: 'category',
      name: '变量',
      colour: '#A65D7B',
      custom: 'VARIABLE',
    },
    {
      kind: 'category',
      name: '函数',
      colour: '#8B6D52',
      custom: 'PROCEDURE',
    },
  ],
}
