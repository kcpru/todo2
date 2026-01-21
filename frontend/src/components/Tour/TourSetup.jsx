import { TourProvider, useTour } from "@reactour/tour";

// Przykładowy komponent do testowania integracji
export function TourExampleButton() {
  const { setIsOpen } = useTour();
  return (
    <button onClick={() => setIsOpen(true)} style={{ margin: 16 }}>
      Start Tour
    </button>
  );
}

// Tour steps for the todo page (in English)
export const todoTourSteps = [
  {
    selector: ".lists-sidebar",
    content:
      "Here you can manage your task lists. Select an existing list or create a new one.",
  },
  {
    selector: ".new-list-btn",
    content: "Click here to create a new list.",
  },
  {
    selector: ".todo-list",
    content:
      "This is your list of tasks. You can mark tasks as done, edit, or delete them.",
  },
  {
    selector: ".add-btn",
    content: "Click to add a new task to the selected list.",
  },
  {
    selector: ".checkbox-wrapper",
    content: "Check this box to mark a task as completed.",
  },
  {
    selector: ".todo-actions",
    content: "Open the action menu to edit or delete a task.",
  },
  {
    selector: ".share-btn",
    content: "Share your list to the board.",
  },
  {
    selector: ".controls",
    content: "Search and filter your tasks by status.",
  },
  // Add a step for home navigation if needed
];

// Provider do opakowania aplikacji (np. w App.jsx)
export function TourProviderWrapper({ children, steps = todoTourSteps }) {
  return <TourProvider steps={steps}>{children}</TourProvider>;
}
