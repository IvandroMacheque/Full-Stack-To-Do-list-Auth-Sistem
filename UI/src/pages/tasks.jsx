/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion'
import { useToDo } from "../Hooks/useToDo"

function ToDo() {
    const {
        allTasks,
        tituloRef,
        taskError,
        isSubmitting,
        setTaskError,
        SubmitTask,
        updateTask,
        deleteTask,
        handleLogout,
        handleDeleteAccount,
        setMenuOpen,
        user,
        menuOpen,
        dataInicioRef,
        dataTerminoRef,
        getStatus,
        filtrarTarefas,
        filtroAtivo,
        categoriaRef,
        corRef,
        adicionarCategoria,
        allCategorias,
        categoryError,
        isSubmittingCategory,
        setCategoryError,
        categoriaEscolhida,
        setCategoriaEscolhida,
        filtrarPorCategoria,
        filtroCategoriaAtivo,
        deleteCategoria
    } = useToDo();

    return (
        <div className="flex min-h-screen bg-gray-50"> 
            <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-8 hidden md:flex">
                <h1 className="text-xl font-bold text-blue-600">Meu App</h1>

                {/* Seção de Filtros */}
                <nav>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Filtros</p>
                    <div className="flex flex-col gap-1">
                        <button 
                            onClick={() => filtrarTarefas('todos')}
                            className={`cursor-pointer text-left px-3 py-2 rounded-md text-sm ${
                                filtroAtivo === 'todos' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            📂 Todas
                        </button>
                        <button 
                            onClick={() => filtrarTarefas("pendentes")}
                            className={`cursor-pointer text-left px-3 py-2 rounded-md text-sm ${
                                filtroAtivo === 'pendentes' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            ⏳ Pendentes
                        </button>
                        <button 
                            onClick={() => filtrarTarefas("concluidas")}
                            className={`cursor-pointer text-left px-3 py-2 rounded-md text-sm ${
                                filtroAtivo === 'concluidas' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            ✅ Concluídas
                        </button>
                    </div>
                </nav>
                <nav>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Categorias</p>
                    <div className="flex flex-col gap-1">
                        <ul>
                            {allCategorias && allCategorias.length > 0 ? (
                                allCategorias.map((categoria) => (
                                    <li 
                                    key={categoria.id}>
                                        <div className='flex'>
                                            <button onClick={() => filtrarPorCategoria(categoria.id)}
                                            className={`cursor-pointer text-left w-full px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2 ${
                                                filtroCategoriaAtivo === categoria.id ? 'bg-blue-50 text-blue-600 font-bold' : ''
                                            }`}>
                                                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: categoria.cor }}></span>
                                                <span className="truncate">{categoria.nome}</span>
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => deleteCategoria(categoria.id)} 
                                                className="cursor-pointer w-8 h-8 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all" 
                                                title="Excluir categoria"
                                            > 
                                                🗑️
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm px-3 py-2">Sem categorias</p>
                            )}
                        </ul>
                    </div>
                    <div className='flex'>
                        <input 
                            ref={categoriaRef}
                            type="text" 
                            placeholder="Adicionar categoria" 
                            onChange={(e) => setCategoryError("")}
                            className={`mt-3 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 ${
                                categoryError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
                        />
                        <input 
                            ref={corRef}
                            type="color" 
                            className="mt-3 rounded-md cursor-pointer ml-2 h-10 w-10"
                            title="Escolha a cor da categoria"
                        />
                    </div>
                    <AnimatePresence>
                                {categoryError && (
                                    <motion.p 
                                        initial={{ height: 0, opacity: 0 }} 
                                        animate={{ height: 'auto', opacity: 1 }} 
                                        exit={{ height: 0, opacity: 0 }} 
                                        className="text-red-500 text-xs mt-1 ml-1 overflow-hidden"
                                    >
                                        {categoryError}
                                    </motion.p>
                                )}
                        </AnimatePresence>
                    <button 
                        onClick={adicionarCategoria}
                        className="cursor-pointer w-full mt-3 bg-blue-500 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-600 transition-all">
                        Add
                    </button>
                </nav>
            </aside>
            <main className="flex-1 overflow-y-auto p-8">
                <div className="relative flex justify-end p-4 max-w-8xl mx-auto">
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="cursor-pointer w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold uppercase hover:bg-blue-700 transition-all shadow-md"
                    >
                        {user.nome.charAt(0)}
                    </button>

                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-16 right-4 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4"
                            >
                                <div>
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome)}&background=random&color=fff&size=128`} 
                                        alt="Avatar do usuário" 
                                        className="w-16 h-16 rounded-full mb-3 object-cover border-2 border-gray-300 mx-auto"
                                    />
                                </div>
                                <div className="border-b pb-5 mb-3">
                                    <p className="font-bold text-gray-800 text-center">{user.nome}</p>
                                    <p className="text-sm text-gray-500 truncate text-center">{user.email}</p>
                                </div>

                                <div className="flex justify-between items-center w-full px-3 py-2">
                                    <button 
                                        onClick={handleLogout}
                                        className="cursor-pointer flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 font-medium transition mt-1"
                                    >
                                        Sair
                                    </button>
                                    
                                    <button 
                                        onClick={handleDeleteAccount}
                                        className="cursor-pointer flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium transition mt-1"
                                    >
                                        Excluir conta
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="mx-auto mt-3 bg-white p-8 border border-gray-300 rounded-md shadow-lg max-w-5xl gap-5">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Tarefas</h2>
                    
                    <ul className="space-y-2 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {allTasks && allTasks.length > 0 ? (
                                allTasks.map((tarefa) => (
                                    <motion.li 
                                        key={tarefa.id} 
                                        initial={{ opacity: 0, x: -20 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0, x: 50 }} 
                                        layout
                                        transition={{ duration: 0.3 }} 
                                        className="flex justify-between items-center bg-white w-full px-4 py-3 border border-gray-200 border-l-4 rounded-r-md shadow-sm hover:shadow-md transition-all"
                                        style={{ borderLeftColor: tarefa.category ? tarefa.category.cor : '#d1d5db' }}
                                    >
                                        <div>
                                            <p className={`font-semibold flex-1 ${tarefa.concluida ? "line-through text-gray-400" : "text-gray-700"}`}>
                                                {tarefa.titulo}
                                            </p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatus(tarefa).color}`}>
                                                {getStatus(tarefa).label}
                                            </span>
                                            {tarefa.dataTermino && (
                                                <span className="text-[10px] text-gray-700 flex items-center gap-1">
                                                    <span className="opacity-70">⌛</span> 
                                                    {new Date(tarefa.dataTermino).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        
                                        
                                        <div className="flex items-center gap-2">
                                            <button 
                                                type="button" 
                                                onClick={() => updateTask(tarefa.id, !tarefa.concluida)} 
                                                className={`cursor-pointer w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                                                    tarefa.concluida ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-400 hover:border-green-500"
                                                }`} 
                                                title={tarefa.concluida ? "Desmarcar" : "Marcar"}
                                            >
                                                {tarefa.concluida ? "✓" : ""}
                                            </button>
                                            
                                            <button 
                                                type="button" 
                                                onClick={() => deleteTask(tarefa.id)} 
                                                className="cursor-pointer w-8 h-8 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all" 
                                                title="Excluir tarefa"
                                            > 
                                                🗑️
                                            </button>
                                        </div>
                                    </motion.li>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">Sem tarefas ainda</p>
                            )}
                        </AnimatePresence>
                    </ul>

                    <form className="flex flex-col gap-5 mt-5 border-t pt-5">
                        <div className='flex'>
                            <input 
                                ref={tituloRef} 
                                type="text" 
                                placeholder="O que precisa ser feito?" 
                                onChange={() => setTaskError("")} 
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none transition-colors ${
                                    taskError ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
                                }`} 
                            />
                            <select 
                                className="cursor-pointer ml-2 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                                value={categoriaEscolhida}
                                onChange={(e) => {
                                    setCategoriaEscolhida(e.target.value);
                                    setCategoryError("");
                                }}
                            >
                                <option value="">Sem categoria</option>
                                {allCategorias && allCategorias.length > 0 && allCategorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nome}
                                    </option>
                                ))}
                            </select>
                            <button 
                                type="button" 
                                onClick={SubmitTask} 
                                disabled={isSubmitting}
                                className={`cursor-pointer text-white py-2 px-4 rounded-md transition-all ml-2 ${
                                    isSubmitting ? "bg-blue-300 cursor-wait" : "bg-blue-500 hover:bg-blue-600"
                                }`}
                            >
                                Add
                            </button>
                        </div>
                            <AnimatePresence>
                                {taskError && (
                                    <motion.p 
                                        initial={{ height: 0, opacity: 0 }} 
                                        animate={{ height: 'auto', opacity: 1 }} 
                                        exit={{ height: 0, opacity: 0 }} 
                                        className="text-red-500 text-xs mt-1 ml-1 overflow-hidden"
                                    >
                                        {taskError}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500">Início</label>
                                <input ref={dataInicioRef} type="date" className="cursor-pointer w-full border p-1 rounded text-sm" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500">Término</label>
                                <input ref={dataTerminoRef} type="date" className="cursor-pointer w-full border p-1 rounded text-sm" />
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default ToDo