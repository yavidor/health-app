# Health App: Architecture & Implementation Plan

This document defines the complete technical implementation plan for the Health & Fitness App, using a **modern web stack (Vite + React + Tailwind CSS)** with a **minimal Go backend** and **SQLite database**. The frontend is a **Mobile-First, installable Progressive Web App (PWA)** that also adapts to desktop screens. It is online-first: it does not cache API data for offline use (see [Offline support](#offline-support)).

---

## 0. Current Project State

### Completed

- **Project Scaffolding**: Vite + React + TypeScript initialized in `frontend/`, Go module initialized in `backend/`.
- **Linting & Formatting**: ESLint (flat config) and Prettier configured and passing.
- **Design System & Styling**: Tailwind CSS v4 configured with custom color tokens in `frontend/src/index.css`.
- **Frontend Feature Views**: UI implemented across all primary feature routes (Dashboard, Fitness, Food, Squad, Stats), backed by a shared `ApiClient` and a `DataBoundary` loading/error boundary.
- **QA Mock Fixtures**: `frontend/vite/mockApiPlugin.ts` serves `frontend/src/lib/mockData.json` over real HTTP from a Vite middleware, enabled with `npm run dev:mock`. The app has no mock-mode branching, so QA exercises the same code path as production.
- **Backend Scaffold**: Basic Go HTTP server with routing and structured logging initialized in `backend/main.go`.

### Pending

- **Data Persistence & Database Integration**: Connect Go backend to SQLite with migrations, CRUD endpoints, and JSON export/import.
- **Backend API Endpoints**: Implement `/api/dashboard`, `/api/fitness`, `/api/food`, `/api/squad`, and `/api/stats`. Until they exist the frontend surfaces a visible error state rather than silently falling back to fixtures.
- **Automated Tests**: Expand coverage; backend tests are not yet written.

### Offline support

The app is **online-first and intentionally not offline-capable**. It is installable as a PWA (web app manifest plus a service worker that precaches the app shell), but the service worker has **no runtime caching**: `/api/*` responses are never cached, so a network failure is a genuine failure and renders an error state with a retry action. There is no localStorage/IndexedDB cache of domain data and no offline mutation queue.

For UI work without a backend, use `npm run dev:mock` (add `VITE_MOCK_LATENCY_MS=800` to exercise loading states). This is a testing tool, not an offline mode.

---

## 1. Executive Summary & Technology Stack

| :----------------------- | :-------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework / Build** | **Vite + React (TypeScript)** | Instant local boot time (`npm run dev`), zero mobile toolchain friction, standard web DOM/HTML/CSS. |
| **Styling & Theme** | **Tailwind CSS** | Strict adherence to the palette in `docs/humans/design/colors.md` using custom CSS variables (bright tones for UI/cards, dark tones for text/icons). |
| **Backend & Database** | **Go + SQLite** | Lightweight HTTP server with in-process SQLite database for user data, leaderboards, and quest tracking. |
| **Frontend & Static** | **Vite + Static Assets** | Served by the Go backend; PWA manifest and service worker precache the app shell for installability. API responses are never cached. |
| **Data Visualization** | **Recharts** | Lightweight, responsive SVG charts for cross-metric correlation (e.g., Calorie intake vs. Body measurements). |
| **Iconography** | **Lucide React** | Clean, accessible vector icons for mobile tab bars and dashboard widgets. |
| **Deployment / Target** | **PWA (Mobile & Desktop)** | Installable to mobile home screen (standalone window, no address bar) and responsive desktop web layout. |

---

## 2. System Architecture (Flowchart)

The application runs as a local Go server with a SQLite backend, with all user data persisted on the server and accessible to all users.

```mermaid
flowchart TD
    subgraph Backend ["Backend Server (Go + SQLite)"]
        API[REST API Server]
        DB[(SQLite Database)]
        API --> DB
    end

    subgraph Client ["Client Layer (Vite + React SPA)"]
        Nav[Adaptive Navigation: Mobile Tab Bar / Desktop Sidebar]

        subgraph Modules ["Feature Modules"]
            Fit[Fitness & Workout Planner]
            Food[Nutrition & Macro Tracker]
            Stats[Cross-Metric Analytics]
            Game[Squad Game & Leaderboard]
        end

        Nav --> Modules
    end

    Client -->|API Requests| Backend
    Backend -->|JSON Responses| Client
```

---

## 3. Data Schema & Relationships (Entity-Relationship Diagram)

All entities are persisted locally. Every table carries a `user_id`, including before auth exists, so adding Users is a configuration change rather than a migration (ADR-0001). The one table without a foreign key is `LEADERBOARD_PLAYER`, because the Squad game is defined over a shared group rather than over individual records.

The food entities below follow ADR-0004: a `FOOD` is the fact, a `MEAL` is the occasion that groups them, and totals are always summed from `FOOD` rows — **no daily total is ever stored**, so a stored number cannot drift out of agreement with the foods it came from.

```mermaid
erDiagram
    USER ||--o{ BODY_MEASUREMENT : tracks
    USER ||--o{ WORKOUT : logs
    USER ||--o{ MEAL : eats
    USER ||--o{ FOOD : logs
    USER ||--o{ SAVED_FOOD : keeps
    USER ||--o{ CALORIE_TARGET : sets
    USER ||--o{ QUEST_COMPLETION : completes

    USER {
        string id PK
        string display_name
        datetime created_at
    }

    MEAL {
        string id PK
        string user_id FK
        string date
        string slot "breakfast|lunch|dinner|snacks, nullable"
        datetime eaten_at
    }

    FOOD {
        string id PK
        string user_id FK
        string meal_id FK
        string name
        int kcal
        float protein_g
        float carbs_g
        float fat_g
        float quantity
        string serving "named serving, e.g. bowl"
    }

    SAVED_FOOD {
        string id PK
        string user_id FK
        string name
        int kcal
        float protein_g
        float carbs_g
        float fat_g
        float quantity
        string serving
    }

    CALORIE_TARGET {
        string id PK
        string user_id FK
        string effective_from "target applies from this date onward"
        int kcal
    }

    BODY_MEASUREMENT {
        string id PK
        string user_id FK
        string date
        float weight_kg
        float waist_cm
        float body_fat_pct
    }

    WORKOUT {
        string id PK
        string user_id FK
        string date
        string name
        int duration_mins
        string notes
    }

    WORKOUT ||--o{ EXERCISE_LOG : contains
    EXERCISE_LOG {
        string id PK
        string workout_id FK
        string exercise_name
        int sets
        int reps
        float weight_kg
    }

    QUEST ||--o{ QUEST_COMPLETION : records
    QUEST {
        string id PK
        string title "e.g. 5k Walk, Daily Pills"
        int point_value
        string recurrence "daily | weekly"
    }

    QUEST_COMPLETION {
        string id PK
        string user_id FK
        string quest_id FK
        string date
        int points_earned
    }

    LEADERBOARD_PLAYER {
        string id PK
        string name
        string avatar
        int weekly_points
        int rank
    }
```

### Food model notes

- **`slot` is `snacks` (plural)**, matching the existing `MealSlot` type. This differs from the old ERD's `Snack`, so nothing disagrees with the code's vocabulary.
- **`slot` is nullable.** The User is never asked to choose one; it is set as a side effect of which tile they logged from (ADR-0004).
- **A `MEAL` has no stored totals.** Calories and macros are summed from its `FOOD`s at read time.
- **`FOOD` and `SAVED_FOOD` have identical columns and are still two tables.** They are not two kinds of thing — a Saved Food is one that has not been eaten, and logging it copies its numbers into a new `FOOD`. They differ in lifecycle, and the two queries that matter share no rows. ADR-0004 records the reasoning and when to revisit it.
- **`FOOD` has no `date`.** The date comes from the parent `MEAL`. Denormalising it would create a second source of truth for which day a food belongs to.
- **Logging copies; it never links.** A logged Food does not remember the Saved Food it came from, so editing it never writes back to the template (ADR-0005).
- **`CALORIE_TARGET` rows are inserted, never updated.** A day is rated against the target with the greatest `effective_from` on or before it, so changing your target never silently re-rates history. This is the concrete form of "history stays comparable", which `docs/humans/data.md` depends on.
- **No food database table exists yet.** `SAVED_FOOD` is the reuse mechanism; an external source is undecided (ADR-0004, Unresolved). Water tracking is likewise undecided.
- **Reading food data goes through a general Metric read** — "this Metric, by date, over this range" — with calories as the only implemented source (ADR-0006).

---

## 4. User Journey & Navigation (State Diagram)

The user experience transitions seamlessly between views with persistent bottom tabs on mobile and a sidebar on desktop.

```mermaid
stateDiagram-v2
    [*] --> Dashboard : App Launch

    state Dashboard {
        [*] --> Overview
        Overview --> QuickLogWorkout : Click '+ Workout'
        Overview --> QuickLogMeal : Click '+ Meal'
        Overview --> CompleteQuest : Check off Daily Goal
    }

    Dashboard --> Fitness : Navigate to Workouts
    state Fitness {
        [*] --> WorkoutList
        WorkoutList --> PlanWorkout : Create Routine
        WorkoutList --> ActiveSession : Start Workout
        ActiveSession --> WorkoutList : Finish & Save
    }

    Dashboard --> Nutrition : Navigate to Food
    state Nutrition {
        [*] --> DailyMacroSummary
        DailyMacroSummary --> LogFoodModal : Add Food
        LogFoodModal --> DailyMacroSummary : Save Entry
    }

    Dashboard --> Analytics : Navigate to Stats
    state Analytics {
        [*] --> CorrelationView
        CorrelationView --> BodyVsCalories : Compare Metrics
        CorrelationView --> VolumeProgress : Exercise PRs
    }

    Dashboard --> SquadGame : Navigate to Game
    state SquadGame {
        [*] --> Leaderboard
        Leaderboard --> DailyQuests : View Challenges
    }
```

---

## 5. Gamification Points Engine (Sequence Diagram)

When an objective is completed (taking vitamins, hitting 5k steps, recording a workout), points are calculated and credited locally.

```mermaid
sequenceDiagram
    actor User
    participant UI as Daily Quest Checklist
    participant Engine as Gamification Engine
    participant DB as Health API (Go + SQLite)
    participant Board as Squad Leaderboard State

    User->>UI: Checks off "Daily Pills / Vitamins"
    UI->>Engine: completeQuest(questId = "daily_pills")
    Engine->>Engine: Verify completion status & streak
    Engine->>DB: Save quest completion record
    Engine->>DB: Increment User Total & Weekly Points (+25 pts)
    DB-->>Engine: Updated records
    Engine->>Board: Recalculate group rank & weekly standings
    Board-->>UI: Trigger celebration toast & updated score
    UI-->>User: Display "+25 Points! Rank #2 in Squad"
```

---

## 6. Component Hierarchy & Design System (Class Diagram)

Adhering to `docs/humans/design/colors.md`:

- **UI elements (buttons, cards, progress rings, badges):** Bright palette tones.
- **Typography and icons:** Dark forest green and deep navy teal.

```mermaid
classDiagram
    class AppLayout {
        +ResponsiveNav (MobileTabBar / DesktopSidebar)
        +Header (Streak, Date, Profile)
        +Outlet (Active Screen)
    }

    class ThemeConfig {
        +colorBgLight: "#F8FAF7"
        +colorCardBright: "#E2ECD8"
        +colorAccentLime: "#CDE4B4"
        +colorAccentTeal: "#A5D6D0"
        +colorAccentTerracotta: "#E89F82"
        +colorTextPrimary: "#1B3B2B"
        +colorTextMuted: "#2C4F3C"
    }

    class WorkoutService {
        +getWorkouts()
        +saveWorkout(workout)
        +deleteWorkout(id)
    }

    class NutritionService {
        +getMeals(date)
        +logFood(food, date, slot)
        +saveFood(food)
        +getSavedFoods()
        +setCalorieTarget(effectiveFrom, kcal)
        +getCalorieTargetOn(date)
    }

    interface MetricRead {
        <<interface>>
        +read(metric, from, to) : series
    }

    NutritionService ..|> MetricRead : implements for calories

    class AnalyticsService {
        +getCorrelatedData(startDate, endDate)
    }

    class GameService {
        +getQuests()
        +completeQuest(questId)
        +getLeaderboard()
    }

    AppLayout --> ThemeConfig : styles with
    AppLayout --> WorkoutService : calls
    AppLayout --> NutritionService : calls
    AppLayout --> AnalyticsService : calls
    AppLayout --> GameService : calls
```

> **Note:** Component hierarchy is planned but not yet implemented. Refer to Phase 3 of the roadmap.

---

## 7. Step-by-Step Implementation Roadmap

- [ ] **Phase 1: Project Scaffolding & Design System**
  - Initialize Vite React + TypeScript in `./frontend`.
  - Install and configure Tailwind CSS with custom palette color tokens.
  - Setup local responsive layout frame (Mobile container with Desktop sidebar fallback).
- [ ] **Phase 2: Backend & Data Models**
  - Implement the Go API with SQLite schema and migrations.
  - Add simple export/import JSON utility for backups.
- [ ] **Phase 3: Core Feature Implementation**
  - **Dashboard:** Daily progress rings, quick logging, and quest checklist.
  - **Fitness:** Routine planner and workout session logger.
  - **Food:** Calorie & macro logging (Protein, Carbs, Fats) with daily target progress.
  - **Stats:** Multi-axis interactive chart correlating Calorie intake vs. Weight/Measurements.
  - **Squad Game:** Mutual goals, points engine, and local simulated leaderboard.

> **Current Status:** All features are planned but not yet implemented.

- [x] **Phase 4: PWA Packaging & Polish**
  - Web App Manifest and Service Worker for home-screen installability (done: precaches app shell only, no runtime caching).
  - Verify WCAG contrast and palette constraints.
