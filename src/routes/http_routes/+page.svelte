<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let http_routes = writable([]);
  let name = '';
  let target = '';
  let rule = '';

  async function fetchRoutes() {
    const response = await fetch('/api/http_routes');
    const data = await response.json();
    console.log(data.http_routes)
    http_routes.set(data.http_routes);
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
    } else {
      // Handle error
      console.error('Failed to add route');
    }
  }

  onMount(fetchRoutes);
</script>

<main>
  <h1>HTTP Routes</h1>

  <form on:submit|preventDefault={addRoute}>
    <div>
      <label for="name">Name:</label>
      <input id="name" type="text" bind:value={name} required>
    </div>
    <div>
      <label for="target">Target:</label>
      <input id="target" type="text" bind:value={target} required>
    </div>
    <div>
      <label for="rule">Rule:</label>
      <input id="rule" type="text" bind:value={rule} required>
    </div>
    <button type="submit">Add Route</button>
  </form>

  <ul>
    {#each $http_routes as route}
      <li>{route.name} - {route.target} - {route.rule}</li>
    {/each}
  </ul>
</main>
