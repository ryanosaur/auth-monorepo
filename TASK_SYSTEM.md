# Task Management System - Claude Test App

## Overview

A complete Kanban-style task management system with a vaporwave aesthetic, featuring:

- **Dashboard** - Overview of tasks with high-priority items due this week
- **Kanban Board** - Drag-and-drop task management with customizable columns
- **Task-Service Backend** - Dedicated microservice for task operations
- **Sidebar Navigation** - Quick access to all features

## Architecture

```
┌─────────────────┐
│   Vue.js SPA    │  Port 5173 - Frontend with Kanban UI
│  (Frontend)     │
└────────┬────────┘
         │ HTTP + JWT
         │
┌────────▼────────┐
│   BFF Layer     │  Port 3001 - Backend for Frontend
│  (Express.js)   │
└────┬────┬───────┘
     │    │
     │    └──────────┐
     │               │
┌────▼────────┐ ┌──▼──────────┐
│User Service │ │Task Service │  Port 3002/3003
│(Express.js) │ │(Express.js) │
└─────────────┘ └─────────────┘
```

## Features

### 📊 Dashboard (`/dashboard`)
- **Real-time Stats**: Total tasks, in progress, completed, high priority
- **Priority Tasks**: Shows high-priority tasks due within the week
- **Task Urgency Indicators**: Visual alerts for tasks due soon
- **Quick Actions**: Create tasks or navigate to Kanban board

### 📋 Kanban Board (`/tasks`)
- **Default Columns**: Backlog, In Progress, Done
- **Custom Columns**: Add unlimited additional columns
- **Drag & Drop**: Move tasks between columns seamlessly
- **Task Cards** with:
  - Title and description
  - Priority indicators (High/Medium/Low with colored dots)
  - Due dates
  - Edit and delete actions

### ✨ Task Features
- **Priority Levels**: Low, Medium, High (with visual indicators)
- **Due Dates**: Track deadlines and get alerts
- **Descriptions**: Add detailed notes to tasks
- **Column Organization**: Organize tasks in custom workflow stages

### 🎨 Vaporwave UI
- **Neon Gradients**: Cyan, pink, and purple color scheme
- **Animated Backgrounds**: Moving grid patterns and glow effects
- **Retro Typography**: Orbitron font for that 80s future vibe
- **Smooth Animations**: Glowing buttons, floating elements, scanlines

## API Endpoints

### Task Service (Port 3003)

**Tasks**
- `GET /api/tasks` - Get all user tasks
- `GET /api/tasks/priority-week` - Get high-priority tasks due this week
- `GET /api/tasks/:taskId` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:taskId` - Update task
- `POST /api/tasks/:taskId/move` - Move task to different column
- `DELETE /api/tasks/:taskId` - Delete task

**Columns**
- `GET /api/columns` - Get all user columns (auto-initializes defaults)
- `POST /api/columns/initialize` - Manually initialize default columns
- `POST /api/columns` - Create new column
- `PUT /api/columns/:columnId` - Update column
- `DELETE /api/columns/:columnId` - Delete column (only if empty)

### BFF Proxies
All task and column endpoints are proxied through the BFF at:
- `http://localhost:3001/api/tasks/*`
- `http://localhost:3001/api/columns/*`

## Data Models

### Task
```typescript
{
  id: string
  userId: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string (ISO 8601)
  columnId: string
  position: number
  createdAt: string
  updatedAt: string
}
```

### Column
```typescript
{
  id: string
  userId: string
  name: string
  position: number
  createdAt: string
  updatedAt: string
}
```

## Usage

### Creating a Task

1. Click **"+ New Task"** button
2. Fill in:
   - **Title** (required)
   - **Description** (optional)
   - **Priority** (Low/Medium/High)
   - **Due Date** (optional)
   - **Column** (where to place the task)
3. Click **"Create Task"**

### Moving Tasks

Simply **drag and drop** task cards between columns on the Kanban board.

### Adding Columns

1. Click **"+ Add Column"**
2. Enter column name
3. Click **"Create Column"**

**Note**: Default columns (Backlog, In Progress, Done) cannot be deleted.

### Editing Tasks

1. Click **"✏️ Edit"** on any task card
2. Modify fields
3. Click **"Update Task"**

### Deleting Tasks

1. Click **"🗑️ Delete"** on task card
2. Confirm deletion

## Running the System

### Install Dependencies
```bash
cd /Users/ryano/claude-projects/auth-monorepo
npm run install:all
```

### Start All Services
```bash
npm run dev
```

This starts:
- Frontend (Port 5173)
- BFF (Port 3001)
- User Service (Port 3002)
- Task Service (Port 3003)

### Individual Services
```bash
npm run dev:frontend
npm run dev:bff
npm run dev:user-service
npm run dev:task-service
```

## Environment Setup

### Task Service `.env`

Copy `task-service/.env.example` to `task-service/.env`:

```bash
PORT=3003
NODE_ENV=development
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=your-api-identifier
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:5173
```

### BFF `.env` (Update)

Add task service URL to `bff/.env`:

```bash
TASK_SERVICE_URL=http://localhost:3003
```

## Navigation

After logging in, users are automatically redirected to `/dashboard`.

**Sidebar Navigation:**
- 📊 Dashboard
- 📋 Tasks (Kanban Board)
- 👤 Profile
- 🚪 Logout

## Features in Detail

### Dashboard Stats

The dashboard calculates:
- **Total Tasks**: All tasks across all columns
- **In Progress**: Tasks not in "Done" column
- **Completed**: Tasks in "Done" column
- **High Priority**: All tasks marked as high priority

### Priority Task Display

Shows tasks that meet ALL criteria:
- Priority level: **High**
- Due date: Within the next **7 days**
- Sorted by due date (earliest first)

### Task Urgency Indicators

Tasks show visual indicators:
- **Due today**: Red blinking text
- **2 days or less**: Red text
- **3+ days**: Normal cyan text

## Storage

Currently uses **in-memory storage** (data persists only while services run).

**To add database persistence:**
1. Add database client (e.g., PostgreSQL, MongoDB)
2. Update `taskService.js` and `columnService.js`
3. Replace Map storage with database queries

## Customization

### Adding Task Fields

1. Update `Task.js` model
2. Add fields to `TaskModal.vue` form
3. Update task service endpoints
4. Display fields in task cards

### Changing Default Columns

Edit `columnService.js`:

```javascript
const defaultColumns = [
  { name: 'Your Column 1', position: 0 },
  { name: 'Your Column 2', position: 1 },
  // ...
]
```

### Custom Priority Levels

Update priority options in:
- `TaskModal.vue` (dropdown)
- CSS classes for colors
- Dashboard filter logic

## Troubleshooting

### Tasks not loading
- Check Auth0 token is valid
- Verify task-service is running on port 3003
- Check BFF proxy configuration

### Drag & drop not working
- Ensure browser supports HTML5 drag/drop
- Check console for JavaScript errors

### Columns not initializing
- Call `POST /api/columns/initialize` manually
- Check Auth0 authentication

## Future Enhancements

- [ ] Task assignments (multi-user)
- [ ] Task comments and activity log
- [ ] Labels and tags
- [ ] Task search and filtering
- [ ] Bulk operations
- [ ] Task templates
- [ ] Time tracking
- [ ] Notifications
- [ ] Dark/light theme toggle
- [ ] Mobile app
- [ ] Database persistence
- [ ] Task archiving
- [ ] Recurring tasks

## Tech Stack

**Frontend:**
- Vue 3 (Composition API)
- Vue Router
- Auth0 Vue SDK
- Axios
- HTML5 Drag & Drop API

**Backend:**
- Express.js
- Auth0 JWT verification
- JWKS for token validation
- UUID for ID generation

**Styling:**
- Custom CSS with CSS Variables
- Vaporwave color palette
- Responsive design
- CSS animations & transitions

---

Built with 🌊 vaporwave vibes and ⚡ modern tech
