import React from 'react'

const Button = ({title} : {title: string}) => {
    return (
        <button
            className="px-4 py-2 rounded-lg font-semibold bg-background shadow-xl cursor-pointer
          hover:shadow-lg hover:brightness-110 active:scale-[0.97] transition-all"
        >
           {title}
        </button>
    )
}

export default Button