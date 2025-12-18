import { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'
import { initialNodes, initialEdges, generateExpansion, NodeData, EdgeData } from '../data/mockData'
import { nodeIcons } from '../utils/nodeIcons'

interface GraphViewProps {
  onNodeSelect: (node: NodeData) => void;
  searchResults?: any;
}

const GraphView = ({ onNodeSelect, searchResults }: GraphViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Use search results if available, otherwise use initialNodes
    // FILTER LOGIC: If explicit search results are passed, show them.
    // Otherwise, show initialNodes BUT exclude the "Expansion Children" (Personnel) initially.
    // They will be added dynamically on click.
    let nodes: { data: NodeData }[] = [];
    let edges: { data: EdgeData }[] = [];

    if (searchResults) {
      nodes = searchResults.nodes;
      edges = searchResults.edges;
    } else {
      // Initial State: Show only MOFA + Minister
      // Hide ALL divisions and ALL personnel
      const divisionIds = initialNodes
        .filter(n => n.data.id.startsWith('DIV-EX'))
        .map(n => n.data.id);

      const personnelIds = initialNodes
        .filter(n =>
          n.data.id.startsWith('PER-EUR') ||
          n.data.id.startsWith('PER-CT') ||
          n.data.id.startsWith('PER-AUD') ||
          n.data.id.startsWith('PER-UN') ||
          n.data.id === 'PER-SADIA-IQBAL'
        )
        .map(n => n.data.id);

      const hiddenNodeIds = [...divisionIds, ...personnelIds];

      nodes = initialNodes.filter(n => !hiddenNodeIds.includes(n.data.id));
      edges = initialEdges.filter(e =>
        !hiddenNodeIds.includes(e.data.target) &&
        !hiddenNodeIds.includes(e.data.source)
      );
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...nodes, ...edges],

      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#cbd5e1', // slate-300
            'font-family': 'JetBrains Mono, monospace',
            'font-size': '10px',
            'font-weight': '600',
            'text-transform': 'uppercase',
            'text-valign': 'bottom',
            'text-margin-y': 12,
            'text-background-color': '#020617', // navy-950
            'text-background-opacity': 0.9,
            'text-background-padding': '4px',
            'text-background-shape': 'roundrectangle',
            'width': 64,
            'height': 64,
            'background-fit': 'cover',
            'background-opacity': 0,
            'border-width': 2,
            'border-color': '#6366f1', // indigo-500
            'border-opacity': 0.3,
            'overlay-opacity': 0,
            'transition-property': 'border-width, border-color, width, height',
            'transition-duration': '0.3s'
          }
        },
        // Icon Mappings
        {
          selector: 'node[type="PERSON"]',
          style: { 'background-image': nodeIcons.PERSON }
        },
        {
          selector: 'node[type="ORG"]',
          style: { 'background-image': nodeIcons.ORG }
        },
        {
          selector: 'node[type="LOC"]',
          style: { 'background-image': nodeIcons.LOC }
        },
        {
          selector: 'node[type="FINANCE"]',
          style: { 'background-image': nodeIcons.FINANCE }
        },
        {
          selector: 'node[type="COMMS"]',
          style: { 'background-image': nodeIcons.COMMS }
        },
        {
          selector: 'node[type="WEAPON"]',
          style: { 'background-image': nodeIcons.WEAPON }
        },
        // Hover State
        {
          selector: 'node:active',
          style: {
            'border-width': 3,
            'border-color': '#22d3ee', // tactical-cyan-light
            'border-opacity': 0.8,
          } as any
        },
        // Selection State
        {
          selector: ':selected',
          style: {
            'border-width': 3,
            'border-color': '#06b6d4', // tactical-cyan
            'border-opacity': 1,
            'width': 76,
            'height': 76,
            'color': '#f1f5f9', // slate-100
            'font-weight': '700',
            'text-background-color': '#6366f1', // indigo-500
            'text-background-opacity': 0.95,
            'shadow-blur': 30,
            'shadow-color': '#06b6d4',
            'shadow-opacity': 0.6,
            'shadow-offset-x': 0,
            'shadow-offset-y': 0,
            'transition-property': 'width, height, border-width, font-size',
            'transition-duration': '0.3s'
          } as any
        },
        // Edges
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#06b6d4', // tactical-cyan
            'line-opacity': 0.4,
            'target-arrow-color': '#06b6d4',
            'target-arrow-shape': 'vee',
            'arrow-scale': 1.2,
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '10px',
            'font-family': 'JetBrains Mono, monospace',
            'font-weight': '600',
            'color': '#22d3ee', // tactical-cyan-light
            'text-rotation': 'autorotate',
            'text-background-color': '#020617', // navy-950
            'text-background-opacity': 0.9,
            'text-background-padding': '3px',
            'text-margin-y': -14,
            'text-transform': 'uppercase',
            'transition-property': 'line-color, width',
            'transition-duration': '0.3s'
          }
        },
        // Edge Hover/Selected
        {
          selector: 'edge:selected',
          style: {
            'width': 3,
            'line-color': '#22d3ee',
            'line-opacity': 0.8,
            'target-arrow-color': '#22d3ee',
          } as any
        }
      ] as any,

      layout: {
        name: 'grid'
      }
    });

    cyRef.current = cy;

    // Initial Animation
    cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 1200,
      fit: true,
      padding: 60,
      randomize: true,
      nodeRepulsion: 1200000,
      idealEdgeLength: 200,
      componentSpacing: 80,
    }).run();

    // Event Listeners
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const nodeId = node.id();

      onNodeSelect(node.data() as NodeData);

      // MINISTER EXPANSION: Show only 4 specific divisions
      if (nodeId === 'MINISTER-001') {
        const targetDivisions = ['DIV-EX-7', 'DIV-EX-11', 'DIV-EX-12', 'DIV-EX-10']; // Europe, CT, Audit, UN

        const divisionNodes = initialNodes.filter(n => targetDivisions.includes(n.data.id));
        const nodesToAdd = divisionNodes.filter(n => cy.getElementById(n.data.id).empty());

        if (nodesToAdd.length > 0) {
          const divisionNodeIds = nodesToAdd.map(n => n.data.id);
          const edgesToAdd = initialEdges.filter(e =>
            (divisionNodeIds.includes(e.data.source) || divisionNodeIds.includes(e.data.target)) &&
            (cy.getElementById(e.data.source).nonempty() || divisionNodeIds.includes(e.data.source)) &&
            (cy.getElementById(e.data.target).nonempty() || divisionNodeIds.includes(e.data.target))
          );

          cy.add([...nodesToAdd, ...edgesToAdd]);

          cy.layout({
            name: 'cose',
            animate: true,
            animationDuration: 600,
            fit: false,
            nodeRepulsion: 1200000,
            idealEdgeLength: 150,
            padding: 30
          }).run();
        }
        return; // Exit early to prevent division expansion logic from running
      }

      // DIVISION EXPANSION: Show personnel for clicked division
      // Mapping Division ID to Prefix/Type for expansion
      const expansionMap: Record<string, string> = {
        'DIV-EX-7': 'PER-EUR', // Europe
        'DIV-EX-11': 'PER-CT', // Counter Terrorism
        'DIV-EX-12': 'PER-AUD', // Audit
        'DIV-EX-10': 'PER-UN'   // United Nations
      };

      if (expansionMap[nodeId]) {
        const prefix = expansionMap[nodeId];

        // Find nodes in initialNodes that start with this prefix
        // AND are not already in the graph
        const childNodes = initialNodes.filter(n =>
          n.data.id.startsWith(prefix) ||
          (nodeId === 'DIV-EX-10' && n.data.id === 'PER-SADIA-IQBAL')
        );

        const nodesToAdd = childNodes.filter(n => cy.getElementById(n.data.id).empty());

        if (nodesToAdd.length > 0) {
          // Find edges connected to these new nodes
          const childNodeIds = nodesToAdd.map(n => n.data.id);
          const edgesToAdd = initialEdges.filter(e =>
            (childNodeIds.includes(e.data.source) || childNodeIds.includes(e.data.target)) &&
            // Ensure the other end of the edge is already in the graph or is also being added
            (cy.getElementById(e.data.source).nonempty() || childNodeIds.includes(e.data.source) || e.data.source === nodeId) &&
            (cy.getElementById(e.data.target).nonempty() || childNodeIds.includes(e.data.target) || e.data.target === nodeId)
          );

          cy.add([...nodesToAdd, ...edgesToAdd]);

          // Re-layout nicely
          cy.layout({
            name: 'cose',
            animate: true,
            animationDuration: 600,
            fit: false,
            nodeRepulsion: 1200000,
            idealEdgeLength: 100, // Shorter for children
            padding: 30
          }).run();
        }
      }
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        onNodeSelect(null as any);
      }
    });

    // Custom Event Listener for Expansion (Existing logic retained if needed for other parts)
    const handleExpandEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { nodeId } = customEvent.detail;
      const node = cy.getElementById(nodeId);

      if (node.nonempty()) {
        const { nodes, edges } = generateExpansion(nodeId);
        cy.add([...nodes, ...edges]);

        // Re-run layout on neighborhood
        const layout = cy.layout({
          name: 'cose',
          animate: true,
          animationDuration: 600,
          fit: false,
          nodeRepulsion: 1200000,
          idealEdgeLength: 140,
          padding: 30
        });
        layout.run();
      }
    };

    window.addEventListener('graph:expand', handleExpandEvent);

    return () => {
      cy.destroy();
      window.removeEventListener('graph:expand', handleExpandEvent);
    };
  }, [searchResults]); // Re-run when search results change

  return (
    <div ref={containerRef} className="w-full h-full tactical-grid-dense" />
  )
}

export default GraphView
