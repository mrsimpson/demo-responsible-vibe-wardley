# Requirements Document: Web-Based Wardley Map Editor

## REQ-1: Canvas-Based Map Creation
**WHEN** the application loads  
**THE SYSTEM SHALL** display a blank canvas ready for component placement

**WHEN** a user adds components  
**THE SYSTEM SHALL** position them on both value chain (Y-axis) and evolution (X-axis)

**WHEN** a user drags components  
**THE SYSTEM SHALL** update their position in real-time with visual feedback

## REQ-2: Drag-and-Drop Component Management
**WHEN** a user clicks a component type from the palette  
**THE SYSTEM SHALL** create and place it on the canvas

**WHEN** a user drags an existing component  
**THE SYSTEM SHALL** move it to the new position within canvas bounds

**WHEN** a user drags a component  
**THE SYSTEM SHALL** provide visual feedback during the drag operation

## REQ-3: Evolution Axis with Standard Stages
**WHEN** the canvas is displayed  
**THE SYSTEM SHALL** show the evolution axis with 4 standard stages (Genesis, Custom, Product, Commodity)

**WHEN** a user places a component  
**THE SYSTEM SHALL** allow numeric positioning along the evolution axis from 0 to 1

**WHEN** a component is positioned  
**THE SYSTEM SHALL** display its evolution stage clearly based on its X coordinate

## REQ-4: Component Annotation System
**WHEN** a user selects a component  
**THE SYSTEM SHALL** allow editing of text labels via the property panel

**WHEN** a user right-clicks a component  
**THE SYSTEM SHALL** enable connection mode to create relationships

**WHEN** a user needs categorization  
**THE SYSTEM SHALL** offer color coding options for components

**WHEN** a user needs detailed information  
**THE SYSTEM SHALL** support notes/comments on components

## REQ-5: Professional PDF Export
**WHEN** a user requests PDF export  
**THE SYSTEM SHALL** generate a professional-quality PDF file

**WHEN** the PDF is created  
**THE SYSTEM SHALL** maintain all visual elements (components, labels, colors, arrows)

**WHEN** the PDF is generated  
**THE SYSTEM SHALL** use landscape A4 format suitable for presentations

## REQ-6: Draw.io Format Export
**WHEN** a user requests draw.io export  
**THE SYSTEM SHALL** generate a compatible .drawio XML file

**WHEN** the exported file is opened in draw.io  
**THE SYSTEM SHALL** preserve component positioning and properties

**WHEN** components are exported to draw.io  
**THE SYSTEM SHALL** maintain pixel-perfect coordinate mapping

## REQ-7: Local-First Data Storage
**WHEN** a user creates or modifies a map  
**THE SYSTEM SHALL** store all data in local browser storage

**WHEN** a user works without internet connectivity  
**THE SYSTEM SHALL** function completely offline

**WHEN** a user closes and reopens the application  
**THE SYSTEM SHALL** automatically restore the previous map state

## REQ-8: High-Performance Interactions
**WHEN** a user performs any interaction  
**THE SYSTEM SHALL** respond within 100 milliseconds

**WHEN** a user drags components  
**THE SYSTEM SHALL** provide smooth, real-time visual feedback at 60fps

**WHEN** a user loads the application  
**THE SYSTEM SHALL** be ready for use within 3 seconds

## REQ-9: Intuitive User Interface
**WHEN** a new user opens the application  
**THE SYSTEM SHALL** present a self-explanatory interface

**WHEN** a user interacts with components  
**THE SYSTEM SHALL** provide clear visual feedback for all actions

**WHEN** a user makes errors  
**THE SYSTEM SHALL** handle them gracefully without crashes

## REQ-10: Single Facilitator Model
**WHEN** facilitating a session  
**THE SYSTEM SHALL** optimize for single-user control

**WHEN** displaying to an audience  
**THE SYSTEM SHALL** provide clear, readable visuals suitable for projection

**WHEN** making changes during presentation  
**THE SYSTEM SHALL** ensure smooth workflow without technical distractions

## REQ-11: Multiple Export Formats
**WHEN** a user requests PNG export  
**THE SYSTEM SHALL** generate high-resolution image files

**WHEN** a user requests JSON export  
**THE SYSTEM SHALL** serialize complete map data for backup and sharing

**WHEN** export operations are performed  
**THE SYSTEM SHALL** maintain data fidelity across all formats

## REQ-12: Coordinate System Precision
**WHEN** the value chain axis is displayed  
**THE SYSTEM SHALL** position it at evolution coordinate 0 (Genesis)

**WHEN** axis labels are shown  
**THE SYSTEM SHALL** display "Visible", "Invisible", and "Value Chain" text clearly

**WHEN** components are positioned at coordinate (0,0)  
**THE SYSTEM SHALL** align them exactly with the axis intersection

## REQ-13: Automated Deployment
**WHEN** code changes are pushed to the main branch  
**THE SYSTEM SHALL** automatically build and deploy the application

**WHEN** the build process runs  
**THE SYSTEM SHALL** generate optimized production assets

**WHEN** deployment completes  
**THE SYSTEM SHALL** make the application available at the public URL
