<script lang="ts">
  import type { Stats } from "$lib/types";
  import { onMount } from "svelte";

  let stats: Stats | null = null;

  async function getStats() {
    const response = await fetch("/api/stats");
    const data = await response.json();
    stats = data.stats;
  }

  onMount(getStats);
</script>

<main class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">Traefik-GUI</h1>

  {#if stats !== null}
    <div class="stats shadow">
      <div class="stat place-items-center">
        <div class="stat-title">HTTP-Routes</div>
        <div class="stat-value text-primary">{stats.http_routes}</div>
        <div class="stat-desc">Forward HTTP Requests</div>
      </div>

      <div class="stat place-items-center">
        <div class="stat-title">TLS-Routes</div>
        <div class="stat-value text-secondary">{stats.tls_routes}</div>
        <div class="stat-desc">Passthrough encrypted TLS sessions</div>
      </div>
    </div>
  {/if}

  <div class="text-xl pt-8">
    <p class="py-2">Welcome to Traefik-GUI!</p>
    <p class="py-2">
      This software will help you set manual traefik routes to other devices in
      your network without having to manually manage the traefik configuration.
    </p>

    <p class="py-2">
      It is currently in development and not yet recommended for production use.
    </p>

    <p class="py-2">
      If you have any questions, please visit the <a
        class="link"
        href="https://github.com/rahn-it/traefik-gui/issues"
        >project's Github page</a
      >.
    </p>
  </div>
</main>
