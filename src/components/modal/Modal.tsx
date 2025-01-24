import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FiEye, FiUser } from 'react-icons/fi';
import { GoNote } from 'react-icons/go';
import { GrAttachment, GrList, GrTextAlignFull } from 'react-icons/gr';
import Heading from './Heading';
import RightBtn from './RightBtn';
import { LuDot, LuUserPlus } from 'react-icons/lu';
import { CgTag } from 'react-icons/cg';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import { IoIosArchive, IoMdAdd, IoMdCheckboxOutline, IoMdTime } from 'react-icons/io';
import { MdContentCopy, MdOutlineInput, MdVideoLabel } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa';
import { CiShare2 } from 'react-icons/ci';

interface Props {
    setShowModal: Dispatch<SetStateAction<boolean>>;
    modalDetails: {
        modalHeading: string,
        modalDesc: string,
        modalComments: { commentId: number, commentText: string }[]
        id: number | null;
    };
    userEmail: string;
    handleAddComment: (id: number, newComment: string) => void;
    handleDelComment: (commentId: number, taskId: number) => void;
    handleAddDesc: (id: number, newDesc: string) => void;
    handleDelDesc: (id: number) => void;
    tasks: {
        id: number;
        colId: number;
        text: string;
        desc: string;
        comments: { commentId: number, commentText: string }[]
    }[]
}

function Modal(props: Props) {
    const [showNotifications, setShowNotifications] = useState<boolean>(false);

    const [description, setDescription] = useState<string>('');

    const [comment, setComment] = useState<string>('');

    const [editDesc, setEditDesc] = useState<boolean>(false);

    const toggleEditDescMode = () => {
        setDescription(props.modalDetails.modalDesc);
        setEditDesc(true);
    };

    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const a = modalRef?.current as any;
            if (a && !a.contains(e?.target)) {
                props.setShowModal((prev) => !prev);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    const [task, setTask] = useState< {
        id: number;
        colId: number;
        text: string;
        desc: string;
        comments: { commentId: number, commentText: string }[]
    }>();

    useEffect(() => {
        const [a] = props.tasks.filter((task) => task.id == props.modalDetails.id);
        setTask(a);
        
    }, [props.tasks]);


    return (
        <div className='fixed w-full overflow-y-scroll h-full z-50 top-0 flex justify-center' style={{ backgroundColor: 'rgb(0, 0, 0, 0.9)' }}>
            <div ref={modalRef} className='text-[#b6c2cf] relative p-6 rounded-2xl w-[768px] md:min-h-[890px] md:max-h-full bg-[#323940] opacity-100 my-12 flex        max-md:flex-col max-md:w-[80%] max-md:h-fit'>

                <IoClose className='absolute top-4 right-4 text-2xl hover:bg-zinc-600 cursor-pointer        md:hidden' onClick={() => props.setShowModal(prev => !prev)} />

                <div className='w-[75%] flex flex-col gap-6     max-md:w-full'>

                    <div className='flex'>
                        <GoNote className='text-2xl' />

                        <div className='ml-4 w-[87%]'>
                            {/* <h1 className='text-xl mb-1 break-words w-full max-h-40 overflow-y-auto'>{props.modalDetails.modalHeading}</h1> */}
                            <h1 className='text-xl mb-1 break-words w-full max-h-40 overflow-y-auto'>{task?.text}</h1>
                            {/* <h2 className='text-sm font-thin truncate max-w-32'>in list <span className='px-1 rounded-sm font-normal bg-[#3c454d]'>{props.modalDetails.modalHeading}</span></h2> */}
                            <h2 className='text-sm font-thin truncate max-w-32'>in list <span className='px-1 rounded-sm font-normal bg-[#3c454d]'>{task?.text}</span></h2>
                        </div>
                    </div>


                    <div className='ml-10'>
                        <h2 className='text-sm mb-1'>Notifications</h2>

                        <div className='flex items-center gap-1 px-3 bg-[#3c454d] hover:bg-zinc-600 cursor-pointer w-fit py-2 rounded' onClick={() => setShowNotifications((prev) => !prev)}>
                            <FiEye />
                            {showNotifications ? (<>
                                <h3>Watching</h3>
                                <IoCheckmark className='text-xl' />
                            </>) : (
                                <h3>Watch</h3>
                            )}
                        </div>
                    </div>


                    <div>
                        <Heading text='Description' icon={<GrTextAlignFull />} />

                        <div className='ml-10 mt-1'>
                            {props.modalDetails.modalDesc == '' ? (
                                description ? (
                                    <>
                                        <textarea className='bg-[#3c454d] outline-none px-3 pt-2 pb-8 text-sm font-semibold w-full rounded resize-none' placeholder='Add more detailed description...' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                        <button
                                            className='bg-blue-800 px-3 py-1 rounded-sm'
                                            onClick={() => props.handleAddDesc(props.modalDetails.id as number, description)}
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <textarea className='bg-[#3c454d] outline-none px-3 pt-2 pb-8 text-sm font-semibold w-full rounded resize-none' placeholder='Add more detailed description...' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                        <button className='bg-blue-800 px-3 py-1 rounded-sm disabled:bg-blue-950' disabled>Save</button>
                                    </>
                                )
                            ) : (
                                editDesc ? (
                                    description ? (
                                        <>
                                            <textarea
                                                autoFocus
                                                className='bg-[#3c454d] outline-none px-3 pt-2 pb-8 text-sm font-semibold w-full rounded resize-none' placeholder='Add more detailed description...' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                            <button
                                                className='bg-blue-800 px-3 py-1 rounded-sm'
                                                onClick={() => {
                                                    props.handleAddDesc(props.modalDetails.id as number, description)
                                                    setEditDesc(false);
                                                }}
                                            >
                                                Save
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <textarea className='bg-[#3c454d] outline-none px-3 pt-2 pb-8 text-sm font-semibold w-full rounded resize-none' placeholder='Add more detailed description...' value={task?.desc} onChange={(e) => setDescription(e.target.value)}></textarea>
                                            <button className='bg-blue-800 px-3 py-1 rounded-sm disabled:bg-blue-950' disabled>Save</button>
                                        </>
                                    )
                                ) : (
                                    <>
                                        {/* <div className={`bg-[#3c454d] outline-none px-3 py-2 text-sm font-semibold w-full rounded break-words max-h-28 ${props.modalDetails.modalDesc.length > 170 ? "overflow-y-scroll" : ""}`}>{props.modalDetails.modalDesc}</div> */}
                                        <div className={`bg-[#3c454d] outline-none px-3 py-2 text-sm font-semibold w-full rounded break-words max-h-28 ${task?.desc?.length as number > 170 ? "overflow-y-scroll" : ""}`}>{task?.desc as string}</div>
                                        <div className='flex items-center'>
                                            <p className='text-[11px] flex items-center cursor-pointer hover:underline' onClick={toggleEditDescMode}><LuDot className='text-xl' />Edit</p>
                                            <p className='text-[11px] flex items-center cursor-pointer hover:underline' onClick={() => {
                                                props.handleDelDesc(props.modalDetails.id as number);
                                                setDescription('');
                                            }}><LuDot className='text-xl' />Delete</p>
                                        </div>
                                    </>
                                )
                            )}
                        </div>
                    </div>


                    <div>
                        <div className='flex justify-between'>
                            <Heading text='Activity' icon={<GrList />} />
                            <button className='px-3 py-1 bg-[#3c454d] rounded hover:bg-zinc-600 cursor-pointer'>Show Details</button>
                        </div>

                        <div className='ml-10 mt-2'>
                            <textarea className='bg-zinc-800 outline-none px-3 py-2 text-sm font-semibold w-full rounded resize-none h-20' placeholder='Write a comment...' value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                            {comment == '' ? (
                                <button className='bg-blue-800 px-3 py-1 rounded-sm disabled:bg-blue-950' disabled>Save</button>
                            ) : (
                                <button className='bg-blue-800 px-3 py-1 rounded-sm' onClick={() => {
                                    props.handleAddComment(props.modalDetails.id as number, comment);
                                    setComment('');
                                }}
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    </div>


                    <div className={`ml-10 flex flex-col gap-2 relative overflow-x-hidden       max-md:mb-5 ${props.modalDetails.modalComments.length > 5 ? "overflow-y-scroll" : ""}`}>
                        {/* {
                            props.modalDetails.modalComments.map((comment, index) => {
                                if (comment.commentId == 123) {
                                    return;
                                } else {
                                    return (
                                        <div key={index}>
                                            <div className='flex gap-2'>
                                                <div className='absolute w-10 h-10 bg-orange-700 rounded-full flex justify-center items-center text-2xl font-semibold'>{props.userEmail.slice(0, 1).toUpperCase()}</div>
                                                <div className='bg-zinc-800 translate-x-12 outline-none px-3 py-2 text-sm w-[420px] rounded text-wrap break-words '>{comment.commentText}</div>
                                            </div>
                                            <div className='flex translate-x-11'>
                                                <p className='text-[11px] flex items-center cursor-pointer hover:underline' onClick={() => props.handleDelComment(comment.commentId, props.modalDetails.id as number)}><LuDot className='text-xl' />Delete</p>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        } */}
                         {
                            task?.comments.map((comment, index) => {
                                if (comment.commentId == 123) {
                                    return;
                                } else {
                                    return (
                                        <div key={index}>
                                            <div className='flex gap-2'>
                                                <div className='absolute w-10 h-10 bg-orange-700 rounded-full flex justify-center items-center text-2xl font-semibold'>{props.userEmail.slice(0, 1).toUpperCase()}</div>
                                                <div className='bg-zinc-800 translate-x-12 outline-none px-3 py-2 text-sm w-[420px] rounded text-wrap break-words '>{comment.commentText}</div>
                                            </div>
                                            <div className='flex translate-x-11'>
                                                <p className='text-[11px] flex items-center cursor-pointer hover:underline' onClick={() => props.handleDelComment(comment.commentId, props.modalDetails.id as number)}><LuDot className='text-xl' />Delete</p>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                </div>


                <div className='w-[25%] pl-5 flex flex-col justify-end relative     max-md:pl-0 max-md:w-full'>
                    <IoClose className='absolute top-0 right-0 text-2xl hover:bg-zinc-600 cursor-pointer        max-md:hidden' onClick={() => props.setShowModal(prev => !prev)} />

                    <div className='flex flex-col gap-2     max-md:flex-wrap max-md:flex-row'>
                        <RightBtn icon={<LuUserPlus />} text='Join' />
                        <RightBtn icon={<FiUser />} text='Members' />
                        <RightBtn icon={<CgTag style={{ rotate: '135deg' }} />} text='Labels' />
                        <RightBtn icon={<IoMdCheckboxOutline />} text='Checklist' />
                        <RightBtn icon={<IoMdTime />} text='Dates' />
                        <RightBtn icon={<GrAttachment />} text='Attachment' />
                        <RightBtn icon={<MdVideoLabel />} text='Cover' />
                        <RightBtn icon={<MdOutlineInput />} text='Custom Fields' />
                    </div>


                    <div className='flex flex-col gap-4 my-6'>
                        <div className='flex flex-col gap-2'>
                            <h5 className='text-[12px]'>Power-Ups</h5>
                            <button className='w-full flex items-center py-2 pl-4 gap-2 rounded text-sm hover:bg-zinc-600'><IoMdAdd className='text-xl' />Add Power-Ups</button>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h5 className='text-[12px]'>Automation</h5>
                            <button className='w-full flex items-center py-2 pl-4 gap-2 rounded text-sm hover:bg-zinc-600'><IoMdAdd className='text-xl' />Add Button</button>
                        </div>
                    </div>


                    <div className='flex flex-col gap-2     max-md:flex-wrap max-md:flex-row'>
                        <RightBtn icon={<FaArrowRight />} text='Move' />
                        <RightBtn icon={<MdContentCopy />} text='Copy' />
                        <RightBtn icon={<GoNote />} text='Mirror' />
                        <RightBtn icon={<MdOutlineInput />} text='Make Template' />

                        <div className='w-full h-px bg-zinc-600     max-md:w-[92%]'></div>

                        <RightBtn icon={<IoIosArchive />} text='Archive' />
                        <RightBtn icon={<CiShare2 />} text='Share' />
                    </div>

                </div>


            </div >
        </div >
    )
}

export default Modal;