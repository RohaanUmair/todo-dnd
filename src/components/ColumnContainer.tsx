'use client'
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import React, { useEffect, useState } from 'react'
import { CSS } from '@dnd-kit/utilities';
import { IoClose } from 'react-icons/io5';
import { MdAddCircleOutline, MdDeleteForever, MdDeleteSweep } from 'react-icons/md';
import { TbDots } from 'react-icons/tb';
import Task from './Task';
import { RiDragDropLine } from 'react-icons/ri';

function ColumnContainer(props) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
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



    return (
        <>
            <div
                className={`w-72 bg-slate-100 rounded-xl pb-5 h-[400px] relative`}
                ref={setNodeRef}
                style={style}
                {...attributes}
            >
                <div
                    {...listeners}
                    className="flex justify-between px-4 items-center py-3 border-b mb-5 bg-slate-100 w-72 absolute rounded-t-xl"
                >
                    <h3 className="text-gray-700 font-bold">{props.col.title}</h3>
                    <div className={`w-6 h-6 rounded-sm flex justify-center items-center cursor-pointer ${openMenu ? 'bg-gray-300' : ''}`} onClick={() => setOpenMenu(!openMenu)}>
                        {
                            openMenu ? (
                                <>
                                    <IoClose className="text-lg" />
                                    <div className="relative">
                                        <ul className="absolute !w-36 top-4 text-sm right-0 font-semibold bg-white shadow-2xl rounded-lg p-2">
                                            <li
                                                className="cursor-pointer hover:bg-gray-200 active:bg-gray-400 w-full h-12 flex items-center px-2 rounded justify-between py-1 border-b"
                                            // onClick={() => deleteAllItems()}
                                            >
                                                Delete All <MdDeleteSweep className="text-xl text-red-600" />
                                            </li>
                                            {
                                                props.col.id > 2 && (
                                                    <li
                                                        className="cursor-pointer hover:bg-gray-200 active:bg-gray-400 w-full h-12 flex items-center px-2 rounded justify-between py-1"
                                                    // onClick={deleteCard}
                                                    >
                                                        Delete Card <MdDeleteForever className="text-xl text-red-800" />
                                                    </li>
                                                )
                                            }
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <TbDots className="text-lg" />
                            )
                        }
                    </div>
                </div>

                <div className={`mt-[50px] pt-[49px] h-[300px] overflow-x-hidden ${isScrollable ? 'overflow-y-scroll' : ''}`}>
                    <SortableContext items={props.tasks.map((task) => task.id)}>
                        {
                            props.tasks.map((task: any, index: number) => {
                                return (
                                    <Task key={index} task={task} />
                                )
                            })
                        }
                    </SortableContext>
                </div>

                <div className="flex justify-center mt-5">
                    <div
                        onClick={() => props.addNewTask(props.col.id)}
                        className="w-[80%] mx-auto h-10 border-dashed border-2 border-gray-300  rounded flex items-center px-4 hover:bg-zinc-300 text-zinc-500 cursor-pointer hover:justify-center transition-all hover:text-[17px] hover:text-black "
                    >
                        <h1 className=" font-bold flex items-center justify-between w-full">
                            <span className="flex items-center gap-2">Add <MdAddCircleOutline /></span>
                            {/* <span className="flex items-center gap-2 text-[15px]">or Drag Here<RiDragDropLine /></span> */}
                        </h1>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ColumnContainer;