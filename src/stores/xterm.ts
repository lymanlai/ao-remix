import { acceptHMRUpdate, defineStore } from 'pinia'
import { useElementSize, useStorage } from '@vueuse/core'
import { createDataItemSigner, results } from '@permaweb/aoconnect'

// import { Terminal } from '@xterm/xterm'
import * as pkg from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import { FitAddon } from '@xterm/addon-fit'
import { CanvasAddon } from '@xterm/addon-canvas'
import { SearchAddon } from '@xterm/addon-search'
import { WebLinksAddon } from '@xterm/addon-web-links'
import xtermTheme from 'xterm-theme'

const { Terminal } = pkg

export const useXtermStore = defineStore('xterm', () => {
  const route = useRoute('/p/[pid]')
  let xtermThemeIndex = $(useStorage('xtermThemeIndex', 0))
  const { sendMessage, readMessage } = $(useAoStore())
  const wrapRef = $ref(null)
  const terminalRef = $ref(null)
  const { width, height } = $(useElementSize(wrapRef))
  const process = $computed(() => route.params.pid)

  const rows = $computed(() => `${(Number(height) / 16 - 5)}`)
  const cols = $computed(() => `${Number(width) / 14}`)

  const themeKey = Object.keys(xtermTheme)
  const term = new Terminal({
    rows: Number.parseInt(rows),
    cols: Number.parseInt(cols),
    convertEol: true,
    scrollback: 50,
    disableStdin: false,
    cursorStyle: 'block',
    cursorBlink: true,
    theme: xtermTheme[themeKey[xtermThemeIndex]],
  })

  term.prompt = () => {
    term.write('\r\n$ ')
  }

  const themeName = $computed(() => themeKey[xtermThemeIndex])
  const currentTheme = $computed(() => xtermTheme[themeName])
  const updateTheme = async () => {
    xtermThemeIndex++
    if (xtermThemeIndex >= themeKey.length)
      xtermThemeIndex = 0

    term.options.theme = currentTheme
  }
  const fitAddon = new FitAddon()
  term.loadAddon(fitAddon)

  term.loadAddon(new CanvasAddon())

  const searchAddon = new SearchAddon()
  term.loadAddon(searchAddon)

  term.loadAddon(new WebLinksAddon())
  let userInput = $ref('')
  onMounted(() => {
    term.open(terminalRef)
    fitAddon.fit()

    term.writeln('Welcome to \x1B[1;3;31mxterm.js\x1B[0m')
    term.writeln('This is a local terminal emulation, without a real terminal in the back-end.')
    term.writeln('Type some keys and commands to play around.')
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')

    term.onKey(async (e) => {
      const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey
      let message = ''
      switch (e.domEvent.key) {
        case 'Enter':
          if (userInput === '')
            return

          message = await sendMessage(process, userInput)
          userInput = ''
          term.write('\r\n')
          term.writeln(await readMessage(message, process))
          return
        case 'Backspace':
          term.write('\b \b')
          userInput = userInput.substring(-1)
          return
        default:
          if (printable) {
            term.write(e.key)
            userInput = `${userInput}${e.key}`
          }
          else {
            // console.log(`====> unknown case :`, e)
          }
      }
    })
  })

  let items = $ref()
  watchEffect(async () => {
    const rz = await results({
      process,
      // from: cursor,
      sort: 'DESC',
      // sort: 'ASC',
      limit: 25,
    })

    items = rz.edges.reverse()
    items.forEach((item) => {
      const v = item.node.Output.data
      term.writeln(v)
    })

    // searchAddon.findNext('Previous')
    // const rz2 = term.getSelection()
  })

  return $$({
    wrapRef,
    terminalRef,
    updateTheme,
    themeName,
    currentTheme,
  })
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useXtermStore as any, import.meta.hot))
