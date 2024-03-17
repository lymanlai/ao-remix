<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})

const router = useRouter()
const { doAdd } = $(useAoStore())
let pid = $ref('hiAi3Ka_Xms2KH5xfWV4uG4AZiQ_VxxbW-_PAhRt3xs')
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
        <a text-6xl rel="noreferrer" href="https://github.com/lymanlai/ao-remix" target="_blank">
          AO Remix
        </a>
      </p>
      <p mt-20>
        <em text-3xl opacity-75>Bring AO Machine into Web2 Users to make massive adoption</em>
      </p>

      <div class="min-h-[30vh] flex flex-col items-center justify-center">
        <TheInput v-model="pid" placeholder="Input your AO Machine ID" autocomplete="false" @keydown.enter="go" />
        <label class="hidden" for="input">{{ t('intro.whats-your-name') }}</label>

        <div w-100>
          <button p="x-4 y-2" mt-5 w-full text-2xl btn :disabled="!pid" @click="go">
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
