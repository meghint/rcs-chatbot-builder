import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNodesStore } from "@/store/nodesStore";
import defaultFlowData from "@/data.json";
import { Download, Settings, Upload } from "lucide-react";
import { useRef, useState } from "react";

/**
 * ExportImportPanel component provides functionality to export, import and load sample chatbot flows
 * @component
 * @returns {JSX.Element} A card component with buttons for flow management actions
 */

const ExportImportPanel: React.FC = () => {
  const { nodes, connections, setNodes, addConnection, clearConnections } =
    useNodesStore((state) => state);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Exports the current chatbot flow configuration to a JSON file
   * @function
   * @returns {void}
   * @description Creates a JSON file containing the current nodes and connections,
   * then triggers a download in the browser
   */
  const handleExport = () => {
    setIsExporting(true);
    try {
      // Create a complete flow object with both nodes and connections
      const flowData = {
        nodes,
        connections,
      };

      const data = JSON.stringify(flowData, null, 2);
      const blob = new Blob([data], { type: "application/json" });

      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "chatbot-flow.json";
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsExporting(false);
      }, 500);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export flow. Please try again.");
      setIsExporting(false);
    }
  };

  /**
   * Triggers the file input click event to open the file selection dialog
   * @function
   * @returns {void}
   */
  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Handles the file selection event and imports the selected flow configuration
   * @function
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event
   * @returns {void}
   * @description Reads the selected JSON file, parses its content, and updates the flow
   * with the imported nodes and connections
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);

        // Clear existing data first
        clearConnections();

        // Import nodes
        if (importedData.nodes && Array.isArray(importedData.nodes)) {
          setNodes(importedData.nodes);
        } else {
          // Try to handle legacy format (just nodes array)
          if (Array.isArray(importedData)) {
            setNodes(importedData);
          } else {
            throw new Error("Invalid nodes data structure");
          }
        }

        // Import connections
        if (
          importedData.connections &&
          Array.isArray(importedData.connections)
        ) {
          // Add connections one by one to ensure they are properly registered
          importedData.connections.forEach((conn: any) => {
            addConnection(conn);
          });
        }

        setTimeout(() => {
          setIsImporting(false);
        }, 500);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Invalid file format. Please upload a valid JSON file.");
        setIsImporting(false);
      }
    };

    reader.onerror = () => {
      alert("Failed to read file. Please try again.");
      setIsImporting(false);
    };

    reader.readAsText(file);

    // Reset the input value so the same file can be selected again
    if (event.target) {
      event.target.value = "";
    }
  };

  /**
   * Loads a sample flow configuration from the default data
   * @function
   * @returns {void}
   * @description Clears the current flow and replaces it with the default sample flow
   * configuration from data.json
   */
  const handleLoadFlow = () => {
    setIsLoading(true);
    try {
      // Clear existing data first
      clearConnections();

      // Load nodes from default data
      if (defaultFlowData.nodes && Array.isArray(defaultFlowData.nodes)) {
        setNodes(defaultFlowData.nodes);
      }

      // Load connections from default data
      if (
        defaultFlowData.connections &&
        Array.isArray(defaultFlowData.connections)
      ) {
        // Add connections one by one
        defaultFlowData.connections.forEach((conn: any) => {
          addConnection(conn);
        });
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error loading default flow data:", error);
      alert("Failed to load sample flow. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="fixed right-6 top-6 w-64 border border-gray-300 shadow-md z-10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Flow Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button
          className="w-full"
          onClick={handleExport}
          disabled={
            isExporting ||
            isLoading ||
            (nodes.length === 0 && connections.length === 0)
          }
        >
          {isExporting ? (
            "Exporting..."
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Flow
            </>
          )}
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={handleImport}
          disabled={isImporting || isLoading}
        >
          {isImporting ? (
            "Importing..."
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Import Flow
            </>
          )}
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={handleLoadFlow}
          disabled={isExporting || isImporting || isLoading}
        >
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              <Settings className="h-4 w-4 mr-2" />
              Load Sample Flow
            </>
          )}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleFileChange}
        />
      </CardContent>
    </Card>
  );
};

export default ExportImportPanel;
