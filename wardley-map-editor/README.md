# Wardley Map Editor

A modern, interactive Wardley Map editor built with React and TypeScript. Create strategic maps with intuitive drag-and-drop functionality and export to multiple formats.

## ✨ Features

### 🎯 **Core Functionality**
- **Interactive Canvas**: Drag and drop components anywhere on the map
- **Perfect Coordinate System**: Proper axis alignment with Genesis at (0,0)
- **Component Management**: Add, edit, and delete map components
- **Connection System**: Right-click to create dependencies between components

### 📊 **Visual Design**
- **Evolution Stages**: Genesis → Custom → Product → Commodity
- **Value Chain Axis**: Visible (top) to Invisible (bottom)
- **Color-coded Components**: Different colors for different component types
- **Professional Layout**: Clean, intuitive interface

### 📤 **Export Options**
- **PDF Export**: High-quality PDF for presentations
- **PNG Export**: Image format for documents
- **Draw.io Export**: Continue editing in Draw.io with pixel-perfect positioning
- **JSON Export**: Save and share map data

### 🎨 **User Experience**
- **Simplified Drag-and-Drop**: Reliable, constraint-free component positioning
- **Real-time Updates**: Immediate visual feedback
- **Property Panel**: Edit component details and positioning
- **Responsive Design**: Works on desktop and tablet devices

## 🛠️ Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🏗️ Architecture

- **React 19** with TypeScript
- **Zustand** for state management
- **Vite** for build tooling
- **SVG Canvas** for precise positioning
- **jsPDF** and **html2canvas** for exports

## 📋 Usage

1. **Add Components**: Click component types in the left panel
2. **Position Components**: Drag components to desired locations
3. **Create Connections**: Right-click a component, then click another to connect
4. **Edit Properties**: Select components to edit in the right panel
5. **Export Maps**: Use the export buttons for PDF, PNG, Draw.io, or JSON

## 🎯 Wardley Mapping Concepts

- **Evolution Axis**: How evolved/commoditized something is (left to right)
- **Value Chain Axis**: How visible to the user something is (top to bottom)
- **Components**: The things that make up your system
- **Dependencies**: How components depend on each other

## 📝 Technical Details

### Component Structure
```
src/
├── components/          # React components
│   ├── Canvas.tsx      # Main SVG canvas
│   ├── Toolbar.tsx     # Component palette
│   └── PropertyPanel.tsx # Component editor
├── stores/             # Zustand state management
├── utils/              # Export and utility functions
└── types/              # TypeScript definitions
```

### State Management
- **Zustand store** for global state
- **Component state**: positions, properties, connections
- **UI state**: selections, modal visibility
- **Export state**: format options and data preparation

### Export System
- **PDF**: Uses jsPDF with SVG rendering
- **PNG**: Uses html2canvas for image capture
- **Draw.io**: Generates XML with precise coordinate mapping
- **JSON**: Serializes complete map state

---

Built with ❤️ for strategic thinking and Wardley mapping
