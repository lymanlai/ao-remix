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
    <TransitionRoot :show="!open" class="cursor-pointer top-4 right-4 z-99 fixed" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
      <div class="flex flex-col items-end">
        <button class="rounded-full font-bold bg-blue-500 shadow-lg text-white py-2 px-4 hover:(bg-blue-600)" @click="open = true">
          Switch Process
        </button>
        <button :style="{ background: currentTheme.foreground, color: currentTheme.background }" class="rounded-full flex font-bold shadow-lg mt-4 py-2 px-4 items-center justify-center hover:(opacity-80)" @click="updateTheme">
          {{ themeName.replace('_', ' ') }}
          <div i-heroicons-swatch-20-solid ml-2 />
        </button>
      </div>
    </TransitionRoot>
    <RouterView />

    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="z-10 relative" :initial-focus="pidInputRef" @close="open = false">
        <div class="inset-0 fixed" />

        <div class="inset-0 fixed overflow-hidden">
          <div class="inset-0 absolute overflow-hidden">
            <div class="flex max-w-full pl-10 inset-y-0 right-0 pointer-events-none fixed sm:pl-16">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="max-w-md w-screen pointer-events-auto">
                  <div class="bg-white flex flex-col h-full shadow-xl overflow-y-scroll">
                    <div class="p-6">
                      <div class="flex items-start justify-between">
                        <DialogTitle class="flex font-semibold text-base w-full text-gray-900 leading-6 items-center">
                          <a href="/" class="flex items-center justify-center">
                            <img src="/pwa-192x192.png" class="w-20">
                            <span text-3xl>AO Remix</span>
                          </a>
                        </DialogTitle>
                        <div class="flex h-7 ml-3 items-center">
                          <button type="button" class="bg-white rounded-md text-gray-400 relative hover:text-gray-500 focus:ring-2 focus:ring-indigo-500" @click="open = false">
                            <span class="-inset-2.5 absolute" />
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="flex m-5 justify-between">
                      <input id="pid" ref="pidInputRef" v-model="pid" type="text" placeholder="Your PID" name="pid" autocomplete="given-name" class="rounded-l-md border-0 shadow-sm ring-inset w-full py-1.5 px-2 ring-1 ring-gray-300 text-gray-900 block placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:ring-inset focus:ring-2 focus:ring-indigo-600">
                      <button type="button" class="bg-white rounded-r-md font-semibold shadow-sm ring-inset text-sm py-1.5 px-3 ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50" @click="tryAdd">
                        Add
                      </button>
                    </div>
                    <div v-if="false" class="border-b border-gray-200">
                      <div class="px-6">
                        <nav class="flex -mb-px space-x-6">
                          <a v-for="tab in tabs" :key="tab.name" :href="tab.href" class="font-medium border-b-2 text-sm px-1 pb-4 whitespace-nowrap" :class="[tab.current ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']">{{ tab.name }}</a>
                        </nav>
                      </div>
                    </div>
                    <ul role="list" class="divide-y divide-gray-200 flex-1 overflow-y-auto">
                      <li v-for="(item, pid) in aoCache" :key="pid">
                        <div class="flex py-6 px-5 group relative items-center" :class="isCurrent(pid) ? 'bg-green-300' : ''">
                          <button class="flex-1 -m-1 p-1 block" @click="go(pid)">
                            <div class="inset-0 absolute group-hover:bg-green-300" aria-hidden="true" />
                            <div class="flex flex-1 min-w-0 relative items-center">
                              <span class="flex-shrink-0 relative inline-block">
                                <img class="rounded-lg h-10 w-10" :src="item.avatar" alt="">
                                <span class="rounded-full h-2.5 ring-white top-0 right-0 ring-2 w-2.5 absolute block" :class="[item.status === 'online' ? 'bg-green-400' : 'bg-gray-300']" aria-hidden="true" />
                              </span>
                              <div class="ml-4 truncate">
                                <p class="font-medium text-sm text-gray-900 truncate">
                                  {{ pid }}
                                </p>
                                <!-- <p class="text-sm text-gray-500 truncate">{{ `@${item.handle}` }} handle</p> -->
                              </div>
                            </div>
                          </button>
                          <Menu as="div" class="flex-shrink-0 text-left ml-2 relative inline-block">
                            <MenuButton class="bg-white rounded-full h-8 w-8 group relative inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              <span class="-inset-1.5 absolute" />
                              <span class="sr-only">Open options menu</span>
                              <span class="rounded-full flex h-full w-full items-center justify-center">
                                <EllipsisVerticalIcon class="h-5 text-gray-400 w-5 group-hover:text-gray-500" aria-hidden="true" />
                              </span>
                            </MenuButton>
                            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                              <MenuItems class="bg-white rounded-md shadow-lg ring-black origin-top-right top-0 right-9 ring-1 ring-opacity-5 w-48 z-10 absolute focus:outline-none">
                                <div class="py-1">
                                  <MenuItem v-slot="{ active }">
                                    <button class="bg-red text-sm text-white w-full py-2 px-4 block" @click="doDelete(pid)">
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
