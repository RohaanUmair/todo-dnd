'use client';
import React, { FormEvent, useState } from 'react'
import ColumnContainer from './ColumnContainer';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners, rectIntersection, closestCenter, pointerWithin } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import Task from './Task';
import toast, { Toaster } from 'react-hot-toast';
import { BiPlus, BiPlusCircle } from 'react-icons/bi';


interface Column {
    title: string;
    id: number;
}

interface Task {
    id: number;
    colId: number;
    text: string;
}

function Board() {
    const [cols, setCols] = useState<Column[]>([{ title: 'To Do', id: 1 }, { title: 'In Progress', id: 2 }, { title: 'Done', id: 3 }]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeCol, setActiveCol] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    );


    const onDragStart = (e: DragStartEvent) => {
        if (e.active.data.current?.type === 'Column') {
            setActiveCol(e.active.data.current.column);
        }

        if (e.active.data.current?.type === 'Task') {
            setActiveTask(e.active.data.current.task);
        }
    }

    const onDragEnd = (e: DragEndEvent) => {
        setActiveCol(null);
        setActiveTask(null);

        const { active, over } = e;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (active.data.current?.type === 'Column') {
            if (activeId === overId) return;

            setCols((cols) => {
                const activeColIndex = cols.findIndex((col) => col.id === activeId);
                const overColIndex = cols.findIndex((col) => col.id === overId);

                return arrayMove(cols, activeColIndex, overColIndex);
            });
            return;
        }

        if (active.data.current?.type === 'Task') {
            const activeTaskId = activeId;
            const overColId = over.data.current?.column?.id;

            if (!overColId) return;

            setTasks((tasks) =>
                tasks.map((task) =>
                    task.id === activeTaskId
                        ? { ...task, colId: overColId }
                        : task
                )
            );
        }
    };


    const onDragOver = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';

        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
                const overTaskIndex = tasks.findIndex((task) => task.id === overId);

                if (tasks[activeTaskIndex].colId !== tasks[overTaskIndex].colId) {
                    tasks[activeTaskIndex].colId = tasks[overTaskIndex].colId;
                }

                return arrayMove(tasks, activeTaskIndex, overTaskIndex);
            });
        }
    }

    const addNewTask = (colId: number) => {
        const tasksInThisCol = tasks.filter((task) => task.colId === colId);
        setTasks([...tasks, { id: Math.floor(Math.random() * 10000000), colId, text: `Task ${tasksInThisCol.length + 1}` }]);
    }

    const deleteTask = (taskId: number) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    const deleteAllItems = (colId: number) => {
        setTasks(tasks.filter((task) => task.colId !== colId));

        const notify = () => toast.success('Deleted!');
        notify();
    };

    const deleteCol = (colTitle: string) => {
        setCols(cols.filter((col) => col.title !== colTitle));

        const notify = () => toast.success('Deleted!');
        notify();
    };

    const [heading, setHeading] = useState<string>('');
    const [showForm, setShowForm] = useState<boolean>(false);


    const handleNewCol = () => {
        if (!heading) return;

        if (cols.find((col) => col.title === heading)) {
            const notify = () => toast.error('Column with this title already exists!');
            notify();

            setHeading('');
            return;
        }

        setCols([...cols, { title: heading, id: Math.floor(Math.random() * 10000000) }]);

        setHeading('');
    }

    const editColTitle = (colId: number, newTitle: string) => {
        const checkUnique = cols.find((col) => col.title == newTitle);
        if (checkUnique) {
            const notify = () => toast.error('Column with this title already exists!');
            notify();
            return;
        }

        setCols(cols.map((col) => col.id === colId ? { ...col, title: newTitle } : col));

        const notify = () => toast.success('Updated!');
        notify();
    };

    const editTask = (taskId: number, newText: string) => {
        setTasks(tasks.map((task) => task.id === taskId ? { ...task, text: newText } : task));

        const notify = () => toast.success('Updated!');
        notify();
    }


    const [input, setInput] = useState<string>('');

    const [selected, setSelected] = useState<string>('1');

    const handleSubmit = (e: FormEvent<HTMLFormElement>, input: string) => {
        e.preventDefault();

        if (!input) return;

        setTasks([...tasks, { id: Math.floor(Math.random() * 10000000), colId: parseInt(selected), text: input }]);
        setInput('');
    }


    const updateTask = (taskId: number, newText: string) => {
        const newTasks = tasks.map((task) => {
            if (task.id != taskId) return task;
            return { ...task, text: newText };
        })

        setTasks(newTasks);
    }

    return (
        <div className='overflow-y-hidden h-screen w-full bg-zinc-900'>

            <h1 className='text-center text-white text-4xl mt-8 font-semibold'>TASK MANAGEMENT</h1>

            <form className="flex justify-center items-center gap-5 w-screen pt-8" onSubmit={(e) => handleSubmit(e, input)}>
                <input className="outline-none py-3 w-96 rounded px-5 bg-zinc-800 text-zinc-200" placeholder="Type Something..." type="text" value={input} onChange={(e) => setInput(e.target.value)} />

                <select onChange={(e) => setSelected(e.target.value)} className="w-24 outline-none h-12 rounded pl-2 bg-zinc-800 text-white text-sm" >
                    {
                        cols.map((col, index) => {
                            return <option key={index} value={col.id}>{col.title}</option>
                        })
                    }
                </select>

                <button type="submit" className="h-12 w-24 rounded text-white font-semibold bg-zinc-800 flex justify-center items-center gap-1 hover:bg-zinc-700 active:bg-zinc-800 transition">Add <BiPlus className='text-xl' /> </button>
            </form>



            <DndContext
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                sensors={sensors}
                collisionDetection={rectIntersection}
            >
                <div className='flex items-start pt-12 h-full w-full justify-start px-10 gap-3'>
                    <SortableContext items={cols.map((col) => col.id)} >
                        {cols.map((col) => (
                            <div key={col.id}>
                                <ColumnContainer updateTask={updateTask} editTask={editTask} editColTitle={editColTitle} deleteCol={deleteCol} deleteAllItems={deleteAllItems} deleteTask={deleteTask} col={col} addNewTask={addNewTask} tasks={tasks.filter((task) => task.colId == col.id)} />
                            </div>
                        ))}
                    </SortableContext>
                    <div className="h-fit flex flex-col mr-5">
                        {
                            showForm ? (
                                <form
                                    className='flex flex-col'
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleNewCol();
                                        setShowForm(!showForm);
                                    }}>
                                    <input type="text" placeholder="Heading" className="border-b border-black py-3 rounded-t outline-none px-5 w-52 bg-zinc-800 text-white" autoFocus onBlur={() => {
                                        handleNewCol();
                                        setShowForm(!showForm);
                                    }} onChange={(e) => setHeading(e.target.value)} />

                                    <button onClick={() => {
                                        handleNewCol();
                                        setShowForm(!showForm);
                                    }}
                                        className={`bg-zinc-800 text-white py-3 shadow outline-none cursor-pointer hover:bg-zinc-700 transition rounded-b px-8 w-52 ${showForm ? 'rounded-b' : 'rounded'}`}
                                    >
                                        {
                                            showForm ? heading ? 'Add Card +' : 'Back' : 'New Card +'
                                        }
                                    </button>
                                </form>
                            ) : (
                                <button onClick={() => {
                                    handleNewCol();
                                    setShowForm(!showForm);
                                }}
                                    className={`bg-zinc-800 text-white py-3 shadow outline-none cursor-pointer hover:bg-zinc-700 transition rounded-b px-8 w-52 ${showForm ? 'rounded-b' : 'rounded'}`}
                                >
                                    {
                                        showForm ? heading ? 'Add Card +' : 'Back' : 'New Card +'
                                    }
                                </button>
                            )
                        }
                    </div>
                </div>

                {
                    createPortal(
                        <DragOverlay>
                            {
                                activeCol && (
                                    <ColumnContainer updateTask={updateTask} editTask={editTask} editColTitle={editColTitle} deleteCol={deleteCol} deleteAllItems={deleteAllItems} deleteTask={deleteTask} col={activeCol} addNewTask={addNewTask} tasks={tasks.filter((task) => task.colId == activeCol.id)} />
                                )
                            }
                            {
                                activeTask && (
                                    <Task updateTask={updateTask} editTask={editTask} task={activeTask} />
                                )
                            }
                        </DragOverlay>,
                        document.body
                    )
                }
            </DndContext>

            <Toaster />
        </div>
    )
}

export default Board;
