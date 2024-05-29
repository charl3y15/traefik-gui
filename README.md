# Traefik-GUI

This project is a Web-GUI for the [Traefik](https://traefik.io/traefik/) reverse proxy.
It allows you to easily add routes to your **dynamic** Traefik configuration.

It is meant for simple http and tcp routes, without having to manage the Traefik configuration manually.

This is especially useful if you only have terminal access.

It is currently in development and not ready for production use.

# Installation

Traefik-GUI can be installed using docker:

```shell
docker pull ghcr.io/rahn-it/traefik-gui
docker run -d -p 3000:3000 --name traefik-gui -v ./data:/app/data -v ./traefik-configs:/app/traefik ghcr.io/rahn-it/traefik-gui
```

# Usage

You can access the GUI at port 3000. e.g.: `http://localhost:3000`

The tool will automatically generate the Traefik configuration and put it in the `/app/truefik` folder inside the container.

In the above example, the `traefik-configs` folder is mapped to the respective Traefik configuration folder.

# Attribution

This project is licensed under the [AGPL-3.0](LICENSE).

The development and hosting was kindly sponsored by [Rahn IT](https://it-rahn.de/).

Thanks to the great people of [Traefik](https://traefik.io/), [SvelteKit](https://kit.svelte.dev/) and everyone who made this possible.
