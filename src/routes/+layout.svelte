<script lang="ts">
  import "../app.css";
</script>

<main class="flex flex-col min-h-screen">
  <nav class="navbar bg-base-300 mb-4">
    <div class="container mx-auto">
      <div class="navbar-start">
        <a href="/" class="btn btn-ghost normal-case text-xl">Home</a>
        <ul class="menu menu-horizontal px-1">
          <li><a href="/http_routes">HTTP Routes</a></li>
          <!-- Weitere Links können hier hinzugefügt werden -->
        </ul>
      </div>
      <div class="navbar-center hidden lg:flex">
      </div>
    </div>
  </nav>
  <div class="container mx-auto flex-grow p-4">
    <slot />
  </div>
</main>
