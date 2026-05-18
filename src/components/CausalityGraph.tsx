import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CausalityNode, Connection } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CausalityGraphProps {
  nodes: CausalityNode[];
  connections: Connection[];
  onNodeClick: (node: CausalityNode) => void;
  selectedNodeId: string | null;
  zoom?: number;
}

export function CausalityGraph({ nodes, connections, onNodeClick, selectedNodeId, zoom = 1 }: CausalityGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Define arrow marker for links
    svg.append("defs").selectAll("marker")
      .data([{ id: 'arrowhead', color: 'rgba(77, 224, 130, 0.5)' }])
      .enter().append("marker")
      .attr("id", d => d.id)
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("refX", 30)
      .attr("refY", 3)
      .attr("orient", "auto")
      .append("polygon")
      .attr("points", "0 0, 10 3, 0 6")
      .attr("fill", d => d.color);

    // Simulation setup
    const simulation = d3.forceSimulation<CausalityNode & d3.SimulationNodeDatum>(nodes as any)
      .force("link", d3.forceLink<CausalityNode & d3.SimulationNodeDatum, any>(connections)
        .id((d: any) => d.id)
        .distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Draw links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(connections)
      .enter().append("line")
      .attr("stroke", (d) => {
        if (d.type === 'strong') return 'rgba(77, 224, 130, 0.4)';
        if (d.type === 'weak') return 'rgba(206, 189, 255, 0.3)';
        return 'rgba(255, 180, 171, 0.35)'; // divergent
      })
      .attr("stroke-width", (d) => d.type === 'strong' ? 2.5 : d.type === 'weak' ? 1.5 : 2)
      .attr("stroke-dasharray", (d) => d.type === 'divergent' ? "4 4" : "0")
      .attr("marker-end", "url(#arrowhead)");

    // Draw nodes
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .attr("class", "cursor-pointer")
      .on("click", (event, d) => onNodeClick(d as CausalityNode))
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Node circles
    node.append("circle")
      .attr("r", (d) => d.id === selectedNodeId ? 22 : 18)
      .attr("fill", (d) => {
        if (d.type === 'catalyst') return '#c0c1ff';
        if (d.type === 'positive') return '#4de082';
        if (d.type === 'negative') return '#ffb4ab';
        return '#cebdff';
      })
      .attr("stroke", "rgba(255,255,255,0.2)")
      .attr("stroke-width", 2)
      .attr("filter", "drop-shadow(0 0 8px rgba(0,0,0,0.5))");

    // Animated pulse for selected or catalyst
    node.filter(d => d.type === 'catalyst' || d.id === selectedNodeId)
      .append("circle")
      .attr("r", 18)
      .attr("fill", "none")
      .attr("stroke", (d) => d.type === 'catalyst' ? '#c0c1ff' : '#4de082')
      .attr("stroke-width", 2)
      .append("animate")
      .attr("attributeName", "r")
      .attr("values", "18;28;18")
      .attr("dur", "2s")
      .attr("repeatCount", "indefinite");

    // Node labels
    const labels = node.append("foreignObject")
      .attr("width", 120)
      .attr("height", 60)
      .attr("x", -60)
      .attr("y", 25)
      .append("xhtml:div")
      .attr("class", "text-center pointer-events-none");

    labels.append("div")
      .attr("class", "text-[10px] uppercase font-bold text-on-surface-variant opacity-60")
      .text((d: any) => d.date);

    labels.append("div")
      .attr("class", "text-xs font-bold text-white leading-tight")
      .text((d: any) => d.title);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Zoom handling
    const zoom_behavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom_behavior);

    // Apply programmatic zoom
    svg.transition()
      .duration(300)
      .call(zoom_behavior.transform as any, d3.zoomIdentity.translate(0, 0).scale(zoom));

    return () => {
      simulation.stop();
    };
  }, [nodes, connections, selectedNodeId, onNodeClick, zoom]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-surface-container-lowest/20 rounded-2xl border border-white/5">
      <div className="absolute inset-0 star-field opacity-10 pointer-events-none" />
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
