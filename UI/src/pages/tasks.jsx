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
        menuOpen
    } = useToDo();

    return (
        <div>
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
                                    className="flex justify-between items-center bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md hover:border-blue-400 transition-colors"
                                >
                                    <p className={`font-semibold flex-1 ${tarefa.concluida ? "line-through text-gray-400" : "text-gray-700"}`}>
                                        {tarefa.titulo}
                                    </p>
                                    
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
                    <div>
                        <input 
                            ref={tituloRef} 
                            type="text" 
                            placeholder="O que precisa ser feito?" 
                            onChange={() => setTaskError("")} 
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none transition-colors ${
                                taskError ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
                            }`} 
                        />
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
                    </div>

                    <button 
                        type="button" 
                        onClick={SubmitTask} 
                        disabled={isSubmitting}
                        className={`cursor-pointer w-full text-white py-2 px-4 rounded-md transition-all ${
                            isSubmitting ? "bg-blue-300 cursor-wait" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {isSubmitting ? "Adicionando..." : "Adicionar Tarefa"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ToDo