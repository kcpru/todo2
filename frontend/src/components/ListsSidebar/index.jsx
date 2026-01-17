import { useState } from "react";
import {
  MdDelete,
  MdAdd,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdSearch,
} from "react-icons/md";
import { AnimatePresence } from "motion/react";
import { GradientButton } from "../GradientButton";
import { Input } from "../Input";
import { ConfirmDialog } from "../ConfirmDialog";
import { CreateListModal } from "../CreateListModal";
import { ActionMenu } from "../ActionMenu";
import { useRipple } from "../../hooks/useRipple.jsx";
import "./ListsSidebar.scss";

function ListItem({ list, isActive, onSelect, onDelete }) {
  const { createRipple, RippleContainer } = useRipple();
  const total = list.items?.length || 0;
  const completed = list.items?.filter((t) => t.isCompleted)?.length || 0;

  const handleClick = (e) => {
    createRipple(e);
    onSelect(list.id);
  };

  const getProgressText = () => {
    if (total === 0) {
      return "No tasks yet";
    }
    if (completed === total) {
      return "All done!";
    }
    if (total - completed === 1) {
      return "One more to go!";
    }
    return `${completed}/${total} done`;
  };

  return (
    <motion.button
      className={`list-item input-with-ripple ${isActive ? "active" : ""}`}
      onClick={handleClick}
    >
      <div className="list-main">
        <div className="list-texts">
          <span className="list-name">{list.name}</span>
          <div className="list-progress">
            <div className="progress-icon-container">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={
                    completed === total && total > 0
                      ? "completed"
                      : "incomplete"
                  }
                  className="progress-icon"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  {completed === total && total > 0 ? (
                    <MdCheckCircle />
                  ) : (
                    <MdRadioButtonUnchecked />
                  )}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="progress-label-container">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={getProgressText()}
                  className="progress-label"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  {getProgressText()}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="list-meta">
          <ActionMenu
            items={[
              {
                label: "Delete list",
                icon: <MdDelete />,
                variant: "danger",
                onClick: () => onDelete(list.id),
              },
            ]}
          />
        </div>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteListId, setConfirmDeleteListId] = useState(null);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);

  const filteredLists = lists.filter((list) =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    await onAddList(newListName.trim());
    setNewListName("");
    setIsCreateListModalOpen(false);
  };

  return (
    <div className="lists-sidebar">
      <div className="search-container">
        <Input
          type="text"
          placeholder="Search lists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          withRipple={true}
          containerClassName="search-input-wrapper"
        />
        <span className="search-icon">
          <MdSearch />
        </span>
      </div>

      {loadingLists ? (
        <div className="loading-lists">Loading lists...</div>
      ) : filteredLists.length === 0 ? (
        <div className="empty-state-lists">
          <div className="empty-icon">📝</div>
          <h3>{searchQuery ? "No lists found" : "No Lists Yet"}</h3>
          <p>
            {searchQuery
              ? "Try a different search"
              : "Create your first list to get started"}
          </p>
        </div>
      ) : (
        <div className="lists-container">
          {filteredLists.map((list) => (
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
        size="sm"
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
