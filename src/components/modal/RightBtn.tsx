import React from 'react';
import { BiUser } from 'react-icons/bi';

function RightBtn({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <button className='w-full flex items-center bg-[#3c454d] py-2 pl-4 gap-2 rounded text-sm hover:bg-zinc-600 cursor-pointer'>
            <div className='text-lg'>
                {icon}
            </div>
            {text}
        </button>
    )
}

export default RightBtn
