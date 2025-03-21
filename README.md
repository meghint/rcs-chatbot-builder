# ReactFlow Card Builder

A React application for creating and managing connected card components using ReactFlow, featuring Carousel Cards and Rich Cards built with shadcn UI components.

## Project Overview

This project implements a visual card builder interface where users can create, connect, and manage two types of cards:

- **Carousel Card**: A dynamic card component that can display multiple items in a carousel format
- **Rich Card**: A versatile card component for displaying detailed content

## Key Features

- Custom ReactFlow nodes for Carousel and Rich Cards
- Modern UI components powered by shadcn UI
- Dynamic data handling through JSON configuration
- Interactive node connections and flow management
- Automatic state persistence using local storage
- Responsive and user-friendly interface

## Technical Stack

- React + TypeScript
- Vite (Build tool)
- ReactFlow (Node-based UI)
- shadcn UI (Component library)
- Local Storage (State persistence)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Implementation Details

### Components

#### Carousel Card Node

- Implements a swipeable card interface
- Supports multiple content items
- Configurable through JSON data

#### Rich Card Node

- Displays detailed content with various layouts
- Supports rich text and media content
- Customizable styling options

### Data Management

- Card data is stored in a structured JSON format
- Real-time flow state synchronization
- Automatic saving to prevent data loss

### Flow Management

- Drag-and-drop node creation
- Interactive node connections
- Custom connection validation
- State persistence in local storage

## Development Guidelines

- Follow TypeScript type definitions
- Maintain component modularity
- Implement proper error handling
- Write clean, documented code
- Follow shadcn UI design patterns

## Evaluation Metrics

- Component integration quality
- Data flow implementation
- UI/UX consistency
- Code organization and clarity
- Performance optimization
