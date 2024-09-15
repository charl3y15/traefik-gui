<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import type { TlsRoute } from "$lib/types";
  import TlsRouteForm from "$lib/components/TlsRouteForm.svelte";

  let tls_routes = writable<TlsRoute[]>([]);
  let route: TlsRoute = generateEmptyRoute();

  let errorMessage = "";

  async function fetchRoutes() {
    const response = await fetch("/api/tls_routes");
    const data = await response.json();
    tls_routes.set(data.tls_routes as TlsRoute[]);
  }

  async function addRoute() {
    // clone route and remove id
    let post_route: Partial<TlsRoute> = { ...route };
    delete post_route.id;

    if (post_route.options?.priority == null) {
      delete post_route.options?.priority;
    }

    const response = await fetch("/api/tls_routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(post_route),
    });

    if (response.ok) {
      await fetchRoutes(); // Refresh the list after adding a new route
      route = {
        id: 0,
        name: "",
        target: "",
        mode: "host",
        options: {
          host: "",
        },
      };
      errorMessage = "";
    } else {
      const errorData = await response.json();
      errorMessage = errorData.error || "Failed to add route";
    }
  }

  async function deleteRoute(id: number) {
    const response = await fetch(`/api/tls_routes/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await fetchRoutes(); // Refresh the list after deleting a route
    } else {
      console.error("Failed to delete route");
    }
  }

  function ruleDisplay(route: TlsRoute): string {
    switch (route.mode) {
      case "host":
        return `Host: "${route.options.host}"`;
      case "host_regex":
        return `Host-Regex: "${route.options.host_regex}"`;
    }
  }

  function generateEmptyRoute(): TlsRoute {
    return {
      id: 0,
      name: "",
      target: "",
      mode: "host",
      options: {},
    };
  }

  onMount(fetchRoutes);
</script>

<main class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">TLS Routes</h1>

  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  <form on:submit|preventDefault={addRoute} class="mb-4">
    <TlsRouteForm bind:route />
    <button type="submit" class="btn btn-primary">Add Route</button>
  </form>

  <table class="table table-zebra w-full">
    <thead>
      <tr>
        <th>Name</th>
        <th>Target</th>
        <th>Rule</th>
        <th>ACME-HTTP</th>
        <th>Priority</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each $tls_routes as route}
        <tr>
          <td>{route.name}</td>
          <td>{route.target}</td>
          <td>{ruleDisplay(route)}</td>
          {#if route.acme_http01_challenge}
            <td>Port: {route.options.acme_port}</td>
          {:else}
            <td>-</td>
          {/if}
          <td>
            {#if route.options.priority == null}
              -
            {:else}
              {route.options.priority}
            {/if}
          </td>

          <td>
            <button on:click={() => deleteRoute(route.id)} class="btn btn-error"
              >Delete</button
            >
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>
