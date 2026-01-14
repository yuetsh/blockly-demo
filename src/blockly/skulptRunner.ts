//@ts-ignore
import Sk from "skulpt"

type OutputHandler = (text: string) => void

const readBuiltinFile = (path: string) => {
  if (!Sk?.builtinFiles?.files?.[path]) {
    throw new Error(`Skulpt file not found: ${path}`)
  }
  return Sk.builtinFiles.files[path]
}

export const runPython = async (code: string, onOutput: OutputHandler) => {
  if (!Sk) {
    throw new Error("Skulpt failed to load.")
  }

  Sk.configure({
    output: (text: string) => onOutput(text),
    read: readBuiltinFile,
    inputfun: (prompt: string) => {
      const response = window.prompt(prompt || "请输入")
      if (response === null) {
        throw new Error("用户取消输入")
      }
      return response
    },
    inputfunTakesPrompt: true,
  })

  await Sk.misceval.asyncToPromise(() =>
    Sk.importMainWithBody("<stdin>", false, code, true)
  )
}
