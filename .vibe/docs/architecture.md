# Architecture Document: Web-Based Wardley Map Editor

## 1. Introduction and Goals

### 1.1 Requirements Overview
This document describes the technical architecture for a web-based Wardley map editor targeting business consultants, strategists, and architects. The system must provide blazing-fast performance, local-first data storage, and professional export capabilities.

### 1.2 Quality Goals
- **Performance**: Sub-100ms response times for all interactions
- **Usability**: Newcomer-friendly interface requiring no Wardley mapping expertise
- **Reliability**: Offline-first operation with local data persistence
- **Maintainability**: Clean, typed codebase with modern tooling

## 2. Architecture Constraints

### 2.1 Technical Constraints
- Must run in modern browsers (Chrome, Firefox, Safari, Edge)
- TypeScript + Vite build system (user preference)
- No server-side dependencies for core functionality
- Local storage limitations (~5-10MB browser storage)

### 2.2 Business Constraints
- Single facilitator model (no real-time collaboration)
- Professional export quality required
- Local-first approach (no cloud infrastructure)

## 3. System Scope and Context

### 3.1 Business Context
```
[Business Consultant] --> [Wardley Map Editor] --> [PDF Export]
[Strategic Planner]   --> [Wardley Map Editor] --> [Draw.io Export]
[Enterprise Architect] --> [Wardley Map Editor] --> [Local Storage]
```

### 3.2 Technical Context
```
[Modern Browser] --> [React App] --> [Local Storage API]
[React App] --> [SVG Rendering] --> [Export Libraries]
[Export Libraries] --> [PDF Files]
[Export Libraries] --> [Draw.io XML]
```

## 4. Solution Strategy

### 4.1 Technology Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Frontend Framework | React 18 + TypeScript | Component-based architecture, excellent TypeScript support, large ecosystem |
| Build Tool | Vite | User preference, fast development experience, modern tooling |
| Graphics Rendering | SVG | Vector graphics, perfect for exports, CSS styling, accessibility |
| State Management | Zustand | Lightweight, TypeScript-friendly, minimal boilerplate |
| Styling | Tailwind CSS | Rapid development, consistent design system |
| PDF Export | html2canvas + jsPDF | Reliable SVG-to-PDF conversion |
| Draw.io Export | Custom XML generator | Simple XML format, full control over output |

### 4.2 Architectural Patterns
- **Component-Based Architecture**: React components for UI modularity
- **Unidirectional Data Flow**: Zustand store with clear state mutations
- **Local-First**: All data persisted in browser localStorage
- **Export Strategy**: Convert SVG to various formats on-demand

## 5. Building Block View

### 5.1 Level 1: System Overview
```
┌─────────────────────────────────────────┐
│           Wardley Map Editor            │
├─────────────────────────────────────────┤
│  Canvas    │  Toolbar  │  Properties    │
│  (SVG)     │  (Palette)│  (Panel)       │
├─────────────────────────────────────────┤
│         State Management (Zustand)      │
├─────────────────────────────────────────┤
│  Local Storage  │  Export Engine        │
└─────────────────────────────────────────┘
```

### 5.2 Level 2: Component Architecture
```
App
├── Canvas
│   ├── EvolutionAxis
│   ├── ValueChainAxis  
│   ├── MapComponent (multiple)
│   └── ConnectionArrow (multiple)
├── Toolbar
│   ├── ComponentPalette
│   ├── AnnotationTools
│   └── ExportButtons
├── PropertyPanel
│   ├── ComponentEditor
│   ├── ColorPicker
│   └── NotesEditor
└── ExportEngine
    ├── PDFExporter
    └── DrawIOExporter
```

### 5.3 Level 3: Core Data Structures
```typescript
interface MapComponent {
  id: string
  name: string
  x: number // Evolution position (0-1)
  y: number // Value chain position (0-1)
  color: string
  notes?: string
}

interface MapConnection {
  id: string
  fromId: string
  toId: string
  type: 'dependency' | 'flow'
}

interface MapState {
  components: MapComponent[]
  connections: MapConnection[]
  selectedId: string | null
  viewport: { x: number, y: number, zoom: number }
}
```

## 6. Runtime View

### 6.1 Component Creation Flow
```
User drags from palette → Canvas drop zone → Create component → Update state → Persist to localStorage
```

### 6.2 Export Flow
```
User clicks export → Capture SVG → Convert to target format → Download file
```

### 6.3 State Persistence Flow
```
State change → Zustand middleware → localStorage.setItem → Browser storage
```

## 7. Deployment View

### 7.1 Development Environment
```
Developer Machine
├── Node.js 18+
├── Vite Dev Server (localhost:5173)
├── TypeScript Compiler
└── Hot Module Replacement
```

### 7.2 Production Deployment
```
Static Hosting (Netlify/Vercel/GitHub Pages)
├── index.html
├── bundled JS/CSS assets
├── No server required
└── CDN distribution
```

## 8. Cross-cutting Concepts

### 8.1 Performance Strategy
- **Virtual Scrolling**: For large maps with many components
- **Debounced Updates**: Prevent excessive re-renders during drag operations
- **Memoization**: React.memo for expensive component renders
- **Lazy Loading**: Code splitting for export functionality

### 8.2 Error Handling
- **Graceful Degradation**: Fallback to basic functionality if advanced features fail
- **Local Storage Errors**: Handle quota exceeded scenarios
- **Export Errors**: User-friendly error messages with retry options

### 8.3 Accessibility
- **Keyboard Navigation**: Full keyboard support for all operations
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **High Contrast**: Support for high contrast mode
- **Focus Management**: Clear focus indicators and logical tab order

## 9. Design Decisions

### 9.1 SVG vs Canvas
**Decision**: SVG
**Rationale**: 
- Vector graphics scale perfectly for exports
- Each element can be a React component
- CSS styling works naturally
- Better accessibility support
- Easier hit testing for interactions

### 9.2 Zustand vs Redux
**Decision**: Zustand
**Rationale**:
- Minimal boilerplate reduces development time
- Excellent TypeScript support
- Perfect for local-first applications
- Easy localStorage persistence
- Smaller bundle size

### 9.3 Export Strategy
**Decision**: Client-side conversion
**Rationale**:
- Maintains local-first principle
- No server dependencies
- Works offline
- User controls their data

## 10. Quality Requirements

### 10.1 Performance
- Initial load: < 3 seconds
- Interaction response: < 100ms
- Smooth 60fps animations
- Memory usage: < 100MB for typical maps

### 10.2 Usability
- Zero learning curve for basic operations
- Contextual help and tooltips
- Undo/redo functionality
- Keyboard shortcuts for power users

### 10.3 Reliability
- Works completely offline
- Automatic save every 30 seconds
- Recovery from browser crashes
- Data export as backup mechanism

## 11. Risks and Technical Debts

### 11.1 Technical Risks
- **Browser Storage Limits**: Large maps may exceed localStorage quota
- **Export Quality**: SVG-to-PDF conversion may have limitations
- **Performance**: Complex maps with 100+ components may slow down

### 11.2 Mitigation Strategies
- Implement data compression for storage
- Provide multiple export quality options
- Add performance monitoring and optimization
- Consider IndexedDB for larger storage needs
