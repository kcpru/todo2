import "./TodoListPreview.scss";

export function TodoListPreview({ todoListJson }) {
  let todoListData = null;
  let completedCount = 0;
  let totalCount = 0;

  if (todoListJson) {
    try {
      todoListData = JSON.parse(todoListJson);
      if (todoListData?.items) {
        totalCount = todoListData.items.length;
        completedCount = todoListData.items.filter(
          (item) => item.completed
        ).length;
      }
    } catch (e) {
      console.error("Failed to parse todo list:", e);
    }
  }

  if (!todoListData) return null;

  return (
    <div className="todo-list-preview">
      <div className="preview-title">{todoListData.name || "Todo List"}</div>
      <div className="preview-progress">
        <div className="progress-text">
          {completedCount}/{totalCount} completed
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
