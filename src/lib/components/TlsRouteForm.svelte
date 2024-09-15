<script lang="ts">
  import type {
    HttpRoute,
    HttpRouteOptions,
    HttpRouteMode,
    TlsRoute,
    TlsRouteMode,
    TlsRouteOptions,
  } from "$lib/types";

  export let route: TlsRoute;

  function generateOptions(mode: TlsRouteMode): TlsRouteOptions {
    switch (mode) {
      case "host":
        return { host: "" };
      case "host_regex":
        return { host_regex: "" };
    }
  }
</script>

<div>
  <div class="form-control mb-2">
    <label for="name" class="label">
      <span class="label-text">Name:</span>
    </label>
    <input
      id="name"
      type="text"
      bind:value={route.name}
      class="input input-bordered"
      name="name"
      required
    />
  </div>
  <div class="form-control mb-2">
    <label for="target" class="label">
      <span class="label-text">Target:</span>
    </label>
    <input
      id="target"
      type="text"
      bind:value={route.target}
      class="input input-bordered"
      name="target"
      required
    />
  </div>
  <div class="form-control mb-2">
    <label for="mode" class="label">
      <span class="label-text">Mode:</span>
    </label>
    <select
      id="mode"
      bind:value={route.mode}
      on:change={() => (route.options = generateOptions(route.mode))}
      class="select select-bordered"
    >
      <option value="host">Host</option>
      <option value="host_regex">Host-Regex</option>
    </select>
  </div>
  {#if route.mode === "host"}
    <div class="form-control mb-2">
      <label for="host" class="label">
        <span class="label-text">Host:</span>
      </label>
      <input
        id="host"
        type="text"
        bind:value={route.options.host}
        class="input input-bordered"
        name="host"
        required
      />
    </div>
  {:else if route.mode === "host_regex"}
    <div class="form-control mb-2">
      <label for="rule" class="label">
        <span class="label-text">Host-Regex:</span>
      </label>
      <input
        id="rule"
        type="text"
        bind:value={route.options.host_regex}
        class="input input-bordered"
        name="rule"
        required
      />
    </div>
  {/if}
  <div class="form-control mb-2">
    <label for="acme" class="label">
      <span class="label-text">Forward ACME-Endpoint via HTTP</span>
    </label>
    <input
      id="acme"
      type="checkbox"
      bind:checked={route.acme_http01_challenge}
      class="toggle"
      name="acme"
      on:change={() => {
        if (route.acme_http01_challenge) {
          route.options.acme_port = 80;
        } else {
          delete route.options.acme_port;
        }
      }}
    />
  </div>
  {#if route.acme_http01_challenge}
    <div class="form-control mb-2">
      <label for="acme" class="label">
        <span class="label-text">ACME-HTTP-Port:</span>
      </label>
      <input
        id="acme"
        type="text"
        bind:value={route.options.acme_port}
        class="input input-bordered"
        name="acme"
        required
      />
    </div>
  {/if}
  <div class="form-control mb-2">
    <label for="priotity" class="label">
      <span class="label-text">Priority:</span>
    </label>
    <input
      id="priority"
      type="number"
      bind:value={route.options.priority}
      class="input input-bordered"
      name="priority"
    />
  </div>
</div>
