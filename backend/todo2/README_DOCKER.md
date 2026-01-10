# Docker (backend todo2)

## Uruchomienie backendu

Z katalogu `backend/todo2`:

- `docker compose up --build`

Backend będzie dostępny pod:

- http://localhost:8080

Zatrzymanie:

- `docker compose down`

## Zmiana origin dla polityki CORS

### Opcja A (plik appsettings.json)

Edytuj plik `appsettings.json` i ustaw:

```json
{
  "Cors": {
    "SpaOrigin": "http://localhost:5173"
  }
}
```

Jeśli backend już działa w kontenerze, po zmianie pliku zrestartuj usługę:

- `docker compose restart`

### Opcja B (zmienna środowiskowa)

Możesz też nadpisać to ustawienie w `docker-compose.yaml` przez env:

- `Cors__SpaOrigin=http://localhost:5173`

Zmienne środowiskowe mają wyższy priorytet niż pliki `appsettings*.json`.

## Health check

API udostępnia endpoint do sprawdzenia, czy działa pod:

- http://localhost:8080/health
