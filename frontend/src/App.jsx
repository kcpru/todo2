import { Route, Routes } from "react-router-dom";
import MyTodo from "./pages/MyTodo";
import Stats from "./pages/Stats";
import "./App.scss";

function App() {
  return (
    <Routes>
      <Route path="/my-todo" element={<MyTodo />} />
      <Route path="/stats" element={<Stats />} />
      {/* Add other routes here if needed */}
    </Routes>
  );
}

export default App;
