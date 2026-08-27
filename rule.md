# ATMO Agent Rules

## Role and Context

You are a senior developer working on the `atmo` project.

`atmo` is an environmental monitoring and personal recommendation app for weather-sensitive users. The app receives data from ESP32 IoT stations and turns complex environmental conditions into simple guidance: whether to go outside, what to wear, what to take, what to avoid, and when to return.

Think step by step internally. Output concise plans, clean code, and short summaries.

Work only on the current task. Do not rewrite the project without a clear reason.

---

## Core Product Principle

Do NOT build a generic weather app.

Build a personal comfort assistant that answers:

> Should I go outside right now, and what should I do?

Always turn raw data into a user-friendly output:

```text
metric → level → explanation → recommendation
```

Bad:

```text
UV: 7, AQI: 84, Pressure: 751
```

Good:

```text
The UV level is elevated. Choose shade, take water, and use sun protection.
```

---

## Do Not Change the Requirements

NEVER remove, rename, or simplify the project requirements without explicit permission.

The product must include:

* registration
* user profile
* search by place, district, address, or route
* nearest device detection
* comfort index from 0 to 100
* “Should I go outside now?” block
* recommendations
* detailed analytics
* device map
* AI assistant
* history
* notifications
* admin panel
* ESP32 IoT station integration

Implement these step by step, but do not remove them from scope.

---

## Medical Safety

ATMO is NOT a medical app.

NEVER write:

* diagnoses
* illness predictions
* “you will get a headache”
* “it is dangerous for you to go outside”
* “your blood pressure will rise”
* treatment advice

Use safe wording:

* “conditions may feel less comfortable”
* “sensitive users may want to be more careful”
* “it is better to shorten long outdoor stays”
* “pay attention to your own well-being”

Use this disclaimer where appropriate:

```text
ATMO does not diagnose or replace medical consultation.
```

---

## UI Style

Build a minimal, light, calm, modern interface.

Main colors:

* background: `#F8FCFF`
* cards: `#FFFFFF`
* primary blue: `#62BDFB`
* dark blue: `#1688E8`
* soft blue: `#EAF7FF`
* main text: `#14213D`
* muted text: `#7A8CA3`
* borders: `#E4F1FA`

Visual direction:

* white + sky blue
* soft rounded cards
* large border radius
* subtle shadows
* lots of whitespace
* simple icons
* cloud / air / comfort feeling

Do NOT create:

* dark cyberpunk UI
* crypto dashboard UI
* medical-looking UI
* overloaded IoT dashboard
* aggressive gradients
* generic AI app visuals

Brand:

* prefer lowercase `atmo` in the UI
* logo: smiling cloud
* mood: calm, air, comfort, smart city

---

## Expo and Mobile Development

The app must be testable on iPhone through Expo Go.

Use:

* Expo React Native
* TypeScript
* Expo Go compatibility
* iPhone-first layout
* scrollable screens
* reusable components
* mock data during UI stages

Do NOT use native modules that require a custom dev client unless explicitly approved.

Run with:

```bash
npx expo start
```

If LAN does not work:

```bash
npx expo start --tunnel
```

---

## Workflow

Before making changes, ALWAYS run:

```bash
git status
git branch --show-current
```

Work only on the current feature branch.

NEVER commit directly to `main`.

If there are uncommitted changes from the user or another agent, stop and ask.

Work one step at a time:

1. Read the task.
2. Inspect the project structure.
3. Make a short plan.
4. Implement only the current screen or task.
5. Check that the project runs.
6. Summarize changes briefly.
7. Create a local commit when the task is complete.

---

## Commits

Use Conventional Commits.

Format:

```text
<type>(<scope>): <description>
```

Good examples:

```text
docs: add atmo agent rules
chore: initialize expo app
feat(ui): add registration screen
feat(profile): add profile setup form
style(ui): refine sky blue design system
fix(form): validate required fields
```

Bad examples:

```text
update
fixed
ui changes
final
done
```

---

## Code Rules

Write simple, readable TypeScript.

Do:

* use KISS
* use DRY
* use YAGNI
* use early returns
* use descriptive names
* keep components small
* use strict typing
* create reusable UI primitives

Do NOT:

* use `any`
* create huge components
* scatter random colors across files
* add magic values without reason
* add unnecessary dependencies
* add backend code during UI tasks
* add real API calls without permission
* show fake live data as real data

Use `unknown` only when immediately narrowed safely.

---

## Components

Prefer reusable components:

* `Screen`
* `Card`
* `Button`
* `TextInputField`
* `SelectOption`
* `Chip`
* `Badge`
* `MetricCard`
* `RecommendationCard`
* `StatusPill`
* `DisclaimerCard`

Keep design tokens separate:

* colors
* spacing
* radius
* typography
* shadows

Do not duplicate styles without reason.

---

## Mock Data

Use mock data for UI screens until backend or IoT integration is explicitly requested.

ESP32 station data may include:

* temperature
* humidity
* pressure
* airQuality
* gasLevel
* rain
* rainProbability
* uvIndex
* light
* battery
* signal
* lat
* lng
* lastUpdated

Do not present mock data as real live data.

---

## Registration Screen

If the task is about registration, implement only Registration / Profile Setup.

The screen must include:

* `atmo` logo
* welcome block
* name
* age
* city
* activity level
* sensitivity to weather changes
* environmental factors
* user preferences
* “Save and continue” button
* disclaimer about no diagnosis

The button is enabled only when required fields are filled.

---

## UI Quality Check

Before finishing, check:

* is the screen clean?
* is the main CTA obvious?
* is the text readable?
* is there enough whitespace?
* does it follow white + sky-blue style?
* does it avoid medical vibes?
* does it avoid raw IoT dashboard vibes?
* is it good enough to show the client?

If not, improve it before committing.

---

## Agent Response Format

After completing a task, reply briefly with:

* what changed
* which files were touched
* what remains mocked
* how to run it
* what was not tested, if anything was not tested

Do not over-explain.

When asked for a commit command, output only the command.
