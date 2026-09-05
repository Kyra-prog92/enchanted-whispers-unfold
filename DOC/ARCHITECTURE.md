# Architecture — Enchanted Whispers Unfold

## Overview

Enchanted Whispers Unfold is a component-driven interactive storytelling experience built with React and TypeScript.

Rather than treating each chapter as an independent webpage, the application uses reusable components, shared visual systems, state-driven interactions, and structured story data to create a continuous cinematic experience.

The architecture is designed around four main ideas:

1. **Reusable experience components**
2. **State-driven interactions**
3. **Separation of story data from presentation**
4. **Layered visual and environmental effects**

---

## Application Structure

The main application code lives inside `src/`.

```text
src/
├── assets/
├── components/
├── hooks/
├── lib/
├── routes/
├── story/
├── router.tsx
├── start.ts
├── server.ts
└── styles.css
```

### `assets/`

Contains the visual and multimedia resources used throughout the experience.

Examples include:

* environmental backgrounds
* memory imagery
* atmospheric artwork
* visual effects assets
* other scene-specific resources

Keeping assets separated from components makes the visual layer easier to manage and replace.

---

## Components

The component system is the foundation of the experience.

Instead of implementing every chapter as a completely independent interface, shared components provide common behavior and visual language across the application.

Examples include systems for:

* scenes
* chapter titles
* reveals
* particles
* memory experiences
* navigation
* interactive environments
* cinematic transitions

This allows a visual behavior to be developed once and reused across multiple parts of the story.

---

## Chapter System

The narrative is organized into chapters.

Each chapter has:

* an identifier
* a display label
* navigation information
* a rendering function

Conceptually:

```text
Chapter
   │
   ├── Identity
   ├── Label
   ├── Navigation
   └── Rendered Experience
```

This approach allows the application to maintain a consistent navigation model while each chapter remains visually and interactively distinct.

---

## Scene Composition

Individual environments are composed from multiple layers.

A simplified scene can be understood as:

```text
Scene
│
├── Background / Environment
│
├── Atmospheric Effects
│   ├── Particles
│   ├── Fog
│   └── Ambient Motion
│
├── Narrative Content
│
├── Interaction Layer
│
└── Navigation / Controls
```

This layered approach makes it possible to modify the atmosphere independently from the narrative content.

---

## Story Data

Narrative content is kept separate from the components responsible for displaying it whenever practical.

For example, the Memory Garden uses structured memory data containing information such as:

```text
Memory
├── type
├── source
├── title
├── time/context
├── caption
└── accessibility information
```

This separation makes it possible to add or modify memories without rewriting the entire presentation component.

---

## State & Interaction

The experience relies on React state to control interactive behavior.

Examples include:

* current chapter
* current memory
* fullscreen state
* interaction states
* sound state
* navigation state

The interface reacts to state changes rather than manually manipulating individual visual elements.

For example:

```text
User interaction
       ↓
React state changes
       ↓
Component re-renders
       ↓
Visual transition
       ↓
New experience state
```

This creates predictable interactions while allowing the visual layer to remain highly dynamic.

---

## Memory Experience

The Memory Garden is implemented as a guided sequence rather than a conventional image gallery.

Only the current memory is emphasized at a time, allowing the experience to control:

* transitions
* image presentation
* text moments
* video moments
* fullscreen immersion
* keyboard navigation
* touch navigation

The underlying memory structure supports multiple content types, allowing the same presentation system to accommodate different forms of storytelling.

---

## Animation & Motion

Motion is treated as part of the interface architecture.

Reusable reveal and transition behaviors are used throughout the experience to create:

* gradual content appearances
* crossfades
* cinematic transitions
* atmospheric movement
* visual continuity between states

The project also considers reduced-motion preferences so that the experience can remain usable for visitors who request less animation.

---

## Responsive Design

The application is designed to adapt to different screen sizes rather than assuming a single desktop viewport.

Responsive behavior affects:

* typography
* spacing
* scene composition
* controls
* navigation
* fullscreen experiences
* interactive elements

Touch interaction is also considered for experiences that support gesture-based navigation.

---

## Accessibility

Accessibility is considered alongside visual design.

The project includes considerations such as:

* semantic interface elements
* descriptive alternative text for imagery
* keyboard navigation where appropriate
* visible interaction controls
* reduced-motion support
* responsive layouts
* readable typography and contrast

The goal is to preserve the atmosphere without making the interface dependent on a single interaction method.

---

## Performance Considerations

Because the project relies heavily on visual assets and animation, performance is an important part of the implementation.

The architecture favors:

* reusable components
* controlled rendering
* appropriate asset loading
* separation of scene content
* avoiding unnecessary dependencies
* respecting reduced-motion preferences
* keeping interactive effects scoped to where they are needed

The goal is to create an immersive experience without turning visual complexity into unnecessary application complexity.

---

## Technology Choices

### React

React provides the component and state model used throughout the experience.

### TypeScript

TypeScript provides type safety for components, story data, and application logic.

### Vite

Vite provides the development environment and production build pipeline.

### TanStack Start / Router

TanStack tooling provides the application's routing and application framework.

### Tailwind CSS

Tailwind is used for styling, responsive behavior, spacing, typography, and visual composition.

### Radix UI

Radix primitives provide accessible foundations for applicable interface elements.

---

## Design-to-Code Workflow

The project follows a design-to-code process where visual ideas are translated into reusable systems.

```text
Narrative concept
       ↓
Visual direction
       ↓
Interaction design
       ↓
Reusable React component
       ↓
State + behavior
       ↓
Animation / atmosphere
       ↓
Responsive implementation
       ↓
Integration into chapter
```

This keeps the creative direction connected to the underlying software architecture.

---

## Extensibility

The architecture allows the experience to grow without requiring the entire application to be rewritten.

Potential extensions include:

* additional chapters
* new memory types
* new environmental effects
* additional interactive scenes
* richer multimedia experiences
* new narrative paths
* additional accessibility enhancements

Because content and reusable presentation systems are separated, new experiences can build on existing infrastructure.

---

## Engineering Philosophy

The project is intentionally built around a simple principle:

> **The interface is part of the story.**

A button is not only a control.

A transition is not only an animation.

An environment is not only a background.

Each technical system contributes to the experience the visitor receives.

Enchanted Whispers Unfold therefore treats frontend engineering, interaction design, animation, and storytelling as interconnected parts of the same system.
