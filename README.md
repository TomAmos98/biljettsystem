# Biljettsystem

Detta är ett fullstack-projekt byggt med React, Node.js, Express och SQLite.

Systemet låter användaren skapa, använda, visa och radera biljetter.

Frontend körs med React och Vite, medan backend körs med Node.js och Express. Databasen är byggd med SQLite via better-sqlite3.

## Funktioner

- Skapa en ny biljett med en slumpmässig biljettkod
- Visa alla biljetter
- Se om en biljett är använd eller oanvänd
- Använd en biljett genom att skriva in biljettkoden
- En biljett kan bara användas en gång
- Radera en oanvänd biljett
- Använda biljetter kan inte raderas

## Teknik

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express
- CORS

### Databas

- SQLite
- better-sqlite3

### Tester

- Vitest
- Supertest
- React Testing Library

## Databasdesign

Databasen innehåller tabellen `tickets`.

```text
tickets
--------------------------------
id          INTEGER PRIMARY KEY AUTOINCREMENT
code        TEXT UNIQUE NOT NULL
used        INTEGER DEFAULT 0
created_at  TEXT DEFAULT CURRENT_TIMESTAMP
```

- `id` är biljettens unika ID.
- `code` är den slumpmässigt skapade biljettkoden.
- `used` visar om biljetten är använd eller inte.
  - `0` = oanvänd
  - `1` = använd
- `created_at` sparar när biljetten skapades.

## API-endpoints

### Hämta alla biljetter

```http
GET /api/tickets
```

### Skapa en biljett

```http
POST /api/tickets
```

### Använd en biljett

```http
POST /api/tickets/use
```

Exempel på JSON:

```json
{
  "code": "ABC12345"
}
```

### Radera en biljett

```http
DELETE /api/tickets/:code
```

## CORS

Frontend och backend körs på olika portar.

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

Eftersom portarna är olika räknas frontend och backend som olika origins.

Backend använder därför CORS för att tillåta anrop från frontend:

```js
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
```

Utan korrekt CORS-konfiguration kan webbläsaren blockera anrop mellan frontend och backend.

## Installation

Öppna en terminal i projektets rotmapp och kör:

```bash
npm install
```

Gå sedan till frontend-mappen:

```bash
cd frontend
```

Installera frontend-paketen:

```bash
npm install
```

## Starta backend

Från projektets rotmapp:

```bash
node backend/server.js
```

Backend startar på:

```text
http://localhost:5000
```

## Starta frontend

Öppna en ny terminal och kör:

```bash
cd frontend
npm run dev
```

Frontend startar på:

```text
http://localhost:5173
```

## Tester

### Backend-test

Från projektets rotmapp:

```bash
npx vitest run backend/server.test.js
```

Backend-testet kontrollerar bland annat att:

- biljetter kan hämtas
- en biljett kan skapas
- servern ger status 400 om biljettkod saknas

### Frontend-test

Gå till frontend-mappen:

```bash
cd frontend
```

Kör:

```bash
npx vitest run src/App.test.jsx
```

Frontend-testet kontrollerar att biljettsystemets gränssnitt visas korrekt.

## TDD - Red, Green, Refactor

I projektet användes TDD på en del av backend-funktionaliteten.

### Red

Ett test skapades som kontrollerade att servern skulle svara med statuskod 400 om användaren försökte använda en biljett utan att ange någon biljettkod.

Testet misslyckades först eftersom servern svarade med 404.

### Green

Backend uppdaterades med validering:

```js
if (!code || !code.trim()) {
  return res.status(400).json({
    message: "Biljettkod saknas"
  });
}
```

Efter ändringen passerade testet.

### Refactor

Koden för att skapa en slumpmässig biljettkod flyttades till en egen funktion:

```js
function generateTicketCode() {
  return Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
}
```

Tester kördes igen efter refaktoreringen och fortsatte att passera.