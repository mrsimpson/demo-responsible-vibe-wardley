import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { saveAs } from 'file-saver'

// Define types locally to avoid circular imports
interface MapComponent {
  id: string
  name: string
  x: number
  y: number
  color: string
  notes?: string
}

interface MapConnection {
  id: string
  fromId: string
  toId: string
  type: 'dependency' | 'flow'
  style?: 'solid' | 'dashed'
  label?: string
}

export interface ExportData {
  components: MapComponent[]
  connections: MapConnection[]
  metadata: {
    title: string
    createdAt: string
    exportedAt: string
    version: string
  }
}

export class ExportService {
  // Export as PNG image
  static async exportToPNG(canvasElement: SVGSVGElement, filename: string = 'wardley-map.png') {
    try {
      // Create a temporary container with white background
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '-9999px'
      container.style.width = '1200px'
      container.style.height = '800px'
      container.style.backgroundColor = 'white'
      container.style.padding = '20px'
      
      // Clone the SVG
      const svgClone = canvasElement.cloneNode(true) as SVGSVGElement
      svgClone.style.width = '1160px'
      svgClone.style.height = '760px'
      
      container.appendChild(svgClone)
      document.body.appendChild(container)
      
      // Convert to canvas
      const canvas = await html2canvas(container, {
        backgroundColor: 'white',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true
      })
      
      // Clean up
      document.body.removeChild(container)
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, filename)
        }
      }, 'image/png')
      
      return true
    } catch (error) {
      console.error('PNG export failed:', error)
      return false
    }
  }

  // Export as PDF
  static async exportToPDF(canvasElement: SVGSVGElement, filename: string = 'wardley-map.pdf') {
    try {
      // Create a temporary container
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '-9999px'
      container.style.width = '1200px'
      container.style.height = '800px'
      container.style.backgroundColor = 'white'
      container.style.padding = '20px'
      
      // Clone the SVG
      const svgClone = canvasElement.cloneNode(true) as SVGSVGElement
      svgClone.style.width = '1160px'
      svgClone.style.height = '760px'
      
      container.appendChild(svgClone)
      document.body.appendChild(container)
      
      // Convert to canvas
      const canvas = await html2canvas(container, {
        backgroundColor: 'white',
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      // Clean up
      document.body.removeChild(container)
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 297 // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(filename)
      
      return true
    } catch (error) {
      console.error('PDF export failed:', error)
      return false
    }
  }

  // Export as Draw.io XML
  static exportToDrawIO(data: ExportData, filename: string = 'wardley-map.drawio') {
    try {
      const xml = this.generateDrawIOXML(data)
      const blob = new Blob([xml], { type: 'application/xml' })
      saveAs(blob, filename)
      return true
    } catch (error) {
      console.error('Draw.io export failed:', error)
      return false
    }
  }

  // Export as JSON
  static exportToJSON(data: ExportData, filename: string = 'wardley-map.json') {
    try {
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      saveAs(blob, filename)
      return true
    } catch (error) {
      console.error('JSON export failed:', error)
      return false
    }
  }

  // Import from JSON
  static async importFromJSON(file: File): Promise<ExportData | null> {
    try {
      const text = await file.text()
      const data = JSON.parse(text) as ExportData
      
      // Validate the data structure
      if (!data.components || !data.connections || !data.metadata) {
        throw new Error('Invalid file format')
      }
      
      return data
    } catch (error) {
      console.error('JSON import failed:', error)
      return null
    }
  }

  // Generate Draw.io XML format
  private static generateDrawIOXML(data: ExportData): string {
    const components = data.components.map((component, index) => {
      // Scale to draw.io coordinates with proper centering
      // Web canvas: evolution 0-1 maps to x=0-1000, value chain 0-1 maps to y=50-550
      // Draw.io: we need to map this to the coordinate system with left padding
      const x = component.x * 800 + 100 // Evolution: 0-1 becomes 100-900 in draw.io
      const y = component.y * 600 + 100 // Value chain: 0-1 becomes 100-700 in draw.io
      
      // For draw.io, we need to position the ellipse so its center aligns with our circle center
      // draw.io ellipse geometry is positioned by top-left corner, so we offset by half width/height
      const width = 80
      const height = 50
      const centerX = x - (width / 2)  // Offset to center the ellipse
      const centerY = y - (height / 2) // Offset to center the ellipse
      
      return `
        <mxCell id="component-${component.id}" value="${this.escapeXML(component.name)}" 
                style="ellipse;whiteSpace=wrap;html=1;fillColor=${component.color};strokeColor=#000000;fontColor=#FFFFFF;fontSize=12;fontStyle=1;aspect=fixed" 
                vertex="1" parent="1">
          <mxGeometry x="${centerX}" y="${centerY}" width="${width}" height="${height}" as="geometry"/>
        </mxCell>`
    }).join('')

    const connections = data.connections.map((connection, index) => {
      const fromComponent = data.components.find(c => c.id === connection.fromId)
      const toComponent = data.components.find(c => c.id === connection.toId)
      
      if (!fromComponent || !toComponent) return ''
      
      const strokeStyle = connection.style === 'dashed' ? 'dashed=1;' : ''
      const strokeColor = connection.type === 'flow' ? '#10B981' : '#666666'
      
      return `
        <mxCell id="connection-${connection.id}" value="${this.escapeXML(connection.label || '')}" 
                style="endArrow=classic;html=1;strokeColor=${strokeColor};${strokeStyle}fontSize=10;exitX=0.5;exitY=0.5;exitDx=0;exitDy=0;entryX=0.5;entryY=0.5;entryDx=0;entryDy=0" 
                edge="1" parent="1" source="component-${connection.fromId}" target="component-${connection.toId}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`
    }).join('')

    return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="Wardley Map Editor" version="1.0">
  <diagram name="Wardley Map" id="wardley-map">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- Evolution Axis Background Stages -->
        <mxCell id="genesis-bg" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=none;opacity=30" vertex="1" parent="1">
          <mxGeometry x="100" y="100" width="200" height="600" as="geometry"/>
        </mxCell>
        <mxCell id="custom-bg" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#DDD6FE;strokeColor=none;opacity=30" vertex="1" parent="1">
          <mxGeometry x="300" y="100" width="200" height="600" as="geometry"/>
        </mxCell>
        <mxCell id="product-bg" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#DCFCE7;strokeColor=none;opacity=30" vertex="1" parent="1">
          <mxGeometry x="500" y="100" width="200" height="600" as="geometry"/>
        </mxCell>
        <mxCell id="commodity-bg" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FEE2E2;strokeColor=none;opacity=30" vertex="1" parent="1">
          <mxGeometry x="700" y="100" width="200" height="600" as="geometry"/>
        </mxCell>
        
        <!-- Evolution Axis Line -->
        <mxCell id="evolution-line" value="" style="endArrow=none;html=1;strokeColor=#374151;strokeWidth=3" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="100" y="700" as="sourcePoint"/>
            <mxPoint x="900" y="700" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        
        <!-- Value Chain Axis Line - positioned at Genesis (x=100) -->
        <mxCell id="value-chain-line" value="" style="endArrow=none;html=1;strokeColor=#374151;strokeWidth=3" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="100" y="100" as="sourcePoint"/>
            <mxPoint x="100" y="700" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        
        <!-- Grid Lines -->
        <mxCell id="grid-v1" value="" style="endArrow=none;html=1;strokeColor=#E5E7EB;strokeWidth=1;opacity=50" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="300" y="100" as="sourcePoint"/>
            <mxPoint x="300" y="700" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="grid-v2" value="" style="endArrow=none;html=1;strokeColor=#E5E7EB;strokeWidth=1;opacity=50" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="500" y="100" as="sourcePoint"/>
            <mxPoint x="500" y="700" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="grid-v3" value="" style="endArrow=none;html=1;strokeColor=#E5E7EB;strokeWidth=1;opacity=50" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="700" y="100" as="sourcePoint"/>
            <mxPoint x="700" y="700" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        
        <!-- Horizontal Grid Lines -->
        <mxCell id="grid-h1" value="" style="endArrow=none;html=1;strokeColor=#E5E7EB;strokeWidth=1;opacity=30" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="100" y="250" as="sourcePoint"/>
            <mxPoint x="900" y="250" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="grid-h2" value="" style="endArrow=none;html=1;strokeColor=#E5E7EB;strokeWidth=1;opacity=30" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="100" y="400" as="sourcePoint"/>
            <mxPoint x="900" y="400" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="grid-h3" value="" style="endArrow=none;html=1;strokeColor=#E5E7EB;strokeWidth=1;opacity=30" edge="1" parent="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="100" y="550" as="sourcePoint"/>
            <mxPoint x="900" y="550" as="targetPoint"/>
          </mxGeometry>
        </mxCell>
        
        <!-- Evolution Axis Title -->
        <mxCell id="evolution-axis" value="Evolution" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=16;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="450" y="730" width="100" height="30" as="geometry"/>
        </mxCell>
        
        <!-- Value Chain Axis Title -->
        <mxCell id="value-chain-axis" value="Value Chain" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=16;fontStyle=1;rotation=-90" vertex="1" parent="1">
          <mxGeometry x="20" y="360" width="100" height="30" as="geometry"/>
        </mxCell>
        
        <!-- Evolution Stage Labels -->
        <mxCell id="genesis-label" value="Genesis" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="170" y="710" width="60" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="custom-label" value="Custom" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="370" y="710" width="60" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="product-label" value="Product" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="570" y="710" width="60" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="commodity-label" value="Commodity" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="770" y="710" width="80" height="20" as="geometry"/>
        </mxCell>
        
        <!-- Value Chain Labels -->
        <mxCell id="visible-label" value="Visible" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="40" y="90" width="60" height="20" as="geometry"/>
        </mxCell>
        <mxCell id="invisible-label" value="Invisible" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="40" y="690" width="60" height="20" as="geometry"/>
        </mxCell>
        
        ${components}
        ${connections}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`
  }

  private static escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
}
