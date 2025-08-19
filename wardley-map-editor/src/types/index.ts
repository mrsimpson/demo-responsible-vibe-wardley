// Core data models for the Wardley Map Editor

export interface MapComponent {
  id: string
  name: string
  x: number // Evolution position (0-1)
  y: number // Value chain position (0-1)
  color: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface MapConnection {
  id: string
  fromId: string
  toId: string
  type: 'dependency' | 'flow'
  style?: 'solid' | 'dashed'
}

export interface Viewport {
  x: number
  y: number
  zoom: number
}

export interface MapState {
  components: MapComponent[]
  connections: MapConnection[]
  selectedId: string | null
  viewport: Viewport
  isDragging: boolean
  dragOffset: { x: number, y: number }
}

// Evolution stages for the Wardley map
export const EVOLUTION_STAGES = {
  GENESIS: { name: 'Genesis', min: 0, max: 0.25 },
  CUSTOM: { name: 'Custom', min: 0.25, max: 0.5 },
  PRODUCT: { name: 'Product', min: 0.5, max: 0.75 },
  COMMODITY: { name: 'Commodity', min: 0.75, max: 1 }
} as const

export type EvolutionStage = keyof typeof EVOLUTION_STAGES

// Predefined component types for the palette
export interface ComponentTemplate {
  name: string
  color: string
  description?: string
}

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  { name: 'Customer', color: '#3B82F6', description: 'End user or customer' },
  { name: 'Product', color: '#10B981', description: 'Product or service offering' },
  { name: 'Service', color: '#F59E0B', description: 'Supporting service' },
  { name: 'Data', color: '#8B5CF6', description: 'Data or information' },
  { name: 'Platform', color: '#EF4444', description: 'Platform or infrastructure' },
  { name: 'Component', color: '#6B7280', description: 'Generic component' }
]

// Export formats
export type ExportFormat = 'pdf' | 'drawio' | 'png'

export interface ExportOptions {
  format: ExportFormat
  quality?: number
  includeBackground?: boolean
  filename?: string
}
