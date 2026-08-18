# Student Survival Hub
Student Survival Hub is a vibrant full-stack student platform for notes, study groups, timetables, deadlines, and lost-and-found posts. Built with React, TypeScript, Node.js, tRPC, Drizzle ORM, and MySQL.
> A vibrant, full-stack student platform for managing academic life in one place.

**Student Survival Hub** helps university students organize the parts of campus life that usually live across different apps and group chats. Students can share and discover notes, join study groups, manage a weekly timetable, track assignments and exams, and post lost-and-found items through one responsive workspace.

The product pairs practical student tools with an energetic **Memphis-inspired** visual system: a soft peach canvas, pastel mint/lilac/yellow accents, bold display typography, geometric shapes, and high-contrast black details.

## Project Links

| Resource | Link |
| --- | --- |
| Live demo | https://studhub-i2s4cszh.manus.space |

## Why I Built This

University students often need to keep notes, class schedules, assignment deadlines, study partners, and campus updates in separate places. Student Survival Hub brings those essential workflows together in a focused, approachable dashboard so students can spend less time searching and more time learning.

## Features

| Area | What students can do |
| --- | --- |
| Authentication and profile | Sign in securely and create a profile with their name, university, department, and semester. |
| Dashboard | See upcoming deadlines, today’s classes, and newly shared notes at a glance. |
| Notes library | Upload PDF, Word, or text notes; browse and download shared resources; search by title, subject, or description; filter by subject and category. |
| Study groups | Create subject-based study circles, define a member limit, join available groups, and view the member list. |
| Weekly timetable | Add classes by day, start/end time, subject, room, and colour; remove entries when plans change. |
| Deadline tracker | Track assignments and exams with a due date, priority, description, and completion status. Filter work by status and priority. |
| Lost and found | Publish lost or found items with a category, location, description, and contact information. Post owners can mark items as resolved. |
| Search and feedback | Use feature-level search, filters, loading states, empty states, validation messages, and error recovery actions. |

## Design Direction

The interface uses a vibrant Memphis-inspired system rather than a generic dashboard style. It combines a peach background with mint, lilac, yellow, and peach cards; strong black borders; offset shadows; dots, diamonds, and geometric shapes; and uppercase display typography. The design remains responsive, with a mobile navigation pattern and screens designed to stay readable on small devices.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Wouter, Tailwind CSS 4, shadcn/ui, Lucide icons |
| Backend | Node.js, Express 4, tRPC 11, Zod |
| Database | MySQL-compatible database, Drizzle ORM, Drizzle Kit |
| Authentication | OAuth-based protected routes and user sessions |
| File storage | Managed object storage for note files; file metadata remains in the database |
| Quality checks | Vitest, TypeScript compiler checks, production build verification |

## Application Architecture

```
React client
    │
    ├── Public landing page
    └── Protected student workspace
             │
             ▼
         tRPC API
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
Profiles  Academic data  Managed note storage
    │        │        │
    └────────┴────────┘
             │
             ▼
      MySQL-compatible database
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/student-survival-hub.git
cd student-survival-hub
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. This project needs a database connection plus authentication and storage provider settings. Use `VSCODE_SETUP.md` for the complete variable list and explanation.

> Never commit `.env`, API keys, passwords, database URLs, or private OAuth credentials to GitHub.

### 4. Create database tables

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 5. Run the app

```bash
pnpm dev
```

Then open the local URL printed in the terminal.

## Available Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server. |
| `pnpm check` | Run TypeScript type checking without creating files. |
| `pnpm test` | Run the Vitest test suite. |
| `pnpm build` | Create a production build for the frontend and server. |
| `pnpm start` | Run the compiled production server. |
| `pnpm drizzle-kit generate` | Generate a database migration after editing the schema. |
| `pnpm drizzle-kit migrate` | Apply pending Drizzle migrations. |

## Project Structure

```
student-survival-hub/
├── client/                     # React frontend
│   └── src/
│       ├── pages/              # Landing page and authenticated workspace
│       ├── components/         # Reusable interface components
│       ├── index.css           # Memphis design system and global styling
│       └── App.tsx             # Client-side routes
├── server/                     # Express/tRPC backend
│   ├── routers/studentHub.ts   # Protected API procedures and validation
│   ├── db.ts                   # Database read/write functions
│   └── studentHub.test.ts      # Feature validation tests
├── drizzle/                    # Schema and generated migrations
├── shared/                     # Shared constants and types
├── BEGINNER_GUIDE.md           # Detailed folder, feature, and user-flow guide
├── VSCODE_SETUP.md             # Local VS Code installation and environment guide
└── package.json                # Project scripts and dependencies
```

For a more detailed explanation of every major folder, file, data table, permission rule, and user journey, read [**BEGINNER_GUIDE.md**](./BEGINNER_GUIDE.md).

## Validation Included

The project includes automated checks for important backend safeguards:

- Secure logout behaviour.

- First-time profile setup responses.

- Supported note document types.

- Timetable entries where the end time must be later than the start time.

- Deadline status and priority filters.

Run the full verification locally with:

```bash
pnpm check && pnpm test && pnpm build
```

## Future Improvements

| Priority | Enhancement |
| --- | --- |
| High | Add email or in-app reminders for approaching deadlines. |
| High | Add real-time group chat and file discussion threads. |
| Medium | Add note ratings, reporting, and moderation controls. |
| Medium | Add university-specific communities and announcements. |
| Medium | Add calendar export and a dark-mode preference. |

## Author

Built by **Tayyaba** as a full-stack portfolio project.
