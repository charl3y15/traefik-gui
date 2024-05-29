# Verwende ein Node.js-Image als Basis
FROM node:lts AS build

# Erstelle das Arbeitsverzeichnis
WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest des Projekts
COPY . .

# Baue das Projekt
RUN npm run build

FROM node:lts

# Erstelle das Arbeitsverzeichnis
WORKDIR /app

# Kopiere die erstellten Dateien aus dem vorherigen Build-Schritt
COPY --from=build /app/build .
COPY --from=build /app/package*.json ./

# abhängigkeiten installieren
RUN npm install

# Erstelle ein Verzeichnis für die Traefik-Konfiguration und die Datenbank
RUN mkdir -p /app/traefik /app/data

VOLUME [ "/app/traefik", "/app/data" ]

# Stelle sicher, dass der generateTraefikConfig-Befehl beim Starten ausgeführt wird
CMD ["node", "index.js"]

# Exponiere den Port
EXPOSE 3000
