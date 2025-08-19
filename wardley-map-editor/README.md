# Wardley Map Editor

A modern, interactive Wardley Map editor built with React and TypeScript. Create strategic maps with intuitive drag-and-drop functionality and export to multiple formats.

## 🚀 Live Demo

**[Try it now!](https://mrsimpson.github.io/demo-responsible-vibe-wardley/)**

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
cd wardley-map-editor
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Deploy
```bash
npm run deploy
```

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

## 🚀 Deployment

This project automatically deploys to GitHub Pages via GitHub Actions on every push to main.

## 📝 License

MIT License - feel free to use and modify!

---

Built with ❤️ for strategic thinking and Wardley mapping
