import { useState } from "react";
import { motion } from "motion/react";
import { MdDelete } from "react-icons/md";
import { GradientButton } from "./GradientButton";
import { useRipple } from "../hooks/useRipple.jsx";

function ListItem({ list, isActive, onSelect }) {
  const { createRipple, RippleContainer } = useRipple();

  const handleClick = (e) => {
    createRipple(e);
    onSelect(list.id);
  };

  return (
    <motion.button
      className={`list-item ${isActive ? "active" : ""}`}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="list-name">{list.name}</span>
      <span className="list-count">{list.items?.length || 0}</span>
      <RippleContainer />
    </motion.button>
  );
}

export function ListSelector({
  lists,
  selectedListId,
  loadingLists,
  onSelectList,
  onDeleteList,
  onAddList,
}) {
  const [newListName, setNewListName] = useState("");

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    await onAddList(newListName);
    setNewListName("");
  };

  return (
    <div className="lists-section">
      <div className="lists-header">
        <h2 className="lists-title">My Lists</h2>
      </div>
      {loadingLists ? (
        <div className="loading-lists">Loading lists...</div>
      ) : (
        <>
          <div className="lists-container">
            {lists.map((list) => (
              <div key={list.id} className="list-item-container">
                <ListItem
                  list={list}
                  isActive={selectedListId === list.id}
                  onSelect={onSelectList}
                />
                <GradientButton
                  variant="danger"
                  size="sm"
                  iconOnly={true}
                  className="list-delete-btn"
                  onClick={() => onDeleteList(list.id)}
                  title="Delete list"
                >
                  <MdDelete />
                </GradientButton>
              </div>
            ))}
          </div>
          <div className="new-list-input-container">
            <input
              type="text"
              className="new-list-input"
              placeholder="Create new list..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddList()}
            />
            <GradientButton
              size="md"
              iconOnly={true}
              className="new-list-btn"
              onClick={handleAddList}
            >
              +
            </GradientButton>
          </div>
        </>
      )}
    </div>
  );
}
