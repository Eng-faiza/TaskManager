import React, { useState } from 'react'
import {HiMiniPlus, HiOutlineTrash} from "react-icons/hi2"

const TodoListInput = ({todoList = [], setTodoList}) => {
    const [option, setOption] = useState("")

    const handleAddOption = (e) => {
        e?.preventDefault(); // Handle both button click and form submit
        if(option.trim()){
            if(!todoList.includes(option.trim())) {
                setTodoList([...todoList, option.trim()]);
                setOption("");
            }
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddOption(e);
        }
    }

    const handleDeleteOption = (index) => {
        const updatedArr = todoList.filter((_, idx) => idx !== index);
        setTodoList(updatedArr);
    };

    return (
        <div>
            {todoList.map((item, index) => (
                <div
                key={`todo-${index}`}
                className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3'
                >
                    <p className='text-xs text-black'>
                        <span className='text-xs text-gray-400 font-semibold mr-2'>
                            {index < 9 ? `0${index + 1}` : index + 1}
                        </span>
                        {item}
                    </p>

                    <button
                    type="button"
                    className='cursor-pointer hover:bg-red-50 p-1 rounded-full transition-colors'
                    onClick={() => handleDeleteOption(index)}
                    >
                        <HiOutlineTrash className='text-lg text-red-500'/>
                    </button>
                </div>
            ))}
            <form onSubmit={handleAddOption} className='flex items-center gap-5 mt-4'>
                <input 
                    type="text"
                    placeholder='Enter Task'
                    value={option}
                    onChange={({target}) => setOption(target.value)}
                    onKeyPress={handleKeyPress}
                    className='w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md focus:border-primary focus:ring-1 focus:ring-primary'
                />
                <button 
                    type="submit"
                    className='card-btn text-nowrap' 
                    disabled={!option.trim()}
                >
                    <HiMiniPlus className='text-lg' /> Add
                </button>
            </form>
        </div>
    )
}

export default TodoListInput