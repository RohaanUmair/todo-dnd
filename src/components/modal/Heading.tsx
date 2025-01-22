import React from 'react'

function Heading({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className='flex items-center'>
            <div className='text-xl'>
                {icon}
            </div>

            <div className='ml-4'>
                <h1 className='text-lg mb-1'>{text}</h1>
            </div>
        </div>
    )
}

export default Heading
