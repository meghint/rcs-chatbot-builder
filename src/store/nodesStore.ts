/**
 * @fileoverview Node and connection state management store using Zustand.
 * Handles the state and operations for nodes and their connections in the flow editor.
 */

import { NodeData } from "@/types";
import { applyNodeChanges, type NodeChange, Edge } from "@xyflow/react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * Represents the data structure for a connection between nodes
 * @interface ConnectionData
 */
interface ConnectionData {
  /** Unique identifier for the connection */
  id: string;
  /** ID of the source node */
  sourceId: string;
  /** ID of the target node */
  targetId: string;
  /** Position coordinates of the source node */
  sourcePosition: { x: number; y: number };
  /** Position coordinates of the target node */
  targetPosition: { x: number; y: number };
  /** Edge data containing visual and behavioral properties */
  edgeData: Edge;
}

/**
 * State interface for managing nodes and their connections
 * @interface NodesState
 */
interface NodesState {
  /** Array of node data objects */
  nodes: NodeData[];
  /** Updates the entire nodes array */
  setNodes: (nodes: NodeData[]) => void;
  /** Updates a specific node's data */
  updateNode: (node: NodeData) => void;
  /** Adds a new node to the store */
  addNode: (node: NodeData) => void;
  /** Handles node changes from the flow editor */
  onNodesChange: (changes: NodeChange<NodeData>[]) => void;
  /** Removes a node by its ID */
  removeNode: (id: string) => void;

  /** Array of connection data objects */
  connections: ConnectionData[];
  /** Adds a new connection to the store */
  addConnection: (connection: ConnectionData) => void;
  /** Updates an existing connection's data */
  updateConnection: (connection: ConnectionData) => void;
  /** Removes a connection by its ID */
  removeConnection: (id: string) => void;
  /** Retrieves all connections associated with a specific node */
  getConnectionsByNodeId: (nodeId: string) => ConnectionData[];
  /** Removes all connections from the store */
  clearConnections: () => void;
}

/**
 * Custom Zustand store for managing nodes and their connections in the flow editor.
 * Implements persistence and dev tools for enhanced development experience.
 */
export const useNodesStore = create<NodesState>()(
  devtools(
    persist(
      (set, get) => ({
        // Node state and methods
        nodes: [],
        /**
         * Adds a new node to the store
         * @param node - The node data to add
         */
        addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
        /**
         * Handles node changes from the flow editor
         * @param changes - Array of node changes to apply
         */
        onNodesChange: (changes) =>
          set((state) => ({
            nodes: applyNodeChanges(changes, state.nodes),
          })),
        /**
         * Updates the entire nodes array
         * @param nodes - New array of nodes to set
         */
        setNodes: (nodes) => set({ nodes }),
        /**
         * Updates a specific node's data
         * @param node - Updated node data
         */
        updateNode: (node) =>
          set((state) => ({
            nodes: state.nodes.map((n) => (n.id === node.id ? node : n)),
          })),
        /**
         * Removes a node by its ID
         * @param id - ID of the node to remove
         */
        removeNode: (id) =>
          set((state) => ({ nodes: state.nodes.filter((n) => n.id !== id) })),

        // Connection state and methods
        connections: [],
        /**
         * Adds a new connection to the store
         * @param connection - The connection data to add
         */
        addConnection: (connection) =>
          set((state) => ({
            connections: [...state.connections, connection],
          })),
        /**
         * Updates an existing connection's data
         * @param connection - Updated connection data
         */
        updateConnection: (connection) =>
          set((state) => ({
            connections: state.connections.map((conn) =>
              conn.id === connection.id ? connection : conn
            ),
          })),
        /**
         * Removes a connection by its ID
         * @param id - ID of the connection to remove
         */
        removeConnection: (id) =>
          set((state) => ({
            connections: state.connections.filter((conn) => conn.id !== id),
          })),
        /**
         * Retrieves all connections associated with a specific node
         * @param nodeId - ID of the node to find connections for
         * @returns Array of connections where the node is either source or target
         */
        getConnectionsByNodeId: (nodeId) => {
          const { connections } = get();
          return connections.filter(
            (conn) => conn.sourceId === nodeId || conn.targetId === nodeId
          );
        },
        /**
         * Removes all connections from the store
         */
        clearConnections: () => set({ connections: [] }),
      }),
      {
        name: "rcs-storage",
        // Specify which parts of the state to persist
        partialize: (state) => ({
          nodes: state.nodes,
          connections: state.connections,
        }),
      }
    )
  )
);

/**
 * Creates a connection data object from source node, target node, and edge data
 * @param sourceNode - The source node of the connection
 * @param targetNode - The target node of the connection
 * @param edge - The edge data containing visual and behavioral properties
 * @returns A new ConnectionData object
 */
export const createConnectionData = (
  sourceNode: NodeData,
  targetNode: NodeData,
  edge: Edge
): ConnectionData => {
  return {
    id: edge.id,
    sourceId: sourceNode.id,
    targetId: targetNode.id,
    sourcePosition: sourceNode.position,
    targetPosition: targetNode.position,
    edgeData: edge,
  };
};
