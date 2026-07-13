<script setup lang="ts">
</script>

<template>
  <section class="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
    <div class="wrap">
      <div class="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div class="lg:col-span-6 animate-fade-up">
          <div class="chip mb-6">
            <span class="h-1.5 w-1.5 rounded-full" style="background: var(--green)" />
            开源 · 免费 · 零配置
          </div>

          <h1
            class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
            style="color: var(--ink)"
          >
            局域网游戏
            <br />
            <span style="color: var(--mute)">远程联机，就这一步。</span>
          </h1>

          <p class="mt-5 max-w-md text-base leading-relaxed sm:text-lg" style="color: var(--mute)">
            无需公网 IP、端口映射或 VPN。
            基于 Cloudflare 边缘网络，开服即连。
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <a href="#download" class="btn-solid">下载客户端</a>
            <a href="#how" class="btn-line">查看流程</a>
          </div>

          <dl
            class="mt-12 grid max-w-sm grid-cols-3 gap-4 border-t pt-8"
            style="border-color: var(--line)"
          >
            <div>
              <dt class="text-2xs uppercase tracking-wider" style="color: var(--mute)">延迟</dt>
              <dd class="mt-1 font-mono text-lg" style="color: var(--ink)">+0ms</dd>
            </div>
            <div>
              <dt class="text-2xs uppercase tracking-wider" style="color: var(--mute)">体积</dt>
              <dd class="mt-1 font-mono text-lg" style="color: var(--ink)">&lt;20MB</dd>
            </div>
            <div>
              <dt class="text-2xs uppercase tracking-wider" style="color: var(--mute)">价格</dt>
              <dd class="mt-1 font-mono text-lg" style="color: var(--green)">Free</dd>
            </div>
          </dl>
        </div>

        <div class="lg:col-span-6 animate-fade-up" style="animation-delay: 80ms">
          <div class="panel overflow-hidden">
            <div
              class="flex items-center gap-2 border-b px-4 py-3"
              style="border-color: var(--line); background: var(--raised)"
            >
              <span class="h-2.5 w-2.5 rounded-full" style="background: var(--line)" />
              <span class="h-2.5 w-2.5 rounded-full" style="background: var(--line)" />
              <span class="h-2.5 w-2.5 rounded-full" style="background: var(--line)" />
              <span class="ml-3 font-mono text-2xs" style="color: var(--mute)">cloudplay — host</span>
            </div>
            <div class="grid sm:grid-cols-[140px_1fr]">
              <div
                class="hidden border-r p-3 sm:block"
                style="border-color: var(--line); background: color-mix(in srgb, var(--raised) 80%, transparent)"
              >
                <div class="mb-4 flex items-center gap-2 px-1">
                  <div
                    class="h-6 w-6 rounded-md"
                    style="background: var(--green-soft); border: 1px solid color-mix(in srgb, var(--green) 30%, var(--line))"
                  />
                  <span class="text-2xs" style="color: var(--mute)">CloudPlay</span>
                </div>
                <div class="space-y-1">
                  <div
                    class="rounded-md px-2 py-2 text-2xs"
                    style="background: var(--green-soft); color: var(--ink)"
                  >
                    开服者
                  </div>
                  <div class="rounded-md px-2 py-2 text-2xs" style="color: var(--mute)">联机者</div>
                </div>
                <div class="mt-8 flex items-center gap-1.5 px-1 text-2xs" style="color: var(--mute)">
                  <span class="h-1.5 w-1.5 rounded-full" style="background: var(--green)" />
                  LIVE
                </div>
              </div>
              <div class="space-y-4 p-5 sm:p-6">
                <div>
                  <div class="text-2xs uppercase tracking-wider" style="color: var(--mute)">房间 ID</div>
                  <div
                    class="mt-1.5 rounded-lg border px-3 py-2.5 font-mono text-sm"
                    style="border-color: var(--line); background: var(--field-bg); color: var(--ink)"
                  >
                    friday-night
                  </div>
                </div>
                <div>
                  <div class="text-2xs uppercase tracking-wider" style="color: var(--mute)">本地端口</div>
                  <div
                    class="mt-1.5 rounded-lg border px-3 py-2.5 font-mono text-sm"
                    style="border-color: var(--line); background: var(--field-bg); color: var(--ink)"
                  >
                    25565
                  </div>
                </div>
                <div
                  class="rounded-lg py-2.5 text-center text-sm font-medium"
                  style="
                    border: 1px solid color-mix(in srgb, var(--green) 55%, var(--line));
                    background: color-mix(in srgb, var(--green) 10%, transparent);
                    color: var(--green);
                  "
                >
                  启动隧道
                </div>
                <div
                  class="rounded-lg border p-3"
                  style="border-color: color-mix(in srgb, var(--green) 30%, var(--line)); background: var(--green-soft)"
                >
                  <div class="text-2xs" style="color: var(--green)">LIVE</div>
                  <div class="mt-1 font-mono text-[13px]" style="color: var(--ink)">
                    friday-night.cloudplay.lat
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
