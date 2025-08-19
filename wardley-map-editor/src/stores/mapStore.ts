import { create } from 'zustand'

// Simplified interfaces for now
export interface MapComponent {
  id: string
  name: string
  x: number // Evolution position (0-1)
  y: number // Value chain position (0-1)
  color: string
  notes?: string
}

export interface MapState {
  components: MapComponent[]
  selectedId: string | null
  isDragging: boolean
}

// Generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

interface MapStore extends MapState {
  // Component actions
  addComponent: (component: Omit<MapComponent, 'id'>) => void
  updateComponent: (id: string, updates: Partial<MapComponent>) => void
  deleteComponent: (id: string) => void
  selectComponent: (id: string | null) => void
  
  // Drag actions
  startDrag: (componentId: string) => void
  updateDrag: (id: string, x: number, y: number) => void
  endDrag: () => void
  
  // Utility
  clearMap: () => void
}

export const useMapStore = create<MapStore>((set, get) => ({
  // Initial state
  components: [],
  selectedId: null,
  isDragging: false,
  
  // Actions
  addComponent: (componentData) => {
    const component: MapComponent = {
      ...componentData,
      id: generateId()
    }
    
    set((state) => ({
      components: [...state.components, component],
      selectedId: component.id
    }))
  },
  
  updateComponent: (id, updates) => {
    set((state) => ({
      components: state.components.map(component =>
        component.id === id ? { ...component, ...updates } : component
      )
    }))
  },
  
  deleteComponent: (id) => {
    set((state) => ({
      components: state.components.filter(component => component.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId
    }))
  },
  
  selectComponent: (id) => {
    set({ selectedId: id })
  },
  
  startDrag: (componentId) => {
    set({
      isDragging: true,
      selectedId: componentId
    })
  },
  
  updateDrag: (id, x, y) => {
    // Constrain to canvas bounds (0-1)
    const constrainedX = Math.max(0, Math.min(1, x))
    const constrainedY = Math.max(0, Math.min(1, y))
    
    get().updateComponent(id, { x: constrainedX, y: constrainedY })
  },
  
  endDrag: () => {
    set({ isDragging: false })
  },
  
  clearMap: () => {
    set({
      components: [],
      selectedId: null,
      isDragging: false
    })
  }
}))
