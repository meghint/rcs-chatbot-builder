import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNodesStore } from "@/store/nodesStore";
import { NodeData, RichCardData, RichCardProps } from "@/types";
import { Handle, Position } from "@xyflow/react";
import { Megaphone, PanelTop, Upload } from "lucide-react";
import { FC } from "react";
import { DeletePopover } from "../core/DeletePopover";

/**
 * RichCard Component
 *
 * A React component that renders a rich media card with customizable content:
 * - Image upload/display
 * - Title and description fields
 * - Multiple action buttons (link, button click, quick reply)
 *
 * Props:
 * - data: RichCardData - Contains card content (image, title, description, actions)
 * - id: string - Unique identifier for the card
 *
 * Uses ReactFlow handles for node connections:
 * - Top handle: Source connection
 * - Left/Right handles: Target connections
 * - Action handles: Individual target connections for each action
 */

const RichCard: FC<RichCardProps> = ({ data, id }) => {
  const { nodes, updateNode, removeNode } = useNodesStore((state) => state);

  /**
   * Adds a new action to the rich card node
   *
   * Finds the node with the given ID and adds a new empty action to its actions array.
   * Updates the node state with the new action.
   *
   * @returns void
   */
  const addAction = () => {
    const selectedNode = nodes.find((node) => node.id === id);
    if (!selectedNode) return;

    const updatedNode: NodeData = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        content: {
          ...data,
          actions: [...(data.actions || []), { value: "" }],
        },
      },
    };
    updateNode(updatedNode);
  };

  /**
   * Updates a field in the rich card node
   *
   * Finds the node with the given ID and updates the specified field with the new value.
   * Updates the node state with the modified field.
   *
   * @param field - The field to update in the rich card data
   * @param value - The new value to set for the field
   * @returns void
   */
  const updateField = (field: keyof RichCardData, value: string) => {
    const selectedNode = nodes.find((node) => node.id === id);
    if (!selectedNode) return;

    const updatedNode: NodeData = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        content: {
          ...data,
          [field]: value,
        },
      },
    };
    updateNode(updatedNode);
  };

  /**
   * Updates an action in the rich card node
   *
   * Finds the node with the given ID and updates the specified action at the given index.
   * Updates the node state with the modified action.
   *
   * @param index - The index of the action to update
   * @param value - The new value to set for the action
   * @returns void
   */
  const updateAction = (index: number, value: string) => {
    const selectedNode = nodes.find((node) => node.id === id);
    if (!selectedNode) return;

    const updatedActions = [...(data.actions || [])];
    updatedActions[index] = { value };

    const updatedNode: NodeData = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        content: {
          ...data,
          actions: updatedActions,
        },
      },
    };
    updateNode(updatedNode);
  };

  /**
   * Deletes a rich card node
   *
   * Finds the node with the given ID and removes it from the nodes store.
   *
   * @returns void
   */
  const deleteCard = () => {
    const selectedNode = nodes.find((node) => node.id === id);
    if (!selectedNode) return;
    removeNode(id);
  };

  /**
   * Updates the type of action for a rich card node
   *
   * Finds the node with the given ID and updates the action type at the specified index.
   * Updates the node state with the modified action type.
   *
   * @param index - The index of the action to update
   * @param type - The new action type to set (link, button, or reply)
   * @returns void
   */
  const deleteActions = (index: number) => {
    const selectedNode = nodes.find((node) => node.id === id);
    if (!selectedNode) return;

    const updatedNode: NodeData = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        content: {
          ...data,
          actions: data.actions?.filter((_, i) => i !== index),
        },
      },
    };
    updateNode(updatedNode);
  };

  /**
   * Updates the action type for a rich card node
   *
   * Finds the node with the given ID and updates the action type at the specified index.
   * Updates the node state with the modified action type.
   *
   * @param index - The index of the action to update
   * @param type - The new action type to set (link, button, or reply)
   * @returns void
   */
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Updates the action type for a rich card node
   *
   * Finds the node with the given ID and updates the action type at the specified index.
   * Updates the node state with the modified action type.
   *
   * @param index - The index of the action to update
   * @param type - The new action type to set (link, button, or reply)
   * @returns void
   */
  const handleImageDelete = () => {
    updateField("image", "");
  };

  return (
    <div className="shadow-md rounded-xl">
      <Card className="relative w-96 p-4 border border-gray-300 rounded-b-none">
        {/* ReactFlow Handles */}
        <Handle
          id={`rich-card-top-${id}`}
          type="source"
          position={Position.Top}
          className="!w-4 !h-4 !bg-white rounded-full !border-black"
        />
        <Handle
          id={`rich-card-bottom-${id}`}
          type="target"
          position={Position.Left}
          className="!w-4 !h-4 bg-black rounded-full"
        />
        <Handle
          id={`rich-card-right-${id}`}
          type="target"
          position={Position.Right}
          className="!w-4 !h-4 bg-black rounded-full"
        />

        {/* Header */}
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <PanelTop className="w-5 h-5" />
            <span className="font-semibold">Bot says</span>
          </div>
          <DeletePopover title="Delete this Card" onDelete={deleteCard} />
        </CardHeader>

        <CardContent className="flex flex-col space-y-4">
          {/* Image Upload Placeholder */}
          <div className="relative w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
            {data.image ? (
              <>
                <img
                  src={data.image}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageDelete();
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <label className="w-full h-full flex items-center justify-center cursor-pointer">
                <Upload className="w-8 h-8 text-gray-500" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <Separator />

          {/* Title Input */}
          <div className="text-left">
            <label className="font-semibold text-sm">Title</label>
            <Input
              placeholder="Title your card here..."
              value={data.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>

          {/* Description Textarea */}
          <div className="text-left">
            <label className="font-semibold text-sm">Description</label>
            <Textarea
              placeholder="Describe your card here..."
              value={data.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Action Button */}
      <div className="pt-4 bg-white rounded-xl mt-[-20px] border border-dashed border-gray-300">
        {/* CTA Actions */}
        {(data.actions || []).map((cta, index) => (
          <div
            key={index}
            className="flex flex-col space-y-2 py-10 px-8 border-dashed relative border-b border-gray-300 rich-card-action"
          >
            <div className="flex justify-between items-center ">
              <div className="flex items-center space-x-2">
                <Megaphone className="w-5 h-5" />
                <span className="font-semibold text-sm">Action</span>
              </div>
              <DeletePopover
                title="Delete this Action"
                onDelete={() => deleteActions(index)}
              />
            </div>
            <Select
              onValueChange={(value) => updateAction(index, value)}
              value={cta.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a type of CTA...." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="w-full" value="link">
                  Open Link
                </SelectItem>
                <SelectItem value="button">Button Click</SelectItem>
                <SelectItem value="reply">Quick Reply</SelectItem>
              </SelectContent>
            </Select>

            <Handle
              id={`action-left-${id}-${index}`}
              type="target"
              position={Position.Left}
              className="!w-4 !h-4 bg-black rounded-full action-handle"
            />
            <Handle
              id={`action-right-${id}-${index}`}
              type="target"
              position={Position.Right}
              className="!w-4 !h-4 bg-black rounded-full action-handle"
            />
          </div>
        ))}

        <div className="bg-gray-100">
          <Button
            variant="ghost"
            className="w-full text-gray-500 font-normal"
            onClick={addAction}
          >
            + Add action
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RichCard;
