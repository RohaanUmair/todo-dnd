'use client';
import React, { useEffect, useRef, useState } from 'react';
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
    const [editTask, setEditTask] = useState<string>('');

    useEffect(() => {
        setEditTask(props.task.text);
    }, [editMode])


    const handleEditDone = () => {
        // props.updateTask(props.task.id, editTask);
        // setEditMode(!editMode);

        if (editTask.trim() === props.task.text) {
            setEditMode(false);
            return;
        }

        if (editTask.trim() === '') {
            setEditTask(props.task.text);
        } else {
            if (editTask.trim().length > 23) {
                const arr = [];

                for (let i = 0; i < editTask.trim().length; i++) {
                    arr.push(editTask[i]);
                }

                for (let i = 0; i < arr.length / 23; i++) {
                    if (i === 0) continue;
                    arr.splice(22 * i + 1, 0, ' ');
                }

                const finalTask = arr.join('');
                console.log(finalTask);

                props.updateTask(props.task.id, finalTask);
            } else {
                props.updateTask(props.task.id, editTask);
            }
        }
        setEditMode(false);
    };

    const inputRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!editMode) return;

            const a = inputRef?.current as any;
            const b = btnRef?.current as any;
            if (a && !a.contains(e?.target) && b && !b.contains(e?.target)) {
                setEditMode(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [editMode]);

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
                        ref={inputRef}
                        type="text"
                        placeholder='Task'
                        className="outline-none w-32 bg-zinc-900 text-sm text-white"
                        onChange={(e) => setEditTask(e.target.value)}
                        value={editTask}
                        autoFocus
                    />

                    <div className="flex gap-1 cursor-default" ref={btnRef}>
                        <div className="h-6 w-6 shadow bg-green-500 text-white rounded-full flex justify-center items-center hover:scale-105 active:scale-95 cursor-pointer" onClick={ () => handleEditDone() }>
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
            className="bg-zinc-800 border border-black shadow flex justify-between rounded py-2 px-4 cursor-grab items-center w-52 mx-auto my-2"
        >
            <>
                <div
                    onClick={() => {
                        props.handleModal(props.task)
                    }}
                >
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
                </div>

                <div className="flex gap-1 cursor-default">
                    <div
                        onClick={() =>
                            setEditMode(!editMode)
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

                <Tooltip className='break-words' id="my-tooltip" style={{ textWrap: 'wrap', width: 300, display: 'hidden' }} />
            </>
        </div>
    )
}

export default Task;