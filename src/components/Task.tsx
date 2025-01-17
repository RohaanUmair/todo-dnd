'use client';
import React, { useState } from 'react';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TiTick } from 'react-icons/ti';
import { Tooltip } from 'react-tooltip'



function Task(props: any) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: props.task.id,
        data: {
            type: 'Task',
            task: props.task,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };


    const [editMode, setEditMode] = useState<boolean>(false);

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };


    const [editTask, setEditTask] = useState<string>(props.task.text);

    const handleEditDone = () => {
        props.updateTask(props.task.id, editTask);
        toggleEditMode();
    };


    if (editMode) {
        return (
            <>
                <form
                    className="bg-zinc-900 border border-black shadow flex justify-between rounded py-2 px-4 cursor-grab items-center w-52 mx-auto my-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleEditDone();
                    }}
                >
                    <input
                        type="text"
                        placeholder='Task'
                        className="outline-none w-32 bg-zinc-900 text-sm text-white"
                        onChange={(e) => setEditTask(e.target.value)}
                        value={editTask}
                        onBlur={() => { handleEditDone() }}
                        autoFocus
                        maxLength={45}
                    />

                    <div className="flex gap-1 cursor-default">
                        <div className="h-6 w-6 shadow bg-green-500 text-white rounded-full flex justify-center items-center hover:scale-105 active:scale-95 cursor-pointer">
                            <TiTick />
                        </div>
                    </div>
                </form>


            </>
        )
    }


    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="border border-dashed border-rose-600 shadow flex justify-between rounded py-2 px-4 cursor-grab items-center w-52 mx-auto my-2"
            >
                <p className="font-semibold text-zinc-800">.</p>

                <div className="flex gap-1 cursor-default">
                </div>
            </div>
        )
    }


    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-zinc-900 border border-black shadow flex justify-between rounded py-2 px-4 cursor-grab items-center w-52 mx-auto my-2"
        >
            <>
                {
                    props.task.text.length > 13 ? (
                        <p
                            className="text-white text-sm font w-32 truncate "
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content={props.task.text}
                        >
                            {props.task.text}
                        </p>
                    ) : (
                        <p className="text-white text-sm font w-32 truncate">{props.task.text}</p>
                    )
                }

                <div className="flex gap-1 cursor-default">
                    <div
                        onClick={() =>
                            toggleEditMode()
                        }
                        className="h-6 w-6 shadow text-green-500 text-lg rounded-full flex justify-center items-center hover:scale-110 active:scale-95 cursor-pointer"
                    >
                        <MdEdit />
                    </div>

                    <div
                        className="h-6 w-6 shadow text-red-500 text-lg rounded-full flex justify-center items-center cursor-pointer hover:scale-110 active:scale-95"
                        onClick={() => props.deleteTask(props.task.id)}
                    >
                        <MdDeleteForever />
                    </div>
                </div>

                <Tooltip id="my-tooltip" />
            </>
        </div>
    )
}

export default Task;