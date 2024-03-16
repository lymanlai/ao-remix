<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})

const router = useRouter()
const { doAdd } = $(useAoStore())
let pid = $ref('')
async function go() {
  if (!pid)
    return

  await doAdd(pid)
  router.push(`/p/${encodeURIComponent(pid)}`)
  pid = ''
}

const { t } = useI18n()
</script>

<template>
  <div>
    <div text-4xl>
      <img src="/pwa-512x512.png" inline-block class="w-40">
      <p>
        <a rel="noreferrer" href="https://github.com/lymanlai/ao-remix" target="_blank">
          AO Remix
        </a>
      </p>
      <p>
        <em text-sm opacity-75>Opinionated AO Machine Starter</em>
      </p>

      <div class="flex flex-col min-h-[30vh] items-center justify-center">
        <TheInput v-model="pid" placeholder="Input your ao Process ID" autocomplete="false" @keydown.enter="go" />
        <label class="hidden" for="input">{{ t('intro.whats-your-name') }}</label>

        <div>
          <button m-3 text-2xl btn :disabled="!pid" @click="go">
            {{ t('button.go') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
