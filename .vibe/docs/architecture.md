# Architecture Document: Web-Based Wardley Map Editor

## 1. Introduction and Goals

### 1.1 Requirements Overview
This document describes the technical architecture for a web-based Wardley map editor targeting business consultants, strategists, and architects. The system provides high-performance interactions, local-first data storage, and professional export capabilities.

### 1.2 Quality Goals
- **Performance**: Sub-100ms response times for all interactions
- **Usability**: Newcomer-friendly interface requiring no Wardley mapping expertise
- **Reliability**: Offline-first operation with local data persistence
- **Maintainability**: Clean, typed codebase with modern tooling

## 2. Architecture Constraints

### 2.1 Technical Constraints
- Must run in modern browsers (Chrome, Firefox, Safari, Edge)
- TypeScript + Vite build system for type safety and fast development
- No server-side dependencies for core functionality
- Local storage for data persistence within browser limitations

### 2.2 Business Constraints
- Single facilitator model (no real-time collaboration required)
- Professional export quality for business presentations
- Local-first approach (no cloud infrastructure dependencies)

## 3. System Scope and Context

### 3.1 Business Context
```
[Business Consultant] --> [Wardley Map Editor] --> [PDF Export]
[Strategic Planner]   --> [Wardley Map Editor] --> [Draw.io Export]
[Enterprise Architect] --> [Wardley Map Editor] --> [PNG Export]
                      --> [Wardley Map Editor] --> [JSON Export]
                      --> [Wardley Map Editor] --> [Local Storage]
```

### 3.2 Technical Context
```
[Modern Browser] --> [React App] --> [Local Storage API]
[React App] --> [SVG Rendering] --> [Export Libraries]
[Export Libraries] --> [PDF Files (jsPDF)]
[Export Libraries] --> [PNG Files (html2canvas)]
[Export Libraries] --> [Draw.io XML]
[Export Libraries] --> [JSON Files]
```

## 4. Solution Strategy

### 4.1 Technology Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Frontend Framework | React + TypeScript | Component-based architecture, excellent TypeScript support |
| Build Tool | Vite | Fast development experience, modern tooling |
| Graphics Rendering | SVG | Vector graphics, perfect for exports, CSS styling |
| State Management | Zustand | Lightweight, TypeScript-friendly, minimal boilerplate |
| PDF Export | html2canvas + jsPDF | Reliable SVG-to-PDF conversion |
| PNG Export | html2canvas | High-quality image capture |
| Draw.io Export | Custom XML generator | Full control over output format |
| JSON Export | Native JSON | Complete map data serialization |

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
├── Canvas (SVG-based)
│   ├── EvolutionAxis (Genesis → Commodity)
│   ├── ValueChainAxis (Visible → Invisible)
│   ├── MapComponent (draggable circles)
│   └── ConnectionArrow (dependency relationships)
├── Toolbar
│   ├── ComponentPalette (predefined component types)
│   ├── ExportButtons (PDF, PNG, Draw.io, JSON)
│   └── ClearMapButton
├── PropertyPanel
│   ├── ComponentEditor (name, position)
│   ├── ColorPicker (component colors)
│   └── NotesEditor (component descriptions)
└── ExportModal
    ├── PDFExporter
    ├── PNGExporter
    ├── DrawIOExporter
    └── JSONExporter
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
  label?: string
  style?: 'solid' | 'dashed'
}

interface MapState {
  components: MapComponent[]
  connections: MapConnection[]
  selectedId: string | null
  isConnecting: boolean
  connectionStart: string | null
}
```

## 6. Runtime View

### 6.1 Component Creation Flow
```
User clicks palette → Create component → Position at center → Update state → Persist to localStorage
```

### 6.2 Drag and Drop Flow
```
Mouse down → Calculate offset → Mouse move → Update position → Mouse up → Persist state
```

### 6.3 Connection Creation Flow
```
Right-click component → Enter connection mode → Click target → Create connection → Update state
```

### 6.4 Export Flow
```
User clicks export → Capture SVG → Convert to target format → Download file
```

### 6.5 State Persistence Flow
```
State change → Zustand middleware → localStorage.setItem → Browser storage
```

## 7. Deployment View

### 7.1 Development Environment
```
Developer Machine
├── Node.js 20+
├── Vite Dev Server
├── TypeScript Compiler
└── Hot Module Replacement
```

### 7.2 Production Deployment
```
Static Hosting (GitHub Pages)
├── index.html
├── bundled JS/CSS assets
├── No server required
├── CDN distribution
└── Automatic deployment via GitHub Actions
```

## 8. Cross-cutting Concepts

### 8.1 Coordinate System
- **SVG ViewBox**: `-80 0 1080 600` (with left padding for axis labels)
- **Evolution Axis**: 0-1 scale mapped to 0-1000 SVG units
- **Value Chain Axis**: 0-1 scale mapped to 50-550 SVG units
- **Perfect Alignment**: Value chain axis positioned at evolution coordinate 0

### 8.2 Performance Strategy
- **React Optimizations**: React.memo, useMemo, useCallback for expensive operations
- **SVG Performance**: Efficient coordinate calculations and minimal DOM updates
- **Debounced Updates**: Smooth drag operations without excessive re-renders
- **Bundle Optimization**: Code splitting and tree shaking via Vite

### 8.3 Export System Architecture
- **PDF Export**: html2canvas + jsPDF, landscape A4 format
- **PNG Export**: html2canvas, high-resolution capture
- **Draw.io Export**: Custom XML generation with coordinate mapping
- **JSON Export**: Complete map state serialization for backup/sharing

### 8.4 Error Handling Principles
- **Graceful Degradation**: Fallback behaviors for edge cases
- **Local Storage**: Automatic persistence with error recovery
- **Export Errors**: User-friendly error messages with retry options
- **State Recovery**: Automatic restoration from localStorage on page load

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
- Minimal boilerplate reduces development complexity
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

### 9.4 Simplified Drag System
**Decision**: Direct coordinate mapping
**Rationale**:
- Eliminates complex constraint systems
- Provides full canvas freedom
- Simplifies coordinate calculations
- Improves performance and reliability

## 10. Quality Requirements

### 10.1 Performance
- Initial load: < 3 seconds
- Interaction response: < 100ms
- Smooth 60fps animations during drag operations
- Memory usage optimized for typical map sizes

### 10.2 Usability
- Zero learning curve for basic operations
- Intuitive drag-and-drop interface
- Clear visual feedback for all interactions
- Professional appearance suitable for business presentations

### 10.3 Reliability
- Complete offline functionality
- Automatic state persistence
- Recovery from page refresh
- Multiple export formats for data portability

## 11. Architecture Principles

### 11.1 Simplicity First
- Direct implementation over complex abstractions
- Minimal layers between user interaction and state updates
- Clear, predictable data flow
- Avoid premature optimization

### 11.2 Local-First Design
- No server dependencies for core functionality
- All data stored in browser localStorage
- Complete offline operation capability
- User maintains full control of their data

### 11.3 Performance by Design
- SVG for scalable vector graphics
- Efficient React rendering patterns
- Minimal DOM manipulations
- Optimized coordinate calculations

### 11.4 Export Quality
- Vector-based graphics maintain quality at any scale
- Professional output suitable for business use
- Multiple format support for different use cases
- Pixel-perfect coordinate mapping for draw.io compatibility
