import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import ToDo from "./pages/ListaToDo";

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
