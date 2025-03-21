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
import { Textarea } from "@/components/ui/textarea";
import { useNodesStore } from "@/store/nodesStore";
import { NodeData, CarouselCardProps } from "@/types";
import { Handle, Position } from "@xyflow/react";
import { GalleryHorizontal, Megaphone, Upload } from "lucide-react";
import { FC } from "react";
import { DeletePopover } from "../core/DeletePopover";

/**
 * A React component that renders a carousel of cards with customizable content and actions.
 * @param {CarouselCardProps} props - The component props
 * @param {NodeData} props.data - The data containing the cards information
 * @param {string} props.id - The unique identifier for the node
 */
const CarouselCard: FC<CarouselCardProps> = ({ data, id }) => {
  const { nodes, updateNode } = useNodesStore((state) => state);

  /**
   * Adds a new carousel card at the specified index position.
   * @param {number} currentIndex - The index after which to insert the new card
   */
  const addNewCarouselCard = (currentIndex: number) => {
    const selectedNode = nodes.find((node) => node.id === id);
    if (!selectedNode) return;

    const newCardItem = {
      title: "",
      description: "",
      image: "",
      actions: [],
    };
    const updatedCards = [
      ...data.cards.slice(0, currentIndex + 1),
      newCardItem,
      ...data.cards.slice(currentIndex + 1),
    ];
    const updatedNode: NodeData = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        content: {
          cards: updatedCards,
        },
      },
    };
    updateNode(updatedNode);
  };

  /**
   * Adds a new action to a specific card in the carousel.
   * @param {number} cardIndex - The index of the card to add the action to
   */
  const addActionToCard = (cardIndex: number) => {
    const selectedNode = nodes.find((node) => node.id === id);
    if (!selectedNode) return;

    const newNode: NodeData = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        content: {
          cards: data.cards.map((card, index) => {
            if (index === cardIndex) {
              return {
                ...card,
                actions: [
                  ...card.actions,
                  {
                    value: "",
                  },
                ],
              };
            }
            return card;
          }),
        },
      },
    };
    updateNode(newNode);
  };

  /**
   * Updates an action's value for a specific card and action index.
   * @param {number} cardIndex - The index of the card containing the action
   * @param {number} actionIndex - The index of the action to update
   * @param {string} value - The new value for the action
   */
  const updateAction = (
    cardIndex: number,
    actionIndex: number,
    value: string
  ) => {
    const selectedNode = nodes.find((node) => node.id === id);
    if (!selectedNode) return;

    const updatedNode: NodeData = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        content: {
          cards: data.cards.map((card, index) => {
            if (index === cardIndex) {
              const updatedActions = [...card.actions];
              updatedActions[actionIndex] = { value };
              return {
                ...card,
                actions: updatedActions,
              };
            }
            return card;
          }),
        },
      },
    };
    updateNode(updatedNode);
  };

  /**
   * Deletes a card from the carousel at the specified index.
   * @param {number} cardIndex - The index of the card to delete
   */
  const deleteCard = (cardIndex: number) => {
    const selectedNode = nodes.find((node) => node.id === id);
    if (!selectedNode) return;

    const updatedNode: NodeData = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        content: {
          cards: data.cards.filter((_, index) => index !== cardIndex),
        },
      },
    };
    updateNode(updatedNode);
  };

  /**
   * Deletes an action from a specific card.
   * @param {number} cardIndex - The index of the card containing the action
   * @param {number} actionIndex - The index of the action to delete
   */
  const deleteActions = (cardIndex: number, actionIndex: number) => {
    const selectedNode = nodes.find((node) => node.id === id);
    if (!selectedNode) return;

    const updatedNode: NodeData = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        content: {
          cards: data.cards.map((card, index) => {
            if (index === cardIndex) {
              return {
                ...card,
                actions: card.actions.filter((_, i) => i !== actionIndex),
              };
            }
            return card;
          }),
        },
      },
    };
    updateNode(updatedNode);
  };

  /**
   * Handles image upload for a specific card, converting the image to base64.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event
   * @param {number} cardIndex - The index of the card to upload the image to
   */
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    cardIndex: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const selectedNode = nodes.find((node) => node.id === id);
        if (!selectedNode) return;

        const updatedNode: NodeData = {
          ...selectedNode,
          data: {
            ...selectedNode.data,
            content: {
              cards: data.cards.map((card, idx) => {
                if (idx === cardIndex) {
                  return {
                    ...card,
                    image: reader.result as string,
                  };
                }
                return card;
              }),
            },
          },
        };
        updateNode(updatedNode);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Removes the image from a specific card.
   * @param {number} cardIndex - The index of the card to remove the image from
   */
  const handleImageDelete = (cardIndex: number) => {
    const selectedNode = nodes.find((node) => node.id === id);
    if (!selectedNode) return;

    const updatedNode: NodeData = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        content: {
          cards: data.cards.map((card, idx) => {
            if (idx === cardIndex) {
              return {
                ...card,
                image: "",
              };
            }
            return card;
          }),
        },
      },
    };
    updateNode(updatedNode);
  };

  return (
    <div className="flex space-x-4 overflow-x-auto p-4 items-start carousel-wrapper">
      {data.cards.map((item, index) => (
        <div
          className="relative shadow-md rounded-xl carousel-card"
          key={index}
        >
          <Card className="relative w-96 p-4 border border-gray-300 rounded-b-none">
            {/* ReactFlow Handles */}
            <Handle
              id={`source-${index}`}
              type="source"
              position={Position.Top}
              className="!w-4 !h-4 !bg-white rounded-full !border-black z-50"
            />
            <Handle
              id={`target-left-${index}`}
              type="target"
              position={Position.Right}
              className="!w-4 !h-4 bg-black rounded-full z-50"
            />
            <Handle
              id={`target-right-${index}`}
              type="target"
              position={Position.Left}
              className="!w-4 !h-4 bg-black rounded-full z-50"
            />

            {/* Header Section */}
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex items-center space-x-2">
                <GalleryHorizontal className="w-5 h-5" />
                <span className="font-semibold">Bot says</span>
              </div>
              <span className="text-gray-500 text-sm">
                {index + 1}/{data.cards.length}
              </span>
              <DeletePopover
                title="Delete this Card"
                onDelete={() => deleteCard(index)}
              />
            </CardHeader>

            <CardContent className="flex flex-col space-y-4">
              {/* Image Upload Placeholder */}
              <div className="relative w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
                {item.image ? (
                  <>
                    <img
                      src={item.image}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageDelete(index);
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
                      onChange={(e) => handleImageUpload(e, index)}
                    />
                  </label>
                )}
              </div>

              {/* Title Input */}
              <div className="text-left">
                <label className="font-semibold text-sm">Title</label>
                <Input
                  placeholder="Title your card here..."
                  value={item.title}
                  onChange={(e) => {
                    const selectedNode = nodes.find((node) => node.id === id);
                    if (!selectedNode) return;

                    const updatedNode: NodeData = {
                      ...selectedNode,
                      data: {
                        ...selectedNode.data,
                        content: {
                          cards: data.cards.map((card, idx) => {
                            if (idx === index) {
                              return {
                                ...card,
                                title: e.target.value,
                              };
                            }
                            return card;
                          }),
                        },
                      },
                    };
                    updateNode(updatedNode);
                  }}
                />
              </div>

              {/* Description Textarea */}
              <div className="text-left">
                <label className="font-semibold text-sm">Description</label>
                <Textarea
                  placeholder="Describe your card here..."
                  value={item.description}
                  onChange={(e) => {
                    const selectedNode = nodes.find((node) => node.id === id);
                    if (!selectedNode) return;

                    const updatedNode: NodeData = {
                      ...selectedNode,
                      data: {
                        ...selectedNode.data,
                        content: {
                          cards: data.cards.map((card, idx) => {
                            if (idx === index) {
                              return {
                                ...card,
                                description: e.target.value,
                              };
                            }
                            return card;
                          }),
                        },
                      },
                    };
                    updateNode(updatedNode);
                  }}
                />
              </div>
            </CardContent>

            {/* Add Card Button */}
            <Button
              variant="outline"
              className="absolute top-1/6 right-[-30px] transform -translate-y-1/2 rotate-90"
              onClick={() => addNewCarouselCard(index)}
            >
              + Card
            </Button>
          </Card>

          {/* Add Action Button */}
          <div className="pt-4 bg-white rounded-xl mt-[-20px] border border-dashed border-gray-300 ">
            {/* CTA Actions */}
            {(item.actions || []).map((cta, actionIndex) => (
              <div
                key={actionIndex}
                className="flex flex-col space-y-2 py-10 px-8 border-dashed border-b border-gray-300 relative"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Megaphone className="w-5 h-5" />
                    <span className="font-semibold text-sm">Action</span>
                  </div>
                  <DeletePopover
                    key={`popover-${actionIndex}`}
                    title="Delete this Action"
                    onDelete={() => deleteActions(index, actionIndex)}
                  />
                </div>
                <Select
                  value={cta.value}
                  onValueChange={(value) =>
                    updateAction(index, actionIndex, value)
                  }
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
                onClick={() => addActionToCard(index)}
              >
                + Add action
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarouselCard;
