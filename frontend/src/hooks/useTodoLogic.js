import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useDopamine } from "../DopamineContext";
import { useCoinsSystem } from "./useCoinsSystem";
import confetti from "canvas-confetti";

export function useTodoLogic() {
  const {
    getLists,
    createList,
    deleteList,
    createTask,
    updateTask,
    patchTask,
    deleteTask,
  } = useAuth();
  const { isDopamineMode } = useDopamine();
  const { onTaskComplete, updateCompletedCount } = useCoinsSystem();

  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingTodos, setLoadingTodos] = useState(false);

  const loadLists = async () => {
    try {
      setLoadingLists(true);
      const data = await getLists();
      setLists(data || []);
      if (data && data.length > 0 && !selectedListId) {
        setSelectedListId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load lists:", err);
    } finally {
      setLoadingLists(false);
    }
  };

  const loadTasks = async () => {
    try {
      setLoadingTodos(true);
      const tasksResponse = await getLists();
      const list = tasksResponse.find((l) => l.id === selectedListId);
      setTodos(list?.items || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoadingTodos(false);
    }
  };

  const handleAddList = async (newListName) => {
    if (!newListName.trim()) return;
    try {
      const newList = await createList(newListName);
      setLists([newList, ...lists]);
      setSelectedListId(newList.id);
    } catch (err) {
      console.error("Failed to create list:", err);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await deleteList(listId);
      setLists(lists.filter((l) => l.id !== listId));
      if (selectedListId === listId) {
        const nextList = lists.find((l) => l.id !== listId);
        setSelectedListId(nextList?.id || null);
      }
    } catch (err) {
      console.error("Failed to delete list:", err);
    }
  };

  const triggerConfetti = () => {
    if (!isDopamineMode) return;

    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    setTimeout(
      () =>
        fire(0.2, {
          spread: 60,
        }),
      50
    );

    setTimeout(
      () =>
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
        }),
      100
    );

    setTimeout(
      () =>
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
        }),
      150
    );

    setTimeout(
      () =>
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        }),
      200
    );
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);

    if (todo && !todo.isCompleted) {
      triggerConfetti();
    }

    try {
      await patchTask(id, !todo.isCompleted);
      const updatedTodos = todos.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      );
      setTodos(updatedTodos);
      setLists(
        lists.map((list) =>
          list.id === selectedListId ? { ...list, items: updatedTodos } : list
        )
      );

      // Earn coins when task is completed
      if (todo && !todo.isCompleted && isDopamineMode) {
        await onTaskComplete(10);
        const completedCount = updatedTodos.filter((t) => t.isCompleted).length;
        updateCompletedCount(completedCount);
      }
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteTask(id);
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
      setLists(
        lists.map((list) =>
          list.id === selectedListId ? { ...list, items: updatedTodos } : list
        )
      );
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const addTodo = () => {
    if (!selectedListId) return;
    setEditingId("new");
    setEditingText("New task");
    setEditingDescription("");
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
    setEditingDescription(todo.description || "");
  };

  const saveEdit = async () => {
    if (!editingText.trim()) return;

    try {
      if (editingId === "new") {
        const newTask = await createTask(
          selectedListId,
          editingText,
          editingDescription
        );
        const updatedTodos = [...todos, newTask];
        setTodos(updatedTodos);
        setLists(
          lists.map((list) =>
            list.id === selectedListId ? { ...list, items: updatedTodos } : list
          )
        );
      } else {
        const updatedTask = await updateTask(
          editingId,
          editingText,
          editingDescription,
          todos.find((t) => t.id === editingId)?.isCompleted || false
        );
        const updatedTodos = todos.map((todo) =>
          todo.id === editingId ? updatedTask : todo
        );
        setTodos(updatedTodos);
        setLists(
          lists.map((list) =>
            list.id === selectedListId ? { ...list, items: updatedTodos } : list
          )
        );
      }
      setEditingId(null);
      setEditingText("");
      setEditingDescription("");
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditingDescription("");
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (filter === "ALL") return matchesSearch;
    if (filter === "ACTIVE") return !todo.isCompleted && matchesSearch;
    if (filter === "COMPLETED") return todo.isCompleted && matchesSearch;
    return matchesSearch;
  });

  return {
    lists,
    setLists,
    selectedListId,
    setSelectedListId,
    todos,
    setTodos,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    editingId,
    setEditingId,
    editingText,
    setEditingText,
    editingDescription,
    setEditingDescription,
    loadingLists,
    loadingTodos,
    loadLists,
    loadTasks,
    handleAddList,
    handleDeleteList,
    toggleTodo,
    deleteTodo,
    addTodo,
    startEdit,
    saveEdit,
    cancelEdit,
    filteredTodos,
  };
}
