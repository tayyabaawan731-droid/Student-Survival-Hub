# Student Survival Hub: Beginner Build Guide

## 1. What this application is

**Student Survival Hub** is a full-stack web application for university students. After signing in, each student can maintain a profile, upload and discover notes, join study groups, plan a weekly timetable, track assignments and exams, and post campus lost-and-found items. The project uses a React and TypeScript client, a typed Express/tRPC server, a MySQL-compatible database through Drizzle ORM, managed file storage for note documents, and the preconfigured authentication system.

> The project separates the **interface**, **business rules**, **database structure**, and **file storage**. This makes each part easier to find and change without accidentally breaking another feature.

## 2. Running the project from the beginning

| Step | Command or action | Why it is needed |
|---|---|---|
| 1 | Open the `student-survival-hub` project folder. | This is the root folder containing all app code and configuration. |
| 2 | Run `pnpm install` if dependencies have not already been installed. | Downloads the packages named in `package.json`. |
| 3 | Run `pnpm drizzle-kit generate` after any edit to `drizzle/schema.ts`. | Generates a migration file matching the database model. |
| 4 | Apply the generated migration with the platform database migration workflow. | Creates or updates the real database tables. |
| 5 | Run `pnpm dev`. | Starts the development server. |
| 6 | Open the local preview URL and sign in. | Authentication creates or finds the signed-in user record. |
| 7 | Run `pnpm check` and `pnpm test` before releasing changes. | Checks TypeScript and the automated safety tests. |

The managed environment already provides the database URL, authentication configuration, and storage credentials. Do **not** add these values directly to source files or commit an `.env` file.

## 3. Folder structure and every project-owned file

The following tree covers the source folders, configuration, migrations, and documentation that define this application. Large generated dependency folders such as `node_modules/`, runtime logs such as `.manus-logs/`, and Git metadata are intentionally excluded because they are not application source code.

```text
student-survival-hub/
├── BEGINNER_GUIDE.md                 # This beginner guide.
├── README.md                         # Template-level stack and integration reference.
├── todo.md                           # Feature checklist and development history.
├── package.json                      # Dependency list and scripts: dev, build, check, test.
├── pnpm-lock.yaml                    # Exact locked package versions.
├── tsconfig.json                     # TypeScript compiler configuration.
├── vite.config.ts                    # Vite client build configuration.
├── vitest.config.ts                  # Automated-test configuration.
├── drizzle.config.ts                 # Drizzle database migration configuration.
├── components.json                   # shadcn/ui component configuration.
├── .gitignore                        # Files Git must not track.
├── .prettierrc                       # Code-formatting rules.
├── .prettierignore                   # Files excluded from formatting.
├── drizzle/
│   ├── schema.ts                     # All database table definitions and TypeScript row types.
│   ├── 0001_smart_molecule_man.sql   # Generated SQL that creates the Student Survival Hub tables.
│   ├── meta/_journal.json            # Drizzle’s record of generated migrations.
│   └── relations.ts                  # Generated relation helper entry point.
├── shared/
│   ├── const.ts                      # Shared session and authentication constants.
│   ├── types.ts                      # Shared type exports.
│   └── _core/errors.ts               # Shared error helpers.
├── server/
│   ├── db.ts                         # Database queries and writes for every hub feature.
│   ├── routers.ts                    # Combines authentication, system, and hub routes into one API.
│   ├── routers/studentHub.ts         # Input validation, permissions, file upload rules, and tRPC procedures.
│   ├── storage.ts                    # Managed object-storage helpers for note documents.
│   ├── auth.logout.test.ts           # Template test for secure logout behavior.
│   ├── studentHub.test.ts            # Tests for file, time-range, and priority-filter safeguards.
│   └── _core/                        # Framework-managed OAuth, server, context, storage-proxy, and RPC plumbing.
└── client/
    ├── index.html                    # Browser entry document, page title, viewport, and description.
    ├── public/                       # Small public configuration assets only; no user-uploaded files go here.
    └── src/
        ├── main.tsx                  # Mounts React, Query Client, tRPC, and global authentication handling.
        ├── App.tsx                   # Maps URLs to the landing page and protected workspace routes.
        ├── index.css                 # Global Memphis palette, typography, accessible tokens, and component styles.
        ├── const.ts                  # Client-side authentication redirect helper.
        ├── lib/trpc.ts               # Typed client connection to the server API.
        ├── contexts/ThemeContext.tsx # Global color-theme provider.
        ├── hooks/                    # Shared React hooks, including viewport helpers.
        ├── _core/hooks/useAuth.ts    # Reads current user data and provides secure sign-in/sign-out actions.
        ├── components/
        │   ├── MemphisMark.tsx       # Reusable dots, diamonds, and geometric backdrop elements.
        │   ├── ErrorBoundary.tsx     # Prevents a rendering error from crashing the whole website.
        │   ├── DashboardLayout.tsx   # Template dashboard layout, retained as a reusable reference.
        │   ├── DashboardLayoutSkeleton.tsx # Loading display for the template dashboard layout.
        │   ├── AIChatBox.tsx         # Template chat component; not used by the current product.
        │   ├── Map.tsx               # Template map component; not used by the current product.
        │   ├── ManusDialog.tsx        # Template dialog helper.
        │   └── ui/                   # Prebuilt accessible shadcn/ui primitives, such as Button, Dialog, Input, Select, Toast, Avatar, Badge, and Tooltip.
        └── pages/
            ├── Home.tsx              # Public Memphis-style marketing and sign-in page.
            ├── Dashboard.tsx         # Authenticated dashboard plus all feature screens and forms.
            ├── NotFound.tsx          # Fallback page for an unknown URL.
            └── ComponentShowcase.tsx # Template component examples; not part of the student workflow.
```

## 4. What to write in each custom feature file

The application-specific files are deliberately concentrated in a small number of places. A beginner should start with the files below rather than editing files under `server/_core/`, which are framework infrastructure.

| File | What it contains | When to edit it |
|---|---|---|
| `drizzle/schema.ts` | Eight tables: authenticated users, student profiles, notes, study groups, group memberships, timetable entries, deadlines, and lost-and-found posts. | Add a saved field or a new data entity. Generate and apply a migration immediately afterward. |
| `server/db.ts` | All read/write functions. It enforces user ownership when changing personal timetable, deadline, and lost-found records. | Change how data is retrieved, ordered, searched, or persisted. |
| `server/routers/studentHub.ts` | Validation rules and protected API procedures. It checks note type/size, timetable time ranges, and feature inputs before calling the database. | Add a new endpoint or change an input rule. |
| `server/routers.ts` | Exposes `hub` alongside the existing authentication route. | Register an additional router module. |
| `client/src/pages/Home.tsx` | Hero copy, public feature cards, and the sign-in/start button. | Change public content or marketing design. |
| `client/src/pages/Dashboard.tsx` | The private navigation and forms/lists for every current student tool. | Change screen layout, create a new workspace screen, or connect an existing procedure to the UI. |
| `client/src/components/MemphisMark.tsx` | Geometric design accents reusable on public and private screens. | Add a consistent decorative primitive. |
| `client/src/index.css` | Peach background, mint/lilac/yellow palette, thick black borders, display font, keyboard focus token, responsive pattern, and reduced-motion rule. | Change global visual language. |
| `client/src/App.tsx` | Routes `/` to `Home` and `/app/...` to `Dashboard`. | Add a new page URL. |
| `server/studentHub.test.ts` | Tests important server-side rules that must not depend on the browser. | Add coverage when introducing a new validation or a critical rule. |

## 5. Data model and ownership rules

| Table | Main fields | Who can create it | Who can change it |
|---|---|---|---|
| `studentProfiles` | Name, university, department, semester | The signed-in student | That same student |
| `notes` | Title, subject, category, description, file metadata | The signed-in student | Current MVP creates notes; file metadata is protected in managed storage. |
| `studyGroups` | Name, subject, description, member limit | The signed-in student | The creator is recorded; students can join if capacity remains. |
| `studyGroupMembers` | Group ID, user ID, joined time | Student joining a group | Duplicate membership is prevented by a unique database rule. |
| `timetableEntries` | Day, times, subject, room, colour | The signed-in student | Only the owner can remove an entry. |
| `deadlines` | Title, subject, due date, priority, status | The signed-in student | Only the owner can mark it complete or pending. |
| `lostFoundPosts` | Lost/found type, item, details, location, contact details | The signed-in student | Only the owner can mark it resolved or active. |

Note documents never live inside a database column. The actual file is placed in managed storage; the `notes` table only keeps the file name, storage key, direct storage path, MIME type, and size. The current upload rule accepts PDF, Word, and plain-text documents up to **8 MB**.

## 6. Complete student journeys

### Journey A: First visit and profile

1. A visitor lands at `/` and clicks **Start your hub**.
2. The secure sign-in flow creates or refreshes the account record.
3. The app opens `/app`, which displays a prompt if no student profile exists.
4. The student opens **Profile**, fills in name, university, department, and semester, then clicks **Save profile**.
5. The dashboard now greets the student by their first name, and study group member lists use the profile information.

### Journey B: Notes sharing and discovery

1. A signed-in student opens **Notes** and clicks **Upload notes**.
2. The student fills in a title, subject, category, optional description, and selects a compatible file.
3. The server validates the document type and file size, writes the file to managed storage, and saves only its metadata in `notes`.
4. All students can search notes by title, subject, or description and filter by subject or category.
5. Clicking **Download** opens the managed storage path in a new browser tab.

### Journey C: Study groups

1. A student opens **Study groups** and searches by group name, subject, or purpose.
2. They can create a group by defining a subject, description, and member limit; the creator becomes the first member.
3. Another student clicks **Join**. The server prevents a duplicate join and blocks membership above the group limit.
4. Clicking **Members** shows the profiles of the currently joined students.

### Journey D: Personal planning

1. The student adds classes in **Timetable** with day, start/end time, subject, room, and colour.
2. The interface and server both reject a class whose end time is not later than its start time.
3. The student adds deadlines with a due date and low, medium, or high priority.
4. They use the **To do/Completed** switch and priority filter to focus on the relevant work.
5. The dashboard displays upcoming pending deadlines and classes for the current weekday.

### Journey E: Lost and found

1. A student opens **Lost & found** and submits a lost or found item with category, description, location, and contact method.
2. Other students search the board by item text/location and filter by lost/found type or category.
3. The post owner can mark the item resolved after it is returned.

## 7. Adding a feature safely

To add a new feature, follow the same sequence every time. First add or adjust the table in `drizzle/schema.ts`. Next generate and apply the migration. Then create a query function in `server/db.ts`, expose a protected or public procedure from `server/routers/studentHub.ts`, and call it from a component using `trpc.hub...`. Finally add a small automated test, account for loading/empty/error states in the UI, and run `pnpm check` plus `pnpm test`.

Do not bypass this order. It ensures the database, server types, form validation, and interface remain aligned.

## 8. Final verification completed

| Check | Result | What was verified |
|---|---|---|
| Type safety | Passed | `pnpm check` completed with no TypeScript errors. |
| Automated tests | Passed | `pnpm test` completed with five passing tests, including logout, first-time profile setup, note type validation, timetable range validation, and deadline filters. |
| Production compilation | Passed | `pnpm build` completed successfully for the React client and Node server bundle. |
| Responsive interface | Reviewed | The public landing page, private dashboard, and deadline tracker were reviewed at desktop and 375px mobile widths. |

The production build reports a non-blocking bundle-size advisory for the main client script. Future performance work can split the large authenticated dashboard into lazy-loaded feature pages; this does not stop the current application from building or running.
