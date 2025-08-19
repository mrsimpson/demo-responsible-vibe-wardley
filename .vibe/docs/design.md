# Implementation Design: Web-Based Wardley Map Editor

## Overview
This document provides a detailed implementation plan for building the Wardley map editor based on the established architecture (React + TypeScript + SVG + Zustand).

## Implementation Strategy

### Phase 1: Foundation Setup
**Goal**: Establish the basic project structure and core infrastructure

#### 1.1 Project Initialization
- Initialize Vite + React + TypeScript project
- Configure Tailwind CSS
- Set up ESLint + Prettier for code quality
- Configure development environment

#### 1.2 Core Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "tailwindcss": "^3.3.0"
  }
}
```

#### 1.3 Project Structure
```
src/
├── components/
│   ├── Canvas/
│   ├── Toolbar/
│   ├── PropertyPanel/
│   └── common/
├── stores/
│   └── mapStore.ts
├── types/
│   └── index.ts
├── utils/
│   ├── export/
│   └── storage/
├── hooks/
└── App.tsx
```

### Phase 2: Core Data Models & State Management
**Goal**: Implement the foundational data structures and state management

#### 2.1 TypeScript Interfaces
```typescript
// Core data models
interface MapComponent {
  id: string
  name: string
  x: number // Evolution position (0-1)
  y: number // Value chain position (0-1)
  color: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface MapConnection {
  id: string
  fromId: string
  toId: string
  type: 'dependency' | 'flow'
  style?: 'solid' | 'dashed'
}

interface Viewport {
  x: number
  y: number
  zoom: number
}

interface MapState {
  components: MapComponent[]
  connections: MapConnection[]
  selectedId: string | null
  viewport: Viewport
  isDragging: boolean
  dragOffset: { x: number, y: number }
}
```

#### 2.2 Zustand Store Implementation
```typescript
// mapStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MapStore extends MapState {
  // Actions
  addComponent: (component: Omit<MapComponent, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateComponent: (id: string, updates: Partial<MapComponent>) => void
  deleteComponent: (id: string) => void
  selectComponent: (id: string | null) => void
  updateViewport: (viewport: Partial<Viewport>) => void
  // ... more actions
}
```

### Phase 3: SVG Canvas Foundation
**Goal**: Create the interactive canvas with coordinate system

#### 3.1 Canvas Component Structure
```typescript
// Canvas/index.tsx
const Canvas: React.FC = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 600"
        className="border border-gray-300"
      >
        <EvolutionAxis />
        <ValueChainAxis />
        <ComponentLayer />
        <ConnectionLayer />
      </svg>
    </div>
  )
}
```

#### 3.2 Coordinate System
- **Evolution Axis (X)**: 0-1 scale mapped to SVG width
- **Value Chain (Y)**: 0-1 scale mapped to SVG height
- **Evolution Stages**: Genesis (0-0.25), Custom (0.25-0.5), Product (0.5-0.75), Commodity (0.75-1)

#### 3.3 Axis Components
```typescript
// Evolution axis with labels
const EvolutionAxis: React.FC = () => (
  <g>
    <line x1="0" y1="550" x2="1000" y2="550" stroke="#ccc" />
    <text x="125" y="580" textAnchor="middle">Genesis</text>
    <text x="375" y="580" textAnchor="middle">Custom</text>
    <text x="625" y="580" textAnchor="middle">Product</text>
    <text x="875" y="580" textAnchor="middle">Commodity</text>
  </g>
)
```

### Phase 4: Component Management System
**Goal**: Implement draggable components with visual feedback

#### 4.1 MapComponent Implementation
```typescript
interface MapComponentProps {
  component: MapComponent
  isSelected: boolean
  onSelect: (id: string) => void
  onDrag: (id: string, x: number, y: number) => void
}

const MapComponentView: React.FC<MapComponentProps> = ({
  component,
  isSelected,
  onSelect,
  onDrag
}) => {
  // Drag handling logic
  // Visual representation
  // Selection feedback
}
```

#### 4.2 Drag and Drop System
- **Mouse Events**: mousedown, mousemove, mouseup
- **Touch Support**: touchstart, touchmove, touchend
- **Visual Feedback**: Highlight drop zones, show drag preview
- **Constraints**: Keep components within canvas bounds

#### 4.3 Component Palette
```typescript
const ComponentPalette: React.FC = () => {
  const predefinedComponents = [
    { name: 'Customer', color: '#3B82F6' },
    { name: 'Product', color: '#10B981' },
    { name: 'Service', color: '#F59E0B' },
    { name: 'Data', color: '#8B5CF6' }
  ]
  
  return (
    <div className="w-64 bg-gray-50 p-4">
      {predefinedComponents.map(comp => (
        <DraggableComponent key={comp.name} {...comp} />
      ))}
    </div>
  )
}
```

### Phase 5: Annotation System
**Goal**: Add text labels, colors, and connection arrows

#### 5.1 Text Labels
- Inline editing on double-click
- Auto-sizing based on content
- Positioning relative to component

#### 5.2 Connection Arrows
```typescript
const ConnectionArrow: React.FC<{ connection: MapConnection }> = ({ connection }) => {
  const fromComponent = useMapStore(state => 
    state.components.find(c => c.id === connection.fromId)
  )
  const toComponent = useMapStore(state => 
    state.components.find(c => c.id === connection.toId)
  )
  
  if (!fromComponent || !toComponent) return null
  
  return (
    <line
      x1={fromComponent.x * 1000}
      y1={fromComponent.y * 600}
      x2={toComponent.x * 1000}
      y2={toComponent.y * 600}
      stroke="#666"
      strokeWidth="2"
      markerEnd="url(#arrowhead)"
    />
  )
}
```

#### 5.3 Color System
- Predefined color palette
- Custom color picker
- Color coding by category

### Phase 6: Property Panel
**Goal**: Component editing interface

#### 6.1 Component Editor
```typescript
const PropertyPanel: React.FC = () => {
  const selectedComponent = useMapStore(state => 
    state.components.find(c => c.id === state.selectedId)
  )
  
  if (!selectedComponent) {
    return <div className="w-80 bg-gray-50 p-4">Select a component to edit</div>
  }
  
  return (
    <div className="w-80 bg-gray-50 p-4">
      <ComponentEditor component={selectedComponent} />
      <ColorPicker />
      <NotesEditor />
    </div>
  )
}
```

### Phase 7: Export Functionality
**Goal**: High-quality PDF and draw.io export

#### 7.1 PDF Export Implementation
```typescript
const exportToPDF = async (mapState: MapState) => {
  const canvas = await html2canvas(svgElement, {
    backgroundColor: 'white',
    scale: 2 // High resolution
  })
  
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })
  
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 277, 190)
  pdf.save('wardley-map.pdf')
}
```

#### 7.2 Draw.io Export Implementation
```typescript
const exportToDrawIO = (mapState: MapState) => {
  const drawioXML = generateDrawIOXML(mapState)
  const blob = new Blob([drawioXML], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = 'wardley-map.drawio'
  a.click()
}
```

### Phase 8: Performance Optimization
**Goal**: Ensure blazing-fast performance

#### 8.1 React Optimizations
- React.memo for expensive components
- useMemo for computed values
- useCallback for event handlers
- Debounced updates during drag operations

#### 8.2 SVG Optimizations
- Minimize DOM updates
- Use CSS transforms for smooth animations
- Efficient hit testing

### Phase 9: Local Storage & Persistence
**Goal**: Reliable data persistence

#### 9.1 Auto-save Implementation
```typescript
// Auto-save every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    const state = useMapStore.getState()
    localStorage.setItem('wardley-map-autosave', JSON.stringify(state))
  }, 30000)
  
  return () => clearInterval(interval)
}, [])
```

#### 9.2 Recovery System
- Detect browser crashes
- Restore from auto-save
- Manual save/load functionality

### Phase 10: User Experience Polish
**Goal**: Newcomer-friendly interface

#### 10.1 Onboarding
- Welcome tour for first-time users
- Contextual tooltips
- Help documentation

#### 10.2 Keyboard Shortcuts
- Delete: Remove selected component
- Ctrl+Z: Undo
- Ctrl+Y: Redo
- Ctrl+S: Manual save

## Implementation Milestones

### Milestone 1: Basic Canvas (Week 1)
- Project setup complete
- Basic SVG canvas with axes
- Simple component placement

### Milestone 2: Interactive Components (Week 2)
- Drag and drop functionality
- Component selection
- Basic property editing

### Milestone 3: Annotations (Week 3)
- Text labels
- Connection arrows
- Color coding

### Milestone 4: Export System (Week 4)
- PDF export working
- Draw.io export working
- Local storage persistence

### Milestone 5: Polish & Testing (Week 5)
- Performance optimizations
- User experience improvements
- Bug fixes and testing

## Testing Strategy

### Unit Tests
- Data model validation
- Store actions and state updates
- Utility functions

### Integration Tests
- Component interactions
- Export functionality
- Storage persistence

### Manual Testing
- Cross-browser compatibility
- Performance testing
- User experience validation

## Risk Mitigation

### Technical Risks
1. **SVG Performance**: Monitor performance with large maps, implement virtualization if needed
2. **Export Quality**: Test export quality across different browsers and devices
3. **Storage Limits**: Implement data compression and cleanup strategies

### Implementation Risks
1. **Complexity**: Break down complex features into smaller, testable pieces
2. **Browser Compatibility**: Test early and often across target browsers
3. **User Experience**: Get feedback early with prototypes
