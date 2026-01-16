import { compressSync, decompressSync, strFromU8, strToU8 } from "fflate"

export const encodeWorkspaceState = (state: object) => {
  const json = JSON.stringify(state)
  const bytes = strToU8(json)
  const compressed = compressSync(bytes, { level: 9 })
  let binary = ""
  compressed.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export const decodeWorkspaceState = (payload: string) => {
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized + "===".slice((normalized.length + 3) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  const decompressed = decompressSync(bytes)
  const json = strFromU8(decompressed)
  return JSON.parse(json)
}

export const getShareStateFromUrl = (location: Location) => {
  const searchState = new URLSearchParams(location.search).get("state")
  if (searchState) return searchState
  const hash = location.hash.replace(/^#/, "")
  return new URLSearchParams(hash).get("state")
}
