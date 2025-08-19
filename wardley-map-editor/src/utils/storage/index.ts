import { MapState } from '../../types'

// Auto-save functionality
export class AutoSave {
  private static instance: AutoSave
  private intervalId: NodeJS.Timeout | null = null
  private readonly AUTOSAVE_INTERVAL = 30000 // 30 seconds
  private readonly AUTOSAVE_KEY = 'wardley-map-autosave'

  static getInstance(): AutoSave {
    if (!AutoSave.instance) {
      AutoSave.instance = new AutoSave()
    }
    return AutoSave.instance
  }

  start(getState: () => MapState): void {
    this.stop() // Clear any existing interval
    
    this.intervalId = setInterval(() => {
      try {
        const state = getState()
        const saveData = {
          components: state.components,
          connections: state.connections,
          viewport: state.viewport,
          timestamp: new Date().toISOString()
        }
        
        localStorage.setItem(this.AUTOSAVE_KEY, JSON.stringify(saveData))
        console.log('Auto-saved map data')
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }, this.AUTOSAVE_INTERVAL)
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  getLastSave(): any | null {
    try {
      const saved = localStorage.getItem(this.AUTOSAVE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('Failed to retrieve auto-save:', error)
      return null
    }
  }

  clearAutoSave(): void {
    localStorage.removeItem(this.AUTOSAVE_KEY)
  }
}

// Manual save/load functionality
export const saveMapToFile = (state: MapState, filename: string = 'wardley-map.json'): void => {
  try {
    const saveData = {
      components: state.components,
      connections: state.connections,
      viewport: state.viewport,
      metadata: {
        version: '1.0',
        createdAt: new Date().toISOString(),
        appName: 'Wardley Map Editor'
      }
    }

    const blob = new Blob([JSON.stringify(saveData, null, 2)], { 
      type: 'application/json' 
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to save map to file:', error)
    throw new Error('Failed to save map file')
  }
}

export const loadMapFromFile = (file: File): Promise<Partial<MapState>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const data = JSON.parse(content)
        
        // Validate the data structure
        if (!data.components || !Array.isArray(data.components)) {
          throw new Error('Invalid map file format')
        }
        
        resolve({
          components: data.components,
          connections: data.connections || [],
          viewport: data.viewport || { x: 0, y: 0, zoom: 1 }
        })
      } catch (error) {
        reject(new Error('Failed to parse map file'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read map file'))
    }
    
    reader.readAsText(file)
  })
}

// Storage quota management
export const checkStorageQuota = (): { used: number, available: number, percentage: number } => {
  try {
    let used = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }
    
    // Rough estimate of localStorage limit (usually 5-10MB)
    const estimated_limit = 5 * 1024 * 1024 // 5MB
    const available = estimated_limit - used
    const percentage = (used / estimated_limit) * 100
    
    return { used, available, percentage }
  } catch (error) {
    console.error('Failed to check storage quota:', error)
    return { used: 0, available: 0, percentage: 0 }
  }
}

// Cleanup old data
export const cleanupOldData = (daysToKeep: number = 30): void => {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
    
    const keysToRemove: string[] = []
    
    for (const key in localStorage) {
      if (key.startsWith('wardley-map-') && key !== 'wardley-map-storage') {
        try {
          const data = JSON.parse(localStorage[key])
          if (data.timestamp) {
            const dataDate = new Date(data.timestamp)
            if (dataDate < cutoffDate) {
              keysToRemove.push(key)
            }
          }
        } catch {
          // If we can't parse it, it might be old format - remove it
          keysToRemove.push(key)
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    console.log(`Cleaned up ${keysToRemove.length} old map files`)
  } catch (error) {
    console.error('Failed to cleanup old data:', error)
  }
}
