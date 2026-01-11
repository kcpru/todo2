import { useState } from "react";
import { motion } from "motion/react";
import { MdDelete, MdAdd } from "react-icons/md";
import { GradientButton } from "./GradientButton";
import { useRipple } from "../hooks/useRipple.jsx";

function ListItem({ list, isActive, onSelect, onDelete }) {
  const { createRipple, RippleContainer } = useRipple();

  const handleClick = (e) => {
    createRipple(e);
    onSelect(list.id);
  };

  return (
    <motion.button
      className={`list-item ${isActive ? "active" : ""}`}
      onClick={handleClick}
    >
      <span className="list-count-badge">{list.items?.length || 0}</span>
      <span className="list-name">{list.name}</span>
      <div className="list-actions">
        <GradientButton
          variant="danger"
          size="sm"
          iconOnly={true}
          className="list-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(list.id);
          }}
          title="Delete list"
        >
          <MdDelete />
        </GradientButton>
      </div>
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
  const {
    createRipple: createInputRipple,
    RippleContainer: InputRippleContainer,
  } = useRipple();

  const handleAddList = async () => {
    if (!newListName.trim()) return;
    await onAddList(newListName.trim());
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
                  onDelete={onDeleteList}
                />
              </div>
            ))}
          </div>
          <div className="new-list-input-row">
            <div className="input-with-ripple">
              <input
                type="text"
                className="new-list-input"
                placeholder="New list title"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddList()}
                onMouseDown={createInputRipple}
              />
              <InputRippleContainer />
            </div>
            <GradientButton
              size="sm"
              iconOnly={false}
              className="new-list-btn"
              onClick={handleAddList}
              disabled={!newListName.trim()}
              title={newListName.trim() ? "Create list" : "Type a name first"}
            >
              <MdAdd className="new-list-btn-icon" />
              <span>Create</span>
            </GradientButton>
          </div>
        </>
      )}
    </div>
  );
}
