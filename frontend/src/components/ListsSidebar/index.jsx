import { useState } from "react";
import { MdDelete, MdAdd } from "react-icons/md";
import { motion } from "motion/react";
import { GradientButton } from "../GradientButton";
import { ConfirmDialog } from "../ConfirmDialog";
import { CreateListModal } from "../CreateListModal";
import { useRipple } from "../../hooks/useRipple.jsx";
import "./ListsSidebar.scss";

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

export function ListsSidebar({
  lists,
  selectedListId,
  loadingLists,
  onSelectList,
  onDeleteList,
  onAddList,
}) {
  const [newListName, setNewListName] = useState("");
  const [confirmDeleteListId, setConfirmDeleteListId] = useState(null);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    await onAddList(newListName.trim());
    setNewListName("");
    setIsCreateListModalOpen(false);
  };

  return (
    <div className="lists-sidebar">
      <div className="lists-header">
        <h2 className="lists-title">My Lists</h2>
      </div>

      {loadingLists ? (
        <div className="loading-lists">Loading lists...</div>
      ) : lists.length === 0 ? (
        <div className="empty-state-lists">
          <div className="empty-icon">📝</div>
          <h3>No Lists Yet</h3>
          <p>Create your first list to get started</p>
        </div>
      ) : (
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
      )}

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

      <CreateListModal
        isOpen={isCreateListModalOpen}
        listName={newListName}
        onListNameChange={setNewListName}
        onSave={handleCreateList}
        onCancel={() => {
          setNewListName("");
          setIsCreateListModalOpen(false);
        }}
      />

      <GradientButton
        size="md"
        iconOnly={false}
        onClick={() => setIsCreateListModalOpen(true)}
        className="new-list-btn"
        icon={<MdAdd />}
      >
        New list
      </GradientButton>
    </div>
  );
}
