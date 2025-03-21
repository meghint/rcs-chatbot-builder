import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AddNodeProps } from "@/types";
import { useState } from "react";

export const AddNode: React.FC<AddNodeProps> = ({ onAdd }) => {
  const [selectedTab, setSelectedTab] = useState<string>("");

  /**
   * Component for adding new nodes to the chat flow
   * @component
   * @param {Object} props - Component props
   * @param {Function} props.onAdd - Callback function to handle adding new nodes
   * @returns {JSX.Element} AddNode component
   */
  const onAddNode = () => {
    switch (selectedTab) {
      case "Rich":
        onAdd("richCard");
        break;
      case "Carousel":
        onAdd("carousel");
        break;

      default:
        break;
    }
    setSelectedTab("");
  };
  return (
    <Card className="fixed bottom-0 p-0 z-50 left-1/2 gap-0 -translate-x-1/2 w-80 border border-gray-300 rounded-lg shadow-md">
      {/* Header */}
      <div
        className="bg-black text-white p-2 text-center rounded-t-lg font-medium cursor-pointer"
        onClick={onAddNode}
      >
        + Add to flow
      </div>

      {/* Tab Buttons */}
      <div className="flex justify-between border-b border-gray-200 p-2">
        {["Rich", "Carousel"].map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            className={`flex-1 text-sm ${
              selectedTab === tab && "bg-gray-200 font-medium"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
    </Card>
  );
};
