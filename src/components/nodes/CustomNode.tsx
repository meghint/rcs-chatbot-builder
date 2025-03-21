import CarouselCard from "@/components/nodes/CarouselCard";
import RichCard from "@/components/nodes/RichCard";
import { CarouselData, NodeData, RichCardData } from "@/types";
import type { Node, NodeProps } from "@xyflow/react";
import { FC } from "react";

type CustomNodeProps = Node<NodeData["data"]>;

/**
 * Props type for the CustomNode component representing node data
 * @typedef {Node<NodeData["data"]>} CustomNodeProps
 */

const CustomNode: FC<NodeProps<CustomNodeProps>> = ({ data, id }) => {
  return (
    <div>
      {data.type === "carousel" ? (
        <CarouselCard data={data.content as CarouselData} id={id} />
      ) : (
        <RichCard data={data.content as RichCardData} id={id} />
      )}
    </div>
  );
};

export default CustomNode;
