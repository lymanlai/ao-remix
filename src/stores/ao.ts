import { acceptHMRUpdate, defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { createAvatar } from '@dicebear/core'
import { botttsNeutral } from '@dicebear/collection'
import { message as aoSendMessage, createDataItemSigner, result } from '@permaweb/aoconnect'

export const useAoStore = defineStore('ao', () => {
  const aoCache = $(useStorage('ao', { }))

  async function doAdd(pid) {
    if (aoCache[pid])
      return false

    const avatar = await createAvatar(botttsNeutral, {
      seed: pid,
      backgroundColor: ['a3e635', 'fb923c', 'ef4444', 'd946ef'],
    }).toDataUri()

    aoCache[pid] = {
      createdAt: new Date(),
      avatar,
    }
    return true
  }

  async function doDelete(pid) {
    delete aoCache[pid]
  }

  const sendMessage = async (process, data) => {
    await globalThis.arweaveWallet.connect(['SIGN_TRANSACTION'])
    const message = await aoSendMessage({
      process,
      signer: createDataItemSigner(globalThis.arweaveWallet),
      data,
      // tags: [
      //   {name: '', value: ''}
      // ]
    })
    return message
  }

  const readMessage = async (message, process) => {
    const { Messages, Spawns, Output, Error } = await result({
      message,
      process,
    })
    return Output.data
  }

  return $$({
    doAdd,
    doDelete,
    sendMessage,
    readMessage,
    aoCache,
  })
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAoStore as any, import.meta.hot))
