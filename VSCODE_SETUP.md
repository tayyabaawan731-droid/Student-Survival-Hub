# Run Student Survival Hub in VS Code

## What is inside the ZIP

The exported ZIP contains the complete source code: the React client, Express/tRPC server, database schema and migration, feature tests, package lockfile, and both beginner guides. It intentionally excludes `node_modules`, compiled `dist` output, logs, and platform secrets because they can be regenerated locally or must be supplied securely.

## Prerequisites

Install **Node.js 22 or newer**, **pnpm 10 or newer**, **VS Code**, and access to a MySQL-compatible database. Open the extracted `student-survival-hub` folder in VS Code, then open its integrated terminal.

## Install and run

Run the following commands in the project root:

```bash
pnpm install
pnpm check
pnpm test
pnpm dev
```

Open the local address printed by the development server. For a production build, run:

```bash
pnpm build
pnpm start
```

## Required environment variables

Create a local `.env` file in the project root. Never commit it to Git. The project needs the following values because it uses authentication, a database, and managed object storage:

```env
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE
JWT_SECRET=replace-with-a-long-random-secret
OAUTH_SERVER_URL=https://your-oauth-server.example
VITE_APP_ID=your-client-application-id
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.example
BUILT_IN_FORGE_API_URL=https://your-storage-api.example
BUILT_IN_FORGE_API_KEY=your-server-storage-key
VITE_FRONTEND_FORGE_API_URL=https://your-public-forge-api.example
VITE_FRONTEND_FORGE_API_KEY=your-public-forge-key
```

The exported project’s sign-in and note-upload features depend on working equivalents for these services. If you want a standalone project outside the managed environment, replace the authentication and storage adapters in `server/_core/` and `server/storage.ts` with your own provider implementation.

## Database setup

The complete schema is defined in `drizzle/schema.ts`. First configure `DATABASE_URL`, then generate and apply the migration:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

The initial Student Survival Hub migration is also included at `drizzle/0001_smart_molecule_man.sql`. It creates the student profiles, notes, study group, timetable, deadline, and lost-and-found tables.

## Where to start editing

| Goal | File to open |
|---|---|
| Change landing-page copy or public design | `client/src/pages/Home.tsx` |
| Change dashboard tools or screens | `client/src/pages/Dashboard.tsx` |
| Change global colours and Memphis styling | `client/src/index.css` |
| Add a table or field | `drizzle/schema.ts` |
| Add database logic | `server/db.ts` |
| Add secure API validation | `server/routers/studentHub.ts` |
| Understand the complete file tree and user journeys | `BEGINNER_GUIDE.md` |

> Read `BEGINNER_GUIDE.md` before changing the schema or server logic. It explains the folder structure, ownership rules, and the safe order for adding features.
