import { AddNode } from "@/components/panels/AddNode";
import CustomNode from "@/components/nodes/CustomNode";
import ExportImportPanel from "@/components/panels/ExportImportPanel";
import { createConnectionData, useNodesStore } from "@/store/nodesStore";
import { CustomNodeTypes } from "@/types";

import type {
  Connection,
  Edge,
  Node,
  NodeTypes,
  SnapGrid,
} from "@xyflow/react";
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useCallback, useEffect } from "react";

const nodeTypes: NodeTypes = { customNode: CustomNode };

const snapGrid: SnapGrid = [20, 20];
const defaultViewport = { x: 0, y: 0, zoom: 1 };

/**
 * ChatbotBuilder component for creating and managing a flow-based chatbot interface.
 * Integrates with ReactFlow for node-based visual programming.
 */
const ChatbotBuilder: React.FC = () => {
  const {
    nodes: nodesInStore,
    addNode: addNodeToStore,
    onNodesChange,
    addConnection,
    connections,
  } = useNodesStore((state) => state);
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  /**
   * Handles the creation of new edges between nodes in the flow.
   * @param params - Connection parameters from ReactFlow
   */
  const onConnect = useCallback(
    (params: Connection) => {
      console.log("Edge created: ", params);

      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        sourceHandle: params.sourceHandle || null,
        targetHandle: params.targetHandle || null,
      };

      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      if (sourceNode && targetNode) {
        // Add the connection to the store
        addConnection(
          createConnectionData(sourceNode, targetNode, newEdge as Edge)
        );
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, nodes, addConnection]
  );

  /**
   * Creates a new node of the specified type with default content.
   * @param type - The type of node to create (carousel, richCard, etc.)
   */
  const onAdd = useCallback(
    (type: CustomNodeTypes) => {
      const newNodeContent =
        type === "carousel"
          ? {
              cards: [
                {
                  title: "",
                  description: "",
                  image: "",
                  actions: [],
                },
              ],
            }
          : type === "richCard"
            ? {
                title: "",
                description: "",
                image: "",
                actions: [],
              }
            : {
                title: "",
                description: "",
                image: "",
                actions: [],
              };
      const newNode = {
        id: Date.now().toString(),
        type: "customNode",
        position: { x: 0, y: 0 },
        data: {
          type: type,
          content: newNodeContent,
        },
      };
      addNodeToStore(newNode);
    },
    [addNodeToStore, nodes.length]
  );

  useEffect(() => {
    // Only run this if nodes are already loaded and connections exist in the store
    if (nodes.length > 0 && connections && connections.length > 0) {
      // Convert connections to edges for React Flow
      const loadedEdges = connections.map((conn) => {
        return {
          id: conn.id,
          source: conn.sourceId,
          target: conn.targetId,
          sourceHandle: conn.edgeData.sourceHandle || null,
          targetHandle: conn.edgeData.targetHandle || null,
          // Include any other edge properties you need
          type: conn.edgeData.type,
          animated: conn.edgeData.animated,
          style: conn.edgeData.style,
          data: conn.edgeData.data,
        };
      });

      // Set the edges in the React Flow state
      setEdges(loadedEdges);
      console.log("Loaded connections from store:", connections.length);
    }
  }, [nodes, connections, setEdges]);

  useEffect(() => {
    setNodes(nodesInStore as unknown as Node[]);
  }, [nodesInStore, setNodes]);

  useEffect(() => {
    localStorage.setItem("flowData", JSON.stringify(nodes));
  }, [nodes]);

  return (
    <div className="w-full">
      <main
        role="main"
        className="w-full flex flex-col h-screen content-center justify-center"
      >
        <ReactFlow
          snapGrid={snapGrid}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultViewport={defaultViewport}
          snapToGrid={true}
          fitView
          style={{ width: "100%", height: "600px" }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <MiniMap />
          <AddNode onAdd={onAdd} />
          <ExportImportPanel />
          <Controls />
          <Background />
        </ReactFlow>
      </main>
    </div>
  );
};

export default ChatbotBuilder;
