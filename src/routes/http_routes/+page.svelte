<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import type { HttpRoute } from '$lib/types';

  let http_routes = writable<HttpRoute[]>([]);
  let name = '';
  let target = '';
  let rule = '';
  let errorMessage = '';

  async function fetchRoutes() {
    const response = await fetch('/api/http_routes');
    const data = await response.json();
    http_routes.set(data.httpRoutes as HttpRoute[]);
  }

  async function addRoute() {
    const response = await fetch('/api/http_routes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, target, rule })
    });

    if (response.ok) {
      await fetchRoutes(); // Refresh the list after adding a new route
      name = '';
      target = '';
      rule = '';
      errorMessage = '';
    } else {
      const errorData = await response.json();
      errorMessage = errorData.error || 'Failed to add route';
    }
  }

  async function deleteRoute(id: number) {
    const response = await fetch(`/api/http_routes/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await fetchRoutes(); // Refresh the list after deleting a route
    } else {
      console.error('Failed to delete route');
    }
  }

  onMount(fetchRoutes);
</script>

<main class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">HTTP Routes</h1>

  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  <form on:submit|preventDefault={addRoute} class="mb-4">
    <div class="form-control mb-2">
      <label for="name" class="label">
        <span class="label-text">Name:</span>
      </label>
      <input id="name" type="text" bind:value={name} class="input input-bordered" required>
    </div>
    <div class="form-control mb-2">
      <label for="target" class="label">
        <span class="label-text">Target:</span>
      </label>
      <input id="target" type="text" bind:value={target} class="input input-bordered" required>
    </div>
    <div class="form-control mb-2">
      <label for="rule" class="label">
        <span class="label-text">Rule:</span>
      </label>
      <input id="rule" type="text" bind:value={rule} class="input input-bordered" required>
    </div>
    <button type="submit" class="btn btn-primary">Add Route</button>
  </form>

  <table class="table table-zebra w-full">
    <thead>
      <tr>
        <th>Name</th>
        <th>Target</th>
        <th>Rule</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each $http_routes as route}
        <tr>
          <td>{route.name}</td>
          <td>{route.target}</td>
          <td>{route.rule}</td>
          <td>
            <button on:click={() => deleteRoute(route.id)} class="btn btn-error">Delete</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>
