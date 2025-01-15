import React from 'react'

function InputSection() {
    return (
        <form className="flex justify-center items-center gap-5 w-screen mt-12" onSubmit={(e) => handleSubmit(e, input)}>
            <input className="outline-none py-4 w-96 rounded px-5" placeholder="Type Something..." type="text" value={input} onChange={(e) => setInput(e.target.value)} />

            <select onChange={(e) => setSelected(e.target.value)} className="w-24 outline-none h-14 rounded px-2" >
                {
                    otherCards.map((card, index) => {
                        return <option key={index} value={card.heading}>{card.heading}</option>
                    })
                }
            </select>

            <button type="submit" className="py-4 px-8 bg-green-500 rounded text-white font-bold">Add</button>
        </form>
    )
}

export default InputSection;