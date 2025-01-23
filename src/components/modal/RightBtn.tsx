import React from 'react';

function RightBtn({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <button className='w-full flex items-center bg-[#3c454d] py-2 pl-4 gap-1 rounded text-sm hover:bg-zinc-600 cursor-pointer       max-md:text-[13px] max-md:pl-3 max-md:pr-1 max-md:w-[48%]'>
            <div className='text-base'>
                {icon}
            </div>
            {text}
        </button>
    )
}

export default RightBtn;