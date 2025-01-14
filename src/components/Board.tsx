'use client';
import React, { useState } from 'react'
import ColumnContainer from './ColumnContainer';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';

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
    const [cols, setCols] = useState<Column[]>([]);
    const [activeCol, setActiveCol] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    );

    const addCol = () => {
        const id = Math.floor(Math.random() * 10000);
        setTasks([...tasks, { id: Math.floor(Math.random() * 100000), colId: id, text: `Task ${tasks.length + 1}` }]);
        setCols([...cols, { title: `Column ${cols.length + 1}`, id: id }]);
    }

    const onDragStart = (e: DragStartEvent) => {
        if (e.active.data.current?.type === 'Column') {
            setActiveCol(e.active.data.current.column);
        }

        if (e.active.data.current?.type === 'Task') {
            setActiveTask(e.active.data.current.task);
        }
    }

    const onDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!over) return;

        const activeColId = active.id;
        const overColId = over.id;

        if (activeColId === overColId) return;

        setCols((cols) => {
            const activeColIndex = cols.findIndex((col) => col.id === activeColId);
            const overColIndex = cols.findIndex((col) => col.id === overColId);

            return arrayMove(cols, activeColIndex, overColIndex);
        })
    }

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
        setTasks([...tasks, { id: Math.floor(Math.random() * 100000), colId, text: `Task ${tasks.length + 1}` }]);
    }

    return (
        <div className='h-screen w-screen bg-gray-300'>

            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
                <div className='flex items-start h-screen w-screen justify-center gap-2'>
                    <SortableContext items={cols.map((col) => col.id)} >
                        {cols.map((col) => (
                            <div key={col.id}>
                                <ColumnContainer col={col} addNewTask={addNewTask} tasks={tasks.filter((task) => task.colId == col.id)} />
                            </div>
                        ))}
                    </SortableContext>
                    <button className='bg-green-500 text-white px-4 py-2 rounded' onClick={addCol}>Add Col</button>
                </div>
            </DndContext>
        </div>
    )
}

export default Board;
