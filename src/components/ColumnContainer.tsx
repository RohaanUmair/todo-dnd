'use client';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import React, { useEffect, useRef, useState } from 'react'
import { CSS } from '@dnd-kit/utilities';
import { IoClose } from 'react-icons/io5';
import { MdAddCircleOutline, MdDeleteForever, MdDeleteSweep, MdEdit } from 'react-icons/md';
import { TbDots } from 'react-icons/tb';
import Task from './Task';
import { TiTick } from 'react-icons/ti';
import { Tooltip } from 'react-tooltip'

function ColumnContainer(props: any) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: props.col.id,
        data: {
            type: 'Column',
            column: props.col,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };


    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const [isScrollable, setIsScrollable] = useState<boolean>(false);

    useEffect(() => {
        if (props.tasks.length > 5) {
            setIsScrollable(true);
        } else {
            setIsScrollable(false);
        }
    }, [props.tasks]);


    const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
    const [newTitle, setNewTitle] = useState<string>(props.col.title);

    const handleEditColTitle = () => {
        if (newTitle.trim() === props.col.title) {
            setIsEditingTitle(false);
            return;
        }

        if (newTitle.trim() === '') {
            setNewTitle(props.col.title);
        } else {
            if (newTitle.trim().length > 23) {
                const arr = [];

                for (let i = 0; i < newTitle.trim().length; i++) {
                    arr.push(newTitle[i]);
                }

                console.log(arr);


                for (let i = 0; i < arr.length / 23; i++) {
                    if (i === 0) continue;
                    arr.splice(22 * i + 1, 0, ' ');
                }

                console.log(arr);

                const finalTitle = arr.join('');
                console.log(finalTitle);

                props.editColTitle(props.col.id, finalTitle);
            } else {
                props.editColTitle(props.col.id, newTitle);
            }
        }
        setIsEditingTitle(false);
    }


    const menuRef = useRef(null);

    useEffect(() => {
        const handleCLickOutside = (e: MouseEvent) => {
            const ref = menuRef?.current as any;
            if (ref && !ref.contains(e.target)) {
                setOpenMenu(false);
            }
        }

        document.addEventListener('mousedown', handleCLickOutside);

        return () => document.removeEventListener('mousedown', handleCLickOutside);
    }, [openMenu]);


    if (isDragging) {
        return (
            <div
                className={`w-60 border-rose-600 z-50 border-dashed border-2 rounded pb-5 h-[350px] relative`}
                ref={setNodeRef}
                style={style}
                {...attributes}
            >
            </div>
        )
    }


    return (
        <>
            <div
                className={`w-60 bg--800 pb-5 h-[350px] outline-none`}
                ref={setNodeRef}
                style={style}
                {...attributes}
            >
                <div className='rounded border border-teal-900 shadow shadow-[#111] outline-none'>
                    <div
                        {...listeners}
                        className="flex justify-between px-4 items-center py-3 border-b border-black bg-zinc-800 w-full rounded-t cursor-grab"
                    >
                        {
                            isEditingTitle ? (
                                <form onSubmit={handleEditColTitle} className='flex items-center'>
                                    <input
                                        type="text"
                                        placeholder="Column Title"
                                        className="rounded-t outline-none bg-zinc-800 w-36 text-white text-sm"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        onBlur={handleEditColTitle}
                                        autoFocus
                                    />

                                    <div
                                        className="h-6 w-6 bg-green-500 text-white rounded-full flex justify-center items-center hover:scale-105 active:scale-95 cursor-pointer"
                                    >
                                        <TiTick />
                                    </div>
                                </form>
                            ) : (
                                props.col.title.length > 19 ? (
                                    <h3
                                        className="text-white text-sm truncate"
                                        data-tooltip-id="my-tooltip"
                                        data-tooltip-content={props.col.title}
                                    >
                                        {props.col.title}
                                    </h3>
                                ) : (
                                    <h3 className="text-white text-sm truncate">{props.col.title}</h3>
                                )
                            )
                        }
                        <div className={`w-5 h-5 rounded-sm flex justify-center items-center cursor-pointer ${openMenu ? 'bg-zinc-700' : ''}`} onBlur={() => setOpenMenu(false)} onClick={() => setOpenMenu(!openMenu)}>
                            {
                                openMenu ? (
                                    <div ref={menuRef}>
                                        <IoClose className="text-lg" />
                                        <div className="relative">
                                            <ul className="absolute !w-36 top-4 text-sm right-0 bg-zinc-900 border rounded text-white p-2">
                                                <li
                                                    className="cursor-pointer hover:bg-zinc-700 active:bg-gray-400 w-full h-12 flex items-center px-2 rounded justify-between py-1 border-b"
                                                    onClick={() => setIsEditingTitle(true)}
                                                >
                                                    Edit <MdEdit className="text-xl text-yellow-400" />
                                                </li>

                                                {
                                                    props.tasks.length == 0 ? (
                                                        <li
                                                            className={`cursor-not-allowed hover:bg-zinc-900 w-full h-12 flex items-center px-2 rounded justify-between py-1 border-b`}
                                                        >
                                                            Delete All <MdDeleteSweep className="text-xl text-red-600" />
                                                        </li>
                                                    ) : (
                                                        <li
                                                            className={`cursor-pointer hover:bg-zinc-700 active:bg-gray-400 w-full h-12 flex items-center px-2 rounded justify-between py-1 border-b`}
                                                            onClick={() => props.deleteAllItems(props.col.id)}
                                                        >
                                                            Delete All <MdDeleteSweep className="text-xl text-red-600" />
                                                        </li>
                                                    )
                                                }

                                                {
                                                    props.col.id == '1' || props.col.id == '2' || props.col.id == '3' ? (
                                                        <></>
                                                    ) : (
                                                        <li
                                                            className="cursor-pointer hover:bg-zinc-700 active:bg-gray-400 w-full h-12 flex items-center px-2 rounded justify-between py-1"
                                                            onClick={() => props.deleteCol(props.col.title)}
                                                        >
                                                            Delete Column <MdDeleteForever className="text-xl text-red-800" />
                                                        </li>

                                                    )
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <TbDots className="text-lg text-white" />
                                )
                            }
                        </div>
                    </div>

                    <div className={`max-h-[225px] overflow-x-hidden cursor-default ${isScrollable ? 'overflow-y-scroll' : ''}`}>
                        <SortableContext items={props.tasks.map((task: any) => task.id)}>
                            {props.tasks.length > 0 ? (
                                props.tasks.map((task: any, index: number) => (
                                    <Task handleModal={props.handleModal} updateTask={props.updateTask} editTask={props.editTask} key={index} task={task} deleteTask={props.deleteTask} />
                                ))
                            ) : (
                                <div
                                    className="h-full flex items-center justify-center text-gray-500 italic text-sm px-6 py-4"
                                >
                                    Drag a task here or create a new one
                                </div>
                            )}
                        </SortableContext>
                    </div>

                    <div className="flex justify-center mt-4">
                        <div
                            onClick={() => props.addNewTask(props.col.id)}
                            className="w-full mx-auto h-10 border-2 border-black bg-black rounded-b flex items-center px-4 hover:bg-zinc-950 text-zinc-500 cursor-pointer hover:justify-center transition-all hover:text-[17px] hover:text-black "
                        >
                            <h1 className=" font-bold flex items-center justify-between w-full">
                                <span className="flex items-center gap-2 text-zinc-500">Add <MdAddCircleOutline /></span>
                            </h1>
                        </div>
                    </div>
                </div>

                <div className='bg-transparent h-full w-full -z-10 cursor-default'></div>
            </div>


            <Tooltip id="my-tooltip" style={{ textWrap: 'wrap', width: 300, display: 'hidden' }} />
        </>
    )
}

export default ColumnContainer;