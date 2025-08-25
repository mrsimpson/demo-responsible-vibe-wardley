# Development Plan: demo-responsible-vibe-wardley (local-storage branch)

*Generated on 2025-08-21 by Vibe Feature MCP*
*Workflow: [epcc](https://mrsimpson.github.io/responsible-vibe-mcp/workflows/epcc)*

## Goal
Add local storage functionality to the Wardley Map Editor to allow users to save and load their created maps locally in the browser using localStorage API.

## Explore
### Tasks
- [x] Examine project structure and identify main components
- [x] Understand current data model and state management (Zustand store with MapComponent and MapConnection interfaces)
- [x] Check existing export utilities for data serialization patterns (Found ExportService with JSON import/export)
- [x] Examine current UI components (Toolbar) for integration points
- [x] Research localStorage API requirements for map persistence

### Completed
- [x] Created development plan file

## Key Decisions
- **Data Structure**: Use existing ExportData interface from ExportService for localStorage format
- **Storage Key**: Use descriptive localStorage keys like 'wardley-maps-saved' for map list
- **Integration Point**: Add Save/Load buttons to Toolbar Actions section
- **Persistence Strategy**: Auto-save on changes + manual save with naming

## Plan

### Phase Entrance Criteria:
- [x] Current codebase structure is understood
- [x] Requirements for local storage functionality are defined
- [x] Technical approach options have been evaluated

### Tasks
- [x] Define localStorage service interface and data structure
- [x] Design UI components for save/load functionality
- [x] Plan integration with existing Zustand store
- [x] Define user experience flow for saving and loading maps
- [x] Consider error handling and edge cases
- [x] Plan auto-save functionality

### Implementation Strategy

**1. LocalStorage Service**
- Create `localStorageService.ts` utility class
- Use existing `ExportData` interface for consistency
- Implement save/load/list/delete operations
- Handle JSON serialization errors gracefully

**2. UI Integration**
- Add Save/Load buttons to Toolbar Actions section
- Create modal for naming saved maps
- Show list of saved maps with load/delete options
- Add visual feedback for save/load operations

**3. Store Integration** 
- Add localStorage methods to mapStore
- Implement auto-save on map changes (debounced)
- Add map metadata (name, lastModified, etc.)

**4. User Experience**
- Save: Click save → name dialog → confirm save
- Load: Click load → map list → select map → confirm load
- Auto-save: Save current work automatically every 30 seconds
- Clear indication of unsaved changes

### Completed
*None yet*

## Code
### Tasks
- [x] Create `src/utils/localStorageService.ts` with save/load/list/delete methods
- [x] Create `src/components/SaveMapModal.tsx` for naming saved maps
- [x] Create `src/components/LoadMapModal.tsx` for selecting saved maps
- [x] Update `src/stores/mapStore.ts` to add localStorage integration
- [ ] Update `src/components/Toolbar.tsx` to add Save/Load buttons
- [ ] Add auto-save functionality with debouncing
- [ ] Add error handling and user feedback
- [ ] Test localStorage functionality across browser sessions

### Implementation Details

**LocalStorage Service Structure:**
```typescript
interface SavedMap {
  id: string
  name: string
  data: ExportData
  createdAt: string
  lastModified: string
}

class LocalStorageService {
  saveMap(name: string, data: ExportData): boolean
  loadMap(id: string): SavedMap | null
  listMaps(): SavedMap[]
  deleteMap(id: string): boolean
  clearAllMaps(): boolean
}
```

**Store Extensions:**
- Add `currentMapName`, `hasUnsavedChanges`, `lastSaved` to state
- Add `saveCurrentMap`, `loadMap`, `autoSave` actions
- Implement change detection for auto-save triggering

**UI Components:**
- SaveMapModal: Input field + save/cancel buttons
- LoadMapModal: List of saved maps + load/delete actions per item
- Visual indicators for save status in toolbar

### Error Handling & Edge Cases
- **Storage Quota Exceeded**: Graceful fallback with user notification
- **Corrupted Data**: Validate JSON structure before loading
- **Duplicate Names**: Allow overwrite with confirmation dialog
- **Empty Maps**: Prevent saving completely empty maps
- **Browser Compatibility**: Ensure localStorage is available
- **Data Migration**: Handle future schema changes gracefully

### Auto-Save Strategy
- Debounce auto-save to avoid excessive localStorage writes
- Save every 30 seconds if changes detected
- Visual indicator showing "Saving..." and "All changes saved"
- Disable auto-save during active user interactions (dragging, etc.)

### Completed
*None yet*

## Commit
### Tasks
- [ ] *To be added when this phase becomes active*

### Completed
*None yet*

## Key Decisions
*Important decisions will be documented here as they are made*

## Notes
*Additional context and observations*

---
*This plan is maintained by the LLM. Tool responses provide guidance on which section to focus on and what tasks to work on.*
