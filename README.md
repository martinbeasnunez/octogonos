# Octógonos

Micrositio mobile-first que organiza información pública de candidatos en 3 pilares: **Educación**, **Situación Legal** y **Plan de Gobierno**. Información procesada por IA a partir de fuentes públicas.

## Stack

- Next.js 16 (App Router, SSG)
- Tailwind CSS 4
- TypeScript

## Inicio rápido

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Estructura de data

Los candidatos se definen en `src/data/candidates.ts`. Cada candidato tiene:

- `name`, `slug`, `party`
- `education` — score + explicación + fuentes
- `legal` — score + explicación + fuentes
- `plan` — score + explicación + fuentes

Los scores son: `Alto`, `Medio`, `Bajo`.

Para actualizar candidatos, editar el array `candidates` en ese archivo. En producción, un pipeline de IA generará/actualizará este archivo automáticamente.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home: buscador + lista de candidatos |
| `/c/[slug]` | Octógonos de un candidato |
| `/metodologia` | Cómo funciona |
| `/correcciones` | Changelog de correcciones |

## Deploy en Vercel

1. Push a un repo de GitHub
2. Ir a [vercel.com/new](https://vercel.com/new)
3. Importar el repo
4. Deploy (zero config)

No requiere variables de entorno para V1 (data estática).
