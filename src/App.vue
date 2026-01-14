<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"
import * as Blockly from "blockly/core"
import "blockly/blocks"
import { setBlocklyLocale } from "./blockly/locale"
import { defineBlocks } from "./blockly/blocks"
import { toolbox } from "./blockly/toolbox"
import { initPythonGenerator } from "./blockly/pythonGenerator"
import { runPython } from "./blockly/skulptRunner"

const workspaceHost = ref<HTMLDivElement | null>(null)
const codePreview = ref("")
const statusText = ref("准备就绪")
const idleStatus = statusText.value
const runOutput = ref("")
const storageKey = "blockly-workspace"
let saveTimer: number | null = null
let suppressSave = false

let workspace: Blockly.WorkspaceSvg | null = null
const generator = initPythonGenerator()

const updateCode = () => {
  if (!workspace) return
  const code = generator.workspaceToCode(workspace)
  codePreview.value = code.trim() || "# 在左侧拖入方块生成Python代码"
}

const handleResize = () => {
  if (workspace) {
    Blockly.svgResize(workspace)
  }
}

const saveWorkspace = () => {
  if (!workspace || suppressSave) return
  if (saveTimer) {
    window.clearTimeout(saveTimer)
  }
  saveTimer = window.setTimeout(() => {
    const state = Blockly.serialization.workspaces.save(workspace!)
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, 250)
}

const restoreWorkspace = () => {
  if (!workspace) return
  const raw = localStorage.getItem(storageKey)
  if (!raw) return
  try {
    const state = JSON.parse(raw)
    suppressSave = true
    Blockly.serialization.workspaces.load(state, workspace)
  } catch {
    localStorage.removeItem(storageKey)
  } finally {
    suppressSave = false
  }
}

const handleClearWorkspace = () => {
  if (!workspace) return
  suppressSave = true
  workspace.clear()
  suppressSave = false
  localStorage.removeItem(storageKey)
  updateCode()
}

const handleRun = () => {
  if (!codePreview.value.trim()) {
    statusText.value = "No code to run."
    window.setTimeout(() => {
      statusText.value = idleStatus
    }, 1600)
    return
  }

  runOutput.value = ""
  statusText.value = "Running..."

  runPython(codePreview.value, (text) => {
    runOutput.value += text
  })
    .then(() => {
      if (!runOutput.value) {
        runOutput.value = ""
      }
      statusText.value = "运行成功"
    })
    .catch((error) => {
      const message = error instanceof Error ? error.message : String(error)
      runOutput.value =
        (runOutput.value ? `${runOutput.value}\n` : "") + `Error: ${message}`
      statusText.value = "运行失败"
    })
    .finally(() => {
      window.setTimeout(() => {
        statusText.value = idleStatus
      }, 2000)
    })
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
  link.download = "demo.py"
  link.click()
  URL.revokeObjectURL(url)
  statusText.value = "已导出代码文件"
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
    renderer: "zelos",
    theme: Blockly.Themes.Zelos,
    media: "/blockly-media/",
  })
  workspace.addChangeListener(updateCode)
  workspace.addChangeListener(saveWorkspace)
  updateCode()
  restoreWorkspace()
  window.addEventListener("resize", handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize)
  if (workspace) {
    workspace.dispose()
    workspace = null
  }
  if (saveTimer) {
    window.clearTimeout(saveTimer)
  }
})
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="brand">
        <span class="brand-badge">草履虫</span>
        <div>
          <h1>拖拽式代码生成网页</h1>
          <p>拖拽方块，实时生成可执行的 Python 代码</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn ghost" type="button" @click="handleClearWorkspace">
          清除
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
        </div>
        <div class="workspace-stage" ref="workspaceHost"></div>
      </section>

      <aside class="side-panel">
        <div class="panel-head">
          <div>
            <h2>Python 代码</h2>
            <p>由左侧的积木块自动生成</p>
          </div>
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
        <div class="output-label">运行结果</div>
        <pre class="code-preview output-preview"><code>{{ runOutput }}</code></pre>
      </aside>
    </main>

    <footer class="app-footer">
      <div>提示：初学者可从“基础”和“逻辑”开始组合，再尝试循环与列表</div>
      <div class="footer-pill">当前模式：基础Python语法</div>
    </footer>
  </div>
</template>
