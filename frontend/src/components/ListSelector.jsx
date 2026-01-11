import { useState } from "react";
import { motion } from "motion/react";
import { MdDelete } from "react-icons/md";

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
                <motion.button
                  className={`list-item ${
                    selectedListId === list.id ? "active" : ""
                  }`}
                  onClick={() => onSelectList(list.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="list-name">{list.name}</span>
                  <span className="list-count">{list.items?.length || 0}</span>
                </motion.button>
                <motion.button
                  className="list-delete-btn"
                  onClick={() => onDeleteList(list.id)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  title="Delete list"
                >
                  <MdDelete />
                </motion.button>
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
            <motion.button
              className="new-list-btn"
              onClick={handleAddList}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
            >
              +
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}
