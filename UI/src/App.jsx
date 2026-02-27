import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/cadastro";
import Login from "./pages/login";
import ToDo from "./pages/tasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tarefas" element={<ToDo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
