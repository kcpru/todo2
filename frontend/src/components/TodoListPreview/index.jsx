import "./TodoListPreview.scss";

export function TodoListPreview({ todoListJson }) {
  let todoListData = null;
  let completedCount = 0;
  let totalCount = 0;

  if (todoListJson) {
    try {
      todoListData = JSON.parse(todoListJson);
        const items = todoListData?.items || todoListData?.Items || todoListData?.tasks || [];
        if (items.length > 0) {
          totalCount = items.length;
          completedCount = items.filter((item) => {
            // Check all possible property names for completion status
            return item.isCompleted || item.completed || item.done || item.finished;
          }).length;
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
