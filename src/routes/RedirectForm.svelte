<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  interface Redirect {
    id: number;
    name: string;
    target: string;
    rule: string;
  }

  const redirects = writable<Redirect[]>([]);

  let name = '';
  let target = '';
  let rule = '';

  onMount(async () => {
    const res = await fetch('/api/redirects');
    const data = await res.json();
    redirects.set(data.redirects);
  });

  async function addRedirect() {
    const res = await fetch('/api/redirects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, target, rule })
    });

    const newRedirect = await res.json();
    redirects.update(rs => [...rs, newRedirect]);
    name = '';
    target = '';
    rule = '';
  }
</script>

<style>
  form {
    margin: 20px;
    padding: 20px;
    border: 1px solid #ccc;
  }

  label {
    display: block;
    margin-bottom: 8px;
  }

  input {
    margin-bottom: 12px;
    padding: 8px;
    width: calc(100% - 16px);
  }

  button {
    padding: 10px 20px;
  }

  .redirects-list {
    margin: 20px;
  }

  .redirect-item {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
  }
</style>

<form on:submit|preventDefault={addRedirect}>
  <label for="name">Name:</label>
  <input type="text" id="name" bind:value={name} required />

  <label for="target">Ziel:</label>
  <input type="text" id="target" bind:value={target} required />

  <label for="rule">Traefik Regel:</label>
  <input type="text" id="rule" bind:value={rule} required />

  <button type="submit">Hinzufügen</button>
</form>

<div class="redirects-list">
  {#each $redirects as redirect (redirect.id)}
    <div class="redirect-item">
      <strong>{redirect.name}</strong><br />
      Ziel: {redirect.target}<br />
      Regel: {redirect.rule}
    </div>
  {/each}
</div>
