import { DragStartEvent } from "@dnd-kit/core";

const onDragStart = (e: DragStartEvent, setActiveCol: (col: any) => void, setActiveTask: (task: any) => void) => {
    if (e.active.data.current?.type === 'Column') {
        setActiveCol(e.active.data.current.column);
    }

    if (e.active.data.current?.type === 'Task') {
        setActiveTask(e.active.data.current.task);
    }
}



export { onDragStart };