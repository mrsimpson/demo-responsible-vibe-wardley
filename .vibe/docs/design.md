# Implementation Design: Web-Based Wardley Map Editor

## Overview
This document provides the implementation principles and architectural decisions for building the Wardley map editor based on React + TypeScript + SVG + Zustand architecture.

## Core Design Principles

### 1. Simplicity First
- **Direct Implementation**: Favor straightforward solutions over complex abstractions
- **Minimal Layers**: Reduce indirection between user interactions and state updates
- **Clear Data Flow**: Unidirectional state management with predictable updates
- **Avoid Premature Optimization**: Build for clarity first, optimize when needed

### 2. Local-First Architecture
- **No Server Dependencies**: Core functionality works completely offline
- **Browser Storage**: All data persisted in localStorage for privacy and reliability
- **Client-Side Processing**: All operations performed in the browser
- **Data Portability**: Multiple export formats ensure user data mobility

### 3. Performance by Design
- **SVG Graphics**: Vector-based rendering for scalability and export quality
- **Efficient Rendering**: React optimizations to minimize unnecessary updates
- **Coordinate Efficiency**: Direct mathematical transformations without complex calculations
- **Bundle Optimization**: Modern build tools for fast loading

## Implementation Strategy

### Project Structure
```
wardley-map-editor/
├── src/
│   ├── components/
│   │   ├── Canvas.tsx              # Monolithic SVG canvas component
│   │   ├── Toolbar.tsx             # Component palette and actions
│   │   ├── PropertyPanel.tsx       # Component editing interface
│   │   └── ExportModal.tsx         # Export functionality
│   ├── stores/
│   │   └── mapStore.ts             # Zustand state management
│   ├── types/
│   │   └── index.ts                # TypeScript definitions
│   ├── utils/
│   │   └── exportService.ts        # Export functionality
│   └── App.tsx                     # Main application component
```

### State Management Design
```typescript
// Core data model
interface MapState {
  components: MapComponent[]
  connections: MapConnection[]
  selectedId: string | null
  isConnecting: boolean
  connectionStart: string | null
}

// Component representation
interface MapComponent {
  id: string
  name: string
  x: number        // Evolution position (0-1)
  y: number        // Value chain position (0-1)
  color: string
  notes?: string
}

// Connection representation
interface MapConnection {
  id: string
  fromId: string
  toId: string
  type: 'dependency' | 'flow'
  label?: string
  style?: 'solid' | 'dashed'
}
```

## Key Architectural Decisions

### 1. Monolithic Canvas Component
**Decision**: Single Canvas.tsx with all SVG functionality
**Rationale**: 
- Simplified coordinate management across all elements
- Reduced prop drilling between canvas sub-components
- Better performance with fewer React component boundaries
- Easier debugging and maintenance of coordinate transformations

### 2. Direct Coordinate System
**Decision**: Simple 0-1 coordinate system throughout application
**Rationale**:
- Eliminates complex coordinate transformations
- Consistent mapping across drag operations, display, and export
- Mathematical simplicity for positioning calculations
- Easy to understand and debug

**Implementation**:
```typescript
// SVG coordinate mapping
const SVG_VIEWBOX = "-80 0 1080 600"  // Left padding for axis labels
const CANVAS_WIDTH = 1000              // Evolution axis width
const CANVAS_HEIGHT = 500              // Value chain height (y=50 to y=550)

// Coordinate transformation
const screenToMapCoords = (clientX: number, clientY: number) => {
  const svgX = ((clientX - rect.left) / rect.width) * 1080 - 80
  const canvasX = svgX / 1000
  
  const svgY = ((clientY - rect.top) / rect.height) * 600
  const canvasY = (svgY - 50) / 500
  
  return { x: Math.max(0, Math.min(1, canvasX)), y: Math.max(0, Math.min(1, canvasY)) }
}
```

### 3. Simplified Component Creation
**Decision**: Click-to-add instead of drag-from-palette
**Rationale**:
- More reliable interaction model across devices
- Simpler implementation without complex drag-drop logic
- Better touch device support
- Consistent user experience pattern

### 4. Right-Click Connection System
**Decision**: Right-click to start, click to complete connections
**Rationale**:
- Intuitive interaction model familiar to users
- Clear visual feedback during connection creation
- No complex drag-between-components logic required
- Works well with existing component selection system

## Performance Optimization Principles

### 1. React Rendering Optimization
```typescript
// Memoized coordinate calculations
const screenToMapCoords = useCallback((clientX: number, clientY: number) => {
  // Efficient coordinate transformation
}, [])

// Optimized component rendering
const MapComponent = React.memo(({ component, isSelected }) => {
  // Minimal re-renders based on props
})

// Debounced drag updates
const handleMouseMove = useMemo(() => 
  debounce((e: MouseEvent) => {
    // Update position without excessive renders
  }, 16), // 60fps
[])
```

### 2. SVG Performance Patterns
- **Direct Coordinate Updates**: Avoid complex animations, use direct position updates
- **Minimal DOM Changes**: Only update elements that actually changed
- **Efficient Event Handling**: Use event delegation where possible
- **Optimized Transforms**: Use CSS transforms for smooth visual feedback

### 3. Bundle Optimization Strategy
- **Vite Build System**: Modern bundling with tree shaking
- **Dynamic Imports**: Load export functionality on demand
- **TypeScript Compilation**: Compile-time optimizations and type checking
- **Asset Optimization**: Minimize bundle size while maintaining functionality

## Export System Design

### 1. Multi-Format Export Architecture
```typescript
class ExportService {
  // PDF export using html2canvas + jsPDF
  static async exportToPDF(canvasRef: RefObject<SVGSVGElement>): Promise<void> {
    const canvas = await html2canvas(svgElement, {
      backgroundColor: 'white',
      scale: 2,  // High resolution
      useCORS: true
    })
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })
    
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 277, 190)
    pdf.save('wardley-map.pdf')
  }

  // Draw.io export with coordinate mapping
  static exportToDrawIO(data: ExportData): void {
    const drawioXML = generateDrawIOXML(data)
    downloadFile(drawioXML, 'wardley-map.drawio', 'application/xml')
  }
}
```

### 2. Coordinate Mapping for Draw.io
```typescript
// Precise coordinate transformation for draw.io compatibility
const mapToDrawIOCoords = (component: MapComponent) => {
  const x = component.x * 800 + 100  // Evolution: 0-1 → 100-900
  const y = component.y * 600 + 100  // Value chain: 0-1 → 100-700
  
  // Center the ellipse on the calculated position
  return {
    centerX: x - 40,  // Half of ellipse width
    centerY: y - 25   // Half of ellipse height
  }
}
```

## Error Handling and Resilience

### 1. Graceful Degradation Principles
- **Export Failures**: Provide clear error messages with retry options
- **Storage Errors**: Handle localStorage quota exceeded scenarios
- **Drag Edge Cases**: Proper bounds checking and constraint handling
- **State Corruption**: Automatic recovery from invalid state

### 2. Data Persistence Strategy
```typescript
// Automatic state persistence with error handling
const persistState = (state: MapState) => {
  try {
    localStorage.setItem('wardley-map-state', JSON.stringify(state))
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      // Handle storage quota exceeded
      showStorageWarning()
    }
  }
}

// State recovery on application load
const recoverState = (): MapState => {
  try {
    const saved = localStorage.getItem('wardley-map-state')
    return saved ? JSON.parse(saved) : getDefaultState()
  } catch (error) {
    console.warn('Failed to recover state:', error)
    return getDefaultState()
  }
}
```

## Quality Assurance Principles

### 1. TypeScript Integration
- **Strict Type Checking**: Enable strict mode for maximum type safety
- **Interface Definitions**: Clear contracts for all data structures
- **Type Guards**: Runtime type validation where needed
- **Generic Types**: Reusable type definitions for common patterns

### 2. Testing Strategy
- **Unit Tests**: Core business logic and utility functions
- **Integration Tests**: Component interactions and state management
- **Manual Testing**: Cross-browser compatibility and user experience
- **Performance Testing**: Load time and interaction responsiveness

### 3. Code Quality Standards
- **ESLint Configuration**: Consistent code style and error detection
- **Prettier Integration**: Automatic code formatting
- **Import Organization**: Clear module dependencies
- **Documentation**: Inline comments for complex logic

## Deployment and Build Principles

### 1. Production Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: '/demo-responsible-vibe-wardley/',  // GitHub Pages path
  build: {
    outDir: 'dist',
    sourcemap: false,  // Smaller bundle for production
    minify: 'terser',  // Better compression
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['zustand', 'html2canvas', 'jspdf']
        }
      }
    }
  }
})
```

### 2. CI/CD Pipeline Design
```yaml
# Automated deployment workflow
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install and Build
        run: |
          cd wardley-map-editor
          npm ci
          npm run build
      
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
        with:
          artifact_name: github-pages
          path: wardley-map-editor/dist
```

## Future Enhancement Architecture

### 1. Extensibility Design
- **Component System**: Framework supports new component types and shapes
- **Export Plugins**: Modular export system for additional formats
- **Theme System**: CSS-based styling enables easy visual customization
- **Event System**: Centralized event handling for features like undo/redo

### 2. Scalability Considerations
- **Component Virtualization**: Architecture ready for large map optimization
- **Storage Migration**: Easy transition from localStorage to IndexedDB
- **Performance Monitoring**: Hooks for performance measurement and optimization
- **Feature Flags**: System for gradual feature rollout and A/B testing

### 3. Collaboration Readiness
- **State Synchronization**: Current state management compatible with real-time sync
- **Conflict Resolution**: Data structures support operational transformation
- **User Management**: Architecture extensible for multi-user scenarios
- **Version Control**: Event sourcing pattern ready for history tracking
