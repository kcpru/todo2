import { useState, useRef, useCallback } from "react";
import { useAuth } from "../AuthContext";
import { useDopamine } from "../DopamineContext";
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
  const checkboxPositionsRef = useRef({});

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

  const loadLists = useCallback(async () => {
    try {
      setLoadingLists(true);
      const data = await getLists();
      setLists(data || []);
      if (data && data.length > 0) {
        setSelectedListId((prevId) => prevId || data[0].id);
      }
    } catch (err) {
      console.error("Failed to load lists:", err);
    } finally {
      setLoadingLists(false);
    }
  }, [getLists]);

  const loadTasks = useCallback(async () => {
    try {
      setLoadingTodos(true);
      const tasksResponse = await getLists();
      setTodos((prevTodos) => {
        const list = tasksResponse.find((l) => l.id === selectedListId);
        return list?.items || prevTodos;
      });
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoadingTodos(false);
    }
  }, [getLists, selectedListId]);

  const handleAddList = useCallback(
    async (newListName) => {
      if (!newListName.trim()) return;
      try {
        const newList = await createList(newListName);
        setLists((prevLists) => [newList, ...prevLists]);
        setSelectedListId(newList.id);
      } catch (err) {
        console.error("Failed to create list:", err);
      }
    },
    [createList]
  );

  const handleDeleteList = useCallback(
    async (listId) => {
      try {
        await deleteList(listId);
        setLists((prevLists) => {
          const filtered = prevLists.filter((l) => l.id !== listId);
          setSelectedListId((prevId) => {
            if (prevId === listId) {
              const nextList = filtered.find((l) => l.id !== listId);
              return nextList?.id || null;
            }
            return prevId;
          });
          return filtered;
        });
      } catch (err) {
        console.error("Failed to delete list:", err);
      }
    },
    [deleteList]
  );

  // Register checkbox position
  const registerCheckboxPosition = (todoId, element) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      checkboxPositionsRef.current[todoId] = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }
  };

  const triggerConfetti = (todoId) => {
    if (!isDopamineMode) return;

    const origin = checkboxPositionsRef.current[todoId] || { x: 0.5, y: 0.5 };

    // Random confetti types
    const confettiTypes = [
      { shape: "square", color: "#4355b9" },
      { shape: "circle", color: "#5a6cc3" },
      { shape: "star", color: "#b8c3ff" },
    ];

    const randomType =
      confettiTypes[Math.floor(Math.random() * confettiTypes.length)];

    confetti({
      particleCount: 150,
      spread: 360,
      origin: origin,
      startVelocity: 17.5,
      gravity: 0.8,
      colors: [randomType.color, "#dde1ff", "#ffffff"],
      shapes: [randomType.shape, "circle"],
      scalar: 0.8,
      decay: 0.92,
    });

    // Secondary burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 360,
        origin: origin,
        startVelocity: 12.5,
        gravity: 0.8,
        colors: ["#4355b9", "#b8c3ff", "#dde1ff"],
        scalar: 0.6,
        decay: 0.95,
      });
    }, 150);
  };

  // School Pride confetti - full screen celebration when all tasks are completed
  const triggerSchoolPrideConfetti = () => {
    if (!isDopamineMode) return;

    const end = Date.now() + 2 * 1000;
    const colors = ["#bb0000", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const toggleTodo = async (id, checkboxElement) => {
    const todo = todos.find((t) => t.id === id);

    if (todo && !todo.isCompleted) {
      if (checkboxElement) {
        registerCheckboxPosition(id, checkboxElement);
      }
      triggerConfetti(id);
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
        const completedCount = updatedTodos.filter((t) => t.isCompleted).length;

        // Check if all tasks are completed
        if (completedCount === updatedTodos.length && updatedTodos.length > 0) {
          // Delay confetti slightly to celebrate
          setTimeout(() => {
            triggerSchoolPrideConfetti();
          }, 300);
        }
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
    registerCheckboxPosition,
  };
}
