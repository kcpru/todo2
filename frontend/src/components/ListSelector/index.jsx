import { useState } from "react";

import { MdAdd, MdDelete } from "react-icons/md";
import { GradientButton } from "../GradientButton";
import { Input } from "../Input";
import { ConfirmDialog } from "../ConfirmDialog";
import { useRipple } from "../../hooks/useRipple.jsx";
import "./ListSelector.scss";

function ListItem({ list, isActive, onSelect, onDelete }) {
  const { createRipple, RippleContainer } = useRipple();

  const handleClick = (e) => {
    createRipple(e);
    onSelect(list.id);
  };

  return (
    <motion.button
      className={`list-item input-with-ripple ${isActive ? "active" : ""}`}
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
          icon={<MdDelete />}
        />
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
  const [confirmDeleteListId, setConfirmDeleteListId] = useState(null);

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
                  onDelete={() => setConfirmDeleteListId(list.id)}
                />
              </div>
            ))}
          </div>
          <ConfirmDialog
            isOpen={confirmDeleteListId !== null}
            title="Delete List"
            message="Are you sure you want to delete this list and all of its tasks? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={() => {
              if (confirmDeleteListId !== null) {
                onDeleteList(confirmDeleteListId);
              }
              setConfirmDeleteListId(null);
            }}
            onCancel={() => setConfirmDeleteListId(null)}
            confirmVariant="danger"
          />
          <div className="new-list-input-row">
            <Input
              withRipple
              type="text"
              className="new-list-input"
              placeholder="New list title"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddList()}
            />
            <GradientButton
              size="md"
              iconOnly={false}
              onClick={handleAddList}
              disabled={!newListName.trim()}
              title={newListName.trim() ? "Create list" : "Type a name first"}
              icon={<MdAdd />}
            >
              Create
            </GradientButton>
          </div>
        </>
      )}
    </div>
  );
}
