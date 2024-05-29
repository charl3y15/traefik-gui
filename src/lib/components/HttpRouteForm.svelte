<script lang="ts">
  import type { HttpRoute, HttpRouteOptions, RouteMode } from "$lib/types";

  export let route: HttpRoute;

  function generateOptions(mode: RouteMode): HttpRouteOptions {
    switch (mode) {
      case "host":
        return { host: "" };
      case "rule":
        return { rule: "" };
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
      <option value="rule">Rule</option>
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
  {:else if route.mode === "rule"}
    <div class="form-control mb-2">
      <label for="rule" class="label">
        <span class="label-text">Rule:</span>
      </label>
      <input
        id="rule"
        type="text"
        bind:value={route.options.rule}
        class="input input-bordered"
        name="rule"
        required
      />
    </div>
  {/if}
</div>
