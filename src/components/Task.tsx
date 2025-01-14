import React from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function Task(props) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id: props.task.id,
        data: {
            type: 'Task',
            column: props.task,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };



    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners} 
            className="bg-white border shadow flex justify-between rounded-lg py-2 px-4 cursor-grab items-center w-[90%] mx-auto"
        >
            <p className="text-gray-700 font-semibold">{props.task.text}</p>

            <div className="flex gap-1 cursor-default">
                <div className="h-6 w-6 shadow bg-green-500 text-white rounded-full flex justify-center items-center hover:scale-105 active:scale-95 cursor-pointer">
                    <TiTick />
                </div>

                <div className="h-6 w-6 shadow bg-red-500 text-white rounded-full flex justify-center items-center cursor-pointer hover:scale-105 active:scale-95">
                    <MdDeleteForever />
                </div>
            </div>
        </div>
    )
}

export default Task;