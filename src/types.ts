import type { XYPosition } from "@xyflow/react";

/** Available custom node types for the chatbot builder */
export type CustomNodeTypes = "carousel" | "richCard";

/** Interface representing a Call-To-Action option */
export interface CTAOption {
  /** The value/identifier of the CTA option */
  value: string;
  /** The display label for the CTA option */
  label: string;
}

/** Interface representing actions available for a card */
export interface CardActions {
  /** The value/identifier of the action */
  value: string;
}

/** Interface representing a single card item in a carousel or rich card */
export interface CardItem {
  /** The title of the card */
  title: string;
  /** The description text of the card */
  description: string;
  /** URL or path to the card's image */
  image: string;
  /** Array of actions available for this card */
  actions: CardActions[];
  /** Indicates if this card is currently selected */
  selected?: boolean;
}

/** Interface representing data structure for a carousel node */
export interface CarouselData {
  /** Array of card items to be displayed in the carousel */
  cards: CardItem[];
}

/** Interface representing data structure for a rich card node */
export interface RichCardData {
  /** The title of the rich card */
  title: string;
  /** The description text of the rich card */
  description: string;
  /** URL or path to the rich card's image */
  image: string;
  /** Array of actions available for this rich card */
  actions: CardActions[];
}

/** Type representing the data content of a node */
export type NodeDatum = {
  /** The type of the node (carousel or richCard) */
  type: CustomNodeTypes;
  /** The content data specific to the node type */
  content: CarouselData | RichCardData;
};

/** Interface for storing measured dimensions of a node */
interface Measured {
  /** The measured width of the node */
  width?: number;
  /** The measured height of the node */
  height?: number;
}

/** Type representing a complete node in the flow */
export type NodeData = {
  /** Unique identifier for the node */
  id: string;
  /** Position of the node in the flow canvas */
  position: XYPosition;
  /** Optional type identifier for the node */
  type?: string;
  /** The data content of the node */
  data: NodeDatum | Record<string, unknown>;
  /** Optional measured dimensions of the node */
  measured?: Measured;
  /** Indicates if the node is currently selected */
  selected?: boolean;
  /** Indicates if the node is currently being dragged */
  dragging?: boolean;
};

/** Interface for props passed to CarouselCard component */
export interface CarouselCardProps {
  /** The carousel data containing card items */
  data: CarouselData;
  /** Unique identifier for the carousel card */
  id: string;
}

/** Interface for props passed to AddNode component */
export interface AddNodeProps {
  /** Callback function triggered when adding a new node
   * @param type - The type of node to add
   */
  onAdd: (type: CustomNodeTypes) => void;
}

/** Interface for props passed to DeletePopover component */
export interface DeletePopoverProps {
  /** Title text to display in the delete popover */
  title: string;
  /** Callback function triggered when confirming deletion */
  onDelete: () => void;
}

/** Interface for props passed to RichCard component */
export interface RichCardProps {
  /** The rich card data containing card content */
  data: RichCardData;
  /** Unique identifier for the rich card */
  id: string;
}
