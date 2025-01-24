'use client';
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import ColumnContainer from './ColumnContainer';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, rectIntersection } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import Task from './Task';
import toast, { Toaster } from 'react-hot-toast';
import { BiPlus } from 'react-icons/bi';
import { handleSignout } from '@/lib/firebase';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { CiLogout } from 'react-icons/ci';
import { MdEmail } from 'react-icons/md';
import { ClipLoader } from 'react-spinners';
import { onDragStart } from './functions';
import Modal from './modal/Modal';
import { FaUserCog } from 'react-icons/fa';
import { getDatabase, ref, set, onValue, get } from "firebase/database";
import Swal from 'sweetalert2';



interface Column {
    title: string;
    id: number;
}

interface Task {
    id: number;
    colId: number;
    text: string;
    desc: string;
    comments: { commentId: number, commentText: string }[]
}


function Board({ userEmail }: { userEmail: string | null }) {
    const [showModal, setShowModal] = useState<boolean>(false);

    const [cols, setCols] = useState<Column[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [checkCols, setCheckCols] = useState<Column[]>();
    const [checkTasks, setCheckTasks] = useState<Task[]>();

    const [activeCol, setActiveCol] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    function correctEmail(email: string): string {
        return email.replace(/\./g, ',');
    }

    async function addDataToDb(colData: Column[], taskData: Task[], email: string) {
        const encodedEmail = correctEmail(email);
        const db = getDatabase();

        try {
            await set(ref(db, `columns/${encodedEmail}`), colData);
            console.log("Columns added successfully");
        } catch (error) {
            console.error("Error adding columns: ", error);
        }

        try {
            await set(ref(db, `tasks/${encodedEmail}`), taskData);
            console.log("Tasks added successfully", taskData);
        } catch (error) {
            console.error("Error adding tasks: ", error);
        }
    }

    const [getData, setGetdata] = useState<boolean>(false);

    useEffect(() => {
        if (!userEmail) return;

        const encodedEmail = correctEmail(userEmail);
        const db = getDatabase();
        const colRef = ref(db, `columns/${encodedEmail}`);
        const taskRef = ref(db, `tasks/${encodedEmail}`);

        get(colRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log("Column data:", data);
                setCols(data);
                setCheckCols(data);
            }
            // else {
            //     console.log("No columns found, setting default.");
            //     const defaultCols = [
            //         { title: "To Do", id: 1 },
            //         { title: "In Progress", id: 2 },
            //         { title: "Done", id: 3 },
            //     ];
            //     setCols(defaultCols);
            // }
        });

        get(taskRef).then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log("Task data:", data);
                setTasks(data);
                setCheckTasks(data);
            }
            // else {
            //     console.log("No tasks found, setting to empty.");
            //     setTasks([]);
            // }
        });

        onValue(colRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log("Column data (real-time):", data);
                setCols(data);
                setCheckCols(data);
            }
        });

        onValue(taskRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log("Task data (real-time):", data);
                setTasks(data);
                setCheckTasks(data);
            }
        });

    }, [userEmail]);

    useEffect(() => {
        if (cols.length === 0) {
            return;
        } else if (checkCols !== cols || checkTasks !== tasks) {
            if (!getData) {
                setGetdata(true);
            } else {
                addDataToDb(cols, tasks, userEmail as string);
                console.log("Data added to Realtime Database", cols, tasks);
            }
        }
    }, [tasks, cols]);


    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    );


    // const onDragStart = (e: DragStartEvent) => {
    //     if (e.active.data.current?.type === 'Column') {
    //         setActiveCol(e.active.data.current.column);
    //     }

    //     if (e.active.data.current?.type === 'Task') {
    //         setActiveTask(e.active.data.current.task);
    //     }
    // }

    const handleOnDragStart = (e: DragStartEvent) => {
        onDragStart(e, setActiveCol, setActiveTask);
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
        if (active.id === over.id) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType === 'Task' && overType === 'Task') {
            setTasks((prevTasks) => {
                const columns = prevTasks.reduce((acc, task) => {
                    acc[task.colId] = acc[task.colId] || [];
                    acc[task.colId].push(task);
                    return acc;
                }, {} as Record<string, typeof prevTasks>);

                const activeTask = prevTasks.find((task) => task.id === active.id);
                const overTask = prevTasks.find((task) => task.id === over.id);

                if (activeTask?.colId === overTask?.colId) {
                    const activeTaskIndex = tasks.findIndex((task) => task.id === active.id);
                    const overTaskIndex = tasks.findIndex((task) => task.id === over.id);

                    return arrayMove(tasks, activeTaskIndex, overTaskIndex);
                }

                if (!activeTask || !overTask) return prevTasks;

                const activeColumnTasks = columns[activeTask.colId];
                const activeIndex = activeColumnTasks.findIndex((task) => task.id === active.id);
                activeColumnTasks.splice(activeIndex, 1);

                const targetColumnTasks = columns[overTask.colId];
                const overIndex = targetColumnTasks.findIndex((task) => task.id === over.id);

                activeTask.colId = overTask.colId;

                targetColumnTasks.splice(overIndex, 0, activeTask);

                return Object.values(columns).flat();
            });
        }
    };


    const addNewTask = (colId: number) => {
        const tasksInThisCol = tasks.filter((task) => task.colId === colId);

        const id = Math.floor(Math.random() * 10000000);
        setTasks([...tasks, { id, colId, text: `Task ${tasksInThisCol.length + 1}`, desc: '', comments: [{ commentId: 123, commentText: '' }] }]);
    }

    const deleteTask = (taskId: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                setTasks(tasks.filter((task) => task.id !== taskId));

                const notify = () => toast.success('Task Deleted!', {
                    duration: 1000,
                    position: 'top-right',
                });
                notify();
            }
        });
    };

    const deleteAllItems = (colId: number) => {
        setTasks(tasks.filter((task) => task.colId !== colId));

        const notify = () => toast.success('Deleted!', {
            duration: 1000,
            position: 'top-right',
        });
        notify();
    };

    const deleteCol = (colTitle: string) => {
        if (colTitle === 'To Do' || colTitle === 'In Progress' || colTitle === 'Done') {
            const notify = () => toast.error('Cannot delete default columns!', {
                duration: 1000,
                position: 'top-right',
            });
            notify();
            return;
        }

        setCols(cols.filter((col) => col.title !== colTitle));

        const notify = () => toast.success('Deleted!', {
            duration: 1000,
            position: 'top-right',
        });
        notify();
    };

    const [heading, setHeading] = useState<string>('');
    const [showForm, setShowForm] = useState<boolean>(false);


    const handleNewCol = () => {
        if (!heading) return;

        if (cols.find((col) => col.title === heading)) {
            const notify = () => toast.error('Column with this title already exists!', {
                duration: 1000,
                position: 'top-right',
            });
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
            const notify = () => toast.error('Column with this title already exists!', {
                duration: 1000,
                position: 'top-right',
            });
            notify();
            return;
        }

        setCols(cols.map((col) => col.id === colId ? { ...col, title: newTitle } : col));

        const notify = () => toast.success('Updated!', {
            duration: 1000,
            position: 'top-right',
        });
        notify();
    };

    const editTask = (taskId: number, newText: string) => {
        setTasks(tasks.map((task) => task.id === taskId ? { ...task, text: newText } : task));

        const notify = () => toast.success('Updated!', {
            duration: 1000,
            position: 'top-right',
        });
        notify();
    }


    const [input, setInput] = useState<string>('');

    const [selected, setSelected] = useState<string>('1');

    useEffect(() => {
        if (cols.length === 0) return;

        setSelected(cols[0].id.toString());
    }, [cols]);


    const handleSubmit = (e: FormEvent<HTMLFormElement>, input: string) => {
        e.preventDefault();

        if (!input) return;

        setTasks([...tasks, { id: Math.floor(Math.random() * 10000000), colId: parseInt(selected), text: input, desc: '', comments: [{ commentId: 123, commentText: '' }] }]);
        setInput('');
    }


    const updateTask = (taskId: number, newText: string) => {
        const newTasks = tasks.map((task) => {
            if (task.id != taskId) return task;
            return { ...task, text: newText };
        })

        setTasks(newTasks);
    }

    const [openProfile, setOpenProfile] = useState<boolean>(false);

    const profileRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!openProfile) return;

            const a = profileRef?.current as any;
            const b = btnRef?.current as any;
            if (a && !a.contains(e?.target) && b && !b.contains(e?.target)) {
                setOpenProfile(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openProfile]);


    const inputColRef = useRef(null);
    const addColBtnRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!showForm) return;

            const a = inputColRef?.current as any;
            const b = addColBtnRef?.current as any;
            if (a && !a.contains(e?.target) && b && !b.contains(e?.target)) {
                setHeading('');
                setShowForm(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showForm]);



    interface ModalTypes {
        modalHeading: string,
        modalDesc: string,
        modalComments: { commentId: number, commentText: string }[];
        id: number | null;
    }

    const [modalDetails, setModalDetails] = useState<ModalTypes>(
        {
            modalHeading: '',
            modalDesc: '',
            modalComments: [],
            id: null
        }
    );


    const handleModal = (task: any) => {
        setModalDetails({
            modalHeading: task.text,
            modalDesc: task.desc,
            modalComments: task.comments,
            id: task.id
        })

        setShowModal(true);
    };

    const handleAddComment = (id: number, newComment: string) => {
        const uniqueId = Math.floor(Math.random() * 100000000);

        setTasks(tasks.map((task) => task.id == id ? { ...task, comments: [...task.comments, { commentId: uniqueId, commentText: newComment }] } : task));
        setModalDetails((prev) => {
            return (
                { ...prev, modalComments: [...prev.modalComments, { commentId: uniqueId, commentText: newComment }] }
            )
        })
    };

    const handleDelComment = (commentId: number, taskId: number) => {
        let activeTask = tasks.filter((task) => task.id == taskId);
        console.log(activeTask)

        const abcd = activeTask[0].comments.filter((comment) => {
            if (comment.commentId == commentId) {
                return;
            } else {
                return comment;
            }
        })

        activeTask = [{ ...activeTask[0], comments: abcd }]

        console.log(activeTask);

        setTasks(tasks.map((task) => task.id == taskId ? { ...task, comments: activeTask[0].comments } : task));

        setModalDetails((prev) => {
            return (
                { ...prev, modalComments: activeTask[0].comments }
            )
        })
    };

    const handleAddDesc = (id: number, newDesc: string) => {
        setTasks(tasks.map((task) => task.id == id ? { ...task, desc: newDesc } : task));
        setModalDetails((prev) => {
            return (
                { ...prev, modalDesc: newDesc }
            )
        })
    };

    const handleDelDesc = (id: number) => {
        setTasks(tasks.map((task) => task.id == id ? { ...task, desc: '' } : task));
        setModalDetails((prev) => {
            return (
                { ...prev, modalDesc: '' }
            )
        })
    };


    return (
        <div className='overflow-y-hidden h-screen w-full bg-zinc-900 relative'>
            {showModal && <Modal handleDelDesc={handleDelDesc} handleAddDesc={handleAddDesc} handleDelComment={handleDelComment} handleAddComment={handleAddComment} userEmail={userEmail as string} setShowModal={setShowModal} modalDetails={modalDetails} tasks={tasks} />}


            <div className='fixed'>
                <div className='flex items-center mt-8 justify-center w-[90%] mx-auto relative'>
                    <h1 className='text-center text-white text-4xl font-semibold max-md:text-2xl'>TASK MANAGEMENT</h1>
                    <button ref={btnRef} className='bg-blue-900 h-10 w-28 text-white absolute justify-center right-0 gap-1 text-lg rounded-sm items-center max-md:scale-75 max-md:-right-8 font-normal hover:bg-blue-800 hidden' onClick={() => setOpenProfile((prev) => !prev)}>
                        {openProfile ? (<><IoMdArrowDropup className='text-2xl' /><p>Profile</p></>) : (<><IoMdArrowDropdown className='text-2xl' /><p>Profile</p></>)}
                    </button>

                    <button ref={btnRef} className='bg-blue-900 h-10 w-28 text-white absolute flex justify-center right-0 gap-1 text-lg rounded-sm items-center       max-md:scale-75 max-md:w-10 max-md:h-10 max-md:-right-0 font-normal hover:bg-blue-800' onClick={() => setOpenProfile(!openProfile)}>
                        <FaUserCog className='text-3xl' />
                    </button>

                    {
                        openProfile && (
                            <div ref={profileRef} className='text-white w-fit h-fit absolute right-0 top-10 bg-zinc-600 px-2 rounded-b rounded-l     max-md:right-0'>
                                <div className='bg-zinc-800 px-2 flex items-center justify-center h-7 my-2 pl-10 text-sm rounded'><MdEmail className='absolute left-4 text-xl' /> {userEmail}</div>

                                <div className='bg-zinc-800 px-2 flex items-center justify-center h-7 my-2 pl-10 text-sm rounded hover:bg-zinc-700 cursor-pointer' onClick={handleSignout}><CiLogout className='absolute left-4 text-xl' /> Logout</div>
                            </div>
                        )
                    }
                </div>


                <form className="flex justify-center items-center gap-5 w-screen pt-8" onSubmit={(e) => handleSubmit(e, input)}>
                    {
                        cols.length == 0 ? (
                            <input
                                className="outline-none py-3 w-96 min-w-4 rounded px-5 bg-zinc-800 text-zinc-200    max-md:w-24 cursor-not-allowed"
                                placeholder="Type Something..."
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled
                            />

                        ) : (
                            <input
                                className="outline-none py-3 w-96 min-w-4 rounded px-5 bg-zinc-800 text-zinc-200    max-md:w-24"
                                placeholder="Type Something..."
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        )
                    }

                    <div className='flex items-center'>
                        <select onChange={(e) => setSelected(e.target.value)} className="w-24 outline-none h-12 rounded-l pl-2 bg-zinc-800 text-white text-sm" >
                            {
                                cols.map((col, index) => {
                                    return <option className='!w-24' key={index} value={col.id}>{
                                        col.title.length > 10 ? `${col.title.slice(0, 10)}...` : col.title
                                    }</option>
                                })
                            }
                        </select>

                        <div className='w-2 h-12 bg-zinc-800 rounded-r'></div>
                    </div>

                    <button type="submit" className="h-12 w-24 rounded text-white font-semibold bg-zinc-800 flex justify-center items-center gap-1 hover:bg-zinc-700 active:bg-zinc-800 transition      max-md:w-12"> <BiPlus className='text-xl' /> </button>
                </form>
            </div>



            <DndContext
                onDragStart={handleOnDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                sensors={sensors}
                collisionDetection={rectIntersection}
            >
                <div className='flex items-start pt-12 h-full w-full justify-start px-10 mt-36 gap-3 relative'>
                    {
                        cols.length == 0 ? (
                            <ClipLoader color='#fff' className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2' size={50} />
                        ) : (
                            <>
                                <SortableContext items={cols.map((col) => col.id)} >
                                    {cols.map((col) => (
                                        <div key={col.id}>
                                            <ColumnContainer handleModal={handleModal} updateTask={updateTask} editTask={editTask} editColTitle={editColTitle} deleteCol={deleteCol} deleteAllItems={deleteAllItems} deleteTask={deleteTask} col={col} addNewTask={addNewTask} tasks={tasks.filter((task) => task.colId == col.id)} />
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
                                                    setHeading('');
                                                }}>
                                                <input ref={inputColRef} type="text" placeholder="Heading" className="border-b border-black py-3 rounded-t outline-none px-5 w-52 bg-zinc-800 text-white" autoFocus
                                                    onChange={(e) => setHeading(e.target.value)} />

                                                <button ref={addColBtnRef} onClick={() => {
                                                    handleNewCol();
                                                    setHeading('');
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
                                                className={`bg-zinc-800 text-white py-3 shadow outline-none cursor-pointer hover:bg-zinc-700 transition rounded-b px-8 w-52 mr-12 ${showForm ? 'rounded-b' : 'rounded'}`}
                                            >
                                                {
                                                    showForm ? heading ? 'Add Card +' : 'Back' : 'New Card +'
                                                }
                                            </button>
                                        )
                                    }
                                </div>
                            </>

                        )
                    }
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