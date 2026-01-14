<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"
import * as Blockly from "blockly/core"
import "blockly/blocks"
import Theme from "@blockly/theme-modern"
import { setBlocklyLocale } from "./blockly/locale"
import { defineBlocks } from "./blockly/blocks"
import { toolbox } from "./blockly/toolbox"
import { initPythonGenerator } from "./blockly/pythonGenerator"

const workspaceHost = ref<HTMLDivElement | null>(null)
const codePreview = ref("")
const statusText = ref("准备就绪")

let workspace: Blockly.WorkspaceSvg | null = null
const generator = initPythonGenerator()

const updateCode = () => {
  if (!workspace) return
  const code = generator.workspaceToCode(workspace)
  codePreview.value = code.trim() || "# 在左侧拖入方块生成Python代码"
}

// const platformTheme = Blockly.Theme.defineTheme('cnPlatform', {
//   base: Blockly.Themes.Zelos,
//   componentStyles: {
//     workspaceBackgroundColour: '#f7f5ef',
//     toolboxBackgroundColour: '#f2ebe2',
//     toolboxForegroundColour: '#28343b',
//     flyoutBackgroundColour: '#fffaf2',
//     flyoutOpacity: 0.96,
//     scrollbarColour: '#c3b7aa',
//     scrollbarOpacity: 0.7,
//   },
//   fontStyle: {
//     family: '"Noto Sans SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif',
//     size: 13,
//     weight: 500,
//   },
//   blockStyles: {
//     logic_blocks: { colourPrimary: '#4f7a8f', colourSecondary: '#406574', colourTertiary: '#2f4b57' },
//     loop_blocks: { colourPrimary: '#4f8f6d', colourSecondary: '#3f7458', colourTertiary: '#2e5944' },
//     math_blocks: { colourPrimary: '#c6844a', colourSecondary: '#a96f3c', colourTertiary: '#8a592f' },
//     text_blocks: { colourPrimary: '#b86a80', colourSecondary: '#9c5668', colourTertiary: '#7d4552' },
//     list_blocks: { colourPrimary: '#6d6fb8', colourSecondary: '#595a99', colourTertiary: '#444575' },
//     variable_blocks: { colourPrimary: '#aa5d7b', colourSecondary: '#8c4c64', colourTertiary: '#6f3b4e' },
//     procedure_blocks: { colourPrimary: '#8b6d52', colourSecondary: '#705640', colourTertiary: '#54402f' },
//   },
//   categoryStyles: {
//     logic_category: { colour: '#4f7a8f' },
//     loop_category: { colour: '#4f8f6d' },
//     math_category: { colour: '#c6844a' },
//     text_category: { colour: '#b86a80' },
//     list_category: { colour: '#6d6fb8' },
//     variable_category: { colour: '#aa5d7b' },
//     procedure_category: { colour: '#8b6d52' },
//   },
// })

const handleResize = () => {
  if (workspace) {
    Blockly.svgResize(workspace)
  }
}

const handleRun = () => {
  statusText.value = "执行环境尚未接入，可先复制代码到Python环境运行"
  window.setTimeout(() => {
    statusText.value = "准备就绪"
  }, 2200)
}

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(codePreview.value)
    statusText.value = "已复制到剪贴板"
  } catch {
    statusText.value = "复制失败，请手动选择代码"
  } finally {
    window.setTimeout(() => {
      statusText.value = "准备就绪"
    }, 1800)
  }
}

const handleDownload = () => {
  const blob = new Blob([codePreview.value], { type: "text/x-python" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "blockly_program.py"
  link.click()
  URL.revokeObjectURL(url)
  statusText.value = "已导出为 .py 文件"
  window.setTimeout(() => {
    statusText.value = "准备就绪"
  }, 1800)
}

onMounted(() => {
  if (!workspaceHost.value) return
  setBlocklyLocale()
  defineBlocks()
  workspace = Blockly.inject(workspaceHost.value, {
    toolbox,
    grid: { spacing: 20, length: 3, colour: "#dfe6e9", snap: true },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 1.02,
      maxScale: 2.2,
      minScale: 0.5,
    },
    trashcan: true,
    renderer: "geras",
    theme: Theme,
    media: "/blockly-media/",
  })
  workspace.addChangeListener(updateCode)
  updateCode()
  window.addEventListener("resize", handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize)
  if (workspace) {
    workspace.dispose()
    workspace = null
  }
})
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="brand">
        <span class="brand-badge">Blockly</span>
        <div>
          <h1>中文Python可视化编程平台</h1>
          <p>拖拽方块，实时生成可执行的Python代码</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn ghost" type="button" @click="handleCopy">
          复制代码
        </button>
        <button class="btn ghost" type="button" @click="handleDownload">
          导出 .py
        </button>
        <button class="btn primary" type="button" @click="handleRun">
          运行
        </button>
      </div>
    </header>

    <main class="app-main">
      <section class="workspace-panel">
        <div class="panel-head">
          <div>
            <h2>工作区</h2>
            <p>通过分类工具箱选择方块，构建你的程序</p>
          </div>
          <div class="panel-tip">
            <span>实时反馈</span>
          </div>
        </div>
        <div class="workspace-stage" ref="workspaceHost"></div>
      </section>

      <aside class="side-panel">
        <div class="panel-head">
          <div>
            <h2>Python代码</h2>
            <p>符合PEP8风格，支持直接导出</p>
          </div>
          <div class="panel-tip">预览</div>
        </div>
        <pre class="code-preview"><code>{{ codePreview }}</code></pre>
        <div class="status-bar">
          <span>{{ statusText }}</span>
          <div class="status-actions">
            <button class="btn subtle" type="button" @click="handleCopy">
              复制
            </button>
            <button class="btn subtle" type="button" @click="handleDownload">
              导出
            </button>
          </div>
        </div>
      </aside>
    </main>

    <footer class="app-footer">
      <div>提示：初学者可从“基础”和“逻辑”开始组合，再尝试循环与列表</div>
      <div class="footer-pill">当前模式：基础Python语法</div>
    </footer>
  </div>
</template>
