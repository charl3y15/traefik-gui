<script lang="ts">
  import type { HttpRoute } from "$lib/types";

  export let route: HttpRoute;
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
      class="select select-bordered"
      on:change={() => (route.rule = "")}
    >
      <option value="host">Host</option>
      <option value="rule">Rule</option>
    </select>
  </div>
  <div class="form-control mb-2">
    <label for="rule" class="label">
      <span class="label-text">{route.mode === "host" ? "Host:" : "Rule:"}</span
      >
    </label>
    <input
      id="rule"
      type="text"
      bind:value={route.rule}
      class="input input-bordered"
      name="rule"
      required
    />
  </div>
</div>
