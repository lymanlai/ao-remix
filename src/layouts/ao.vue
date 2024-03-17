<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'

const tabs = [
  { name: 'All', href: '#', current: true },
  { name: 'Online', href: '#', current: false },
  { name: 'Offline', href: '#', current: false },
]

const open = ref(false)

let pid = $ref('')
const { doAdd, doDelete, aoCache } = $(useAoStore())

async function tryAdd() {
  const rz = await doAdd(pid)
  if (rz)
    pid = ''
}

// doAdd('dkbheRvopSUD7dcLiEgmiJ5LVuaqIk4AozplX95aEkA')
// doAdd('mYJwWJn7RqiRcGpQsSI5RHxB-hUkwwCF7QSMYdfLCDg')
// doAdd('dv3ZykwGgPyTWrmZ4EA3Hvd40C-5T4nHhs7f6C3wejk')
// doAdd('tK565yu5EYziK5EWDMIxIfVpXREg9M9ZjFEK1kKmLaA')
// doAdd('z6GYjx_HRubmYdnhWI0l2RnwpZm--1aw9E5rFr-2-gc')

const router = useRouter()
function go(pid) {
  router.push(`/p/${encodeURIComponent(pid)}`)
}

const route = useRoute('/p/[pid]')

function isCurrent(pid) {
  return pid === route.params.pid
}

const { updateTheme, themeName, currentTheme } = $(useXtermStore())

const pidInputRef = $ref(null)
</script>

<template>
  <div bg-red>
    <TransitionRoot :show="!open" class="fixed right-4 top-4 z-99 cursor-pointer" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
      <div class="flex flex-col items-end">
        <button class="rounded-full bg-blue-500 px-4 py-2 text-white font-bold shadow-lg hover:(bg-blue-600)" @click="open = true">
          Switch Process
        </button>
        <button :style="{ background: currentTheme.foreground, color: currentTheme.background }" class="mt-4 flex items-center justify-center rounded-full px-4 py-2 font-bold shadow-lg hover:(opacity-80)" @click="updateTheme">
          {{ themeName.replace('_', ' ') }}
          <div i-heroicons-swatch-20-solid ml-2 />
        </button>
      </div>
    </TransitionRoot>
    <RouterView />

    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10" :initial-focus="pidInputRef" @close="open = false">
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 max-w-full flex pl-10 sm:pl-16">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto max-w-md w-screen">
                  <div class="h-full flex flex-col overflow-y-scroll bg-white shadow-xl">
                    <div class="p-6">
                      <div class="flex items-start justify-between">
                        <DialogTitle class="w-full flex items-center text-base text-gray-900 font-semibold leading-6">
                          <a href="/" class="flex items-center justify-center">
                            <img src="/pwa-192x192.png" class="w-20">
                            <span text-3xl>AO Remix</span>
                          </a>
                        </DialogTitle>
                        <div class="ml-3 h-7 flex items-center">
                          <button type="button" class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500" @click="open = false">
                            <span class="absolute -inset-2.5" />
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="m-5 flex justify-between">
                      <input id="pid" ref="pidInputRef" v-model="pid" type="text" placeholder="Your PID" name="pid" autocomplete="given-name" class="block w-full border-0 rounded-l-md px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset sm:text-sm placeholder:text-gray-400 sm:leading-6 focus:ring-2 focus:ring-indigo-600 focus:ring-inset">
                      <button type="button" class="rounded-r-md bg-white px-3 py-1.5 text-sm text-gray-900 font-semibold shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50" @click="tryAdd">
                        Add
                      </button>
                    </div>
                    <div v-if="false" class="border-b border-gray-200">
                      <div class="px-6">
                        <nav class="flex -mb-px space-x-6">
                          <a v-for="tab in tabs" :key="tab.name" :href="tab.href" class="whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium" :class="[tab.current ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']">{{ tab.name }}</a>
                        </nav>
                      </div>
                    </div>
                    <ul role="list" class="flex-1 overflow-y-auto divide-y divide-gray-200">
                      <li v-for="(item, pid) in aoCache" :key="pid">
                        <div class="group relative flex items-center px-5 py-6" :class="isCurrent(pid) ? 'bg-green-300' : ''">
                          <button class="block flex-1 p-1 -m-1" @click="go(pid)">
                            <div class="absolute inset-0 group-hover:bg-green-300" aria-hidden="true" />
                            <div class="relative min-w-0 flex flex-1 items-center">
                              <span class="relative inline-block flex-shrink-0">
                                <img class="h-10 w-10 rounded-lg" :src="item.avatar" alt="">
                                <span class="absolute right-0 top-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white" :class="[item.status === 'online' ? 'bg-green-400' : 'bg-gray-300']" aria-hidden="true" />
                              </span>
                              <div class="ml-4 truncate">
                                <p class="truncate text-sm text-gray-900 font-medium">
                                  {{ pid }}
                                </p>
                                <!-- <p class="text-sm text-gray-500 truncate">{{ `@${item.handle}` }} handle</p> -->
                              </div>
                            </div>
                          </button>
                          <Menu as="div" class="relative ml-2 inline-block flex-shrink-0 text-left">
                            <MenuButton class="group relative h-8 w-8 inline-flex items-center justify-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              <span class="absolute -inset-1.5" />
                              <span class="sr-only">Open options menu</span>
                              <span class="h-full w-full flex items-center justify-center rounded-full">
                                <EllipsisVerticalIcon class="h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                              </span>
                            </MenuButton>
                            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                              <MenuItems class="absolute right-9 top-0 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div class="py-1">
                                  <MenuItem v-slot="{ active }">
                                    <button class="block w-full bg-red px-4 py-2 text-sm text-white" @click="doDelete(pid)">
                                      Delete
                                    </button>
                                  </MenuItem>
                                </div>
                              </MenuItems>
                            </transition>
                          </Menu>
                        </div>
                      </li>
                    </ul>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
