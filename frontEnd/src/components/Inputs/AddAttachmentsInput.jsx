import React, { useState } from 'react'
import {HiMiniPlus, HiOutlineTrash} from "react-icons/hi2"
import { LuPaperclip } from 'react-icons/lu'

const AddAttachmentsInput = ({attachments = [], setAttachments}) => {
    const [option, setOption] = useState("");
    const [error, setError] = useState("");

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    const handleAddOption = (e) => {
        e?.preventDefault();
        setError("");
        
        const url = option.trim();
        if (!url) return;

        // Check if URL is valid or make it valid
        let validUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            validUrl = `https://${url}`;
        }

        if (!isValidUrl(validUrl)) {
            setError("Please enter a valid URL");
            return;
        }

        if (!attachments.includes(validUrl)) {
            setAttachments([...attachments, validUrl]);
            setOption("");
            setError("");
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddOption(e);
        }
    }

    const handleDeleteOption = (index) => {
        const updatedArr = attachments.filter((_, idx) => idx !== index);
        setAttachments(updatedArr);
    };

    return (
        <div>
            {attachments.map((item, index) => (
                <div
                    key={`attachment-${index}`}
                    className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3'
                >
                    <div className='flex-1 flex items-center gap-3 overflow-hidden'>
                        <LuPaperclip className='text-gray-400 flex-shrink-0'/>
                        <p className='text-xs text-black truncate'>{item}</p>
                    </div>

                    <button
                        type="button"
                        className='cursor-pointer hover:bg-red-50 p-1 rounded-full transition-colors flex-shrink-0'
                        onClick={() => handleDeleteOption(index)}
                    >
                        <HiOutlineTrash className='text-lg text-red-500'/>
                    </button>
                </div>
            ))}
            
            <form onSubmit={handleAddOption} className='flex items-center gap-5 mt-4'>
                <div className='flex-1'>
                    <div className='flex items-center gap-3 border border-gray-100 rounded-md px-3'>
                        <LuPaperclip className='text-gray-400'/>
                        <input 
                            type="text" 
                            placeholder='Add File Link'
                            value={option}
                            onChange={({target}) => {
                                setOption(target.value);
                                setError("");
                            }}
                            onKeyPress={handleKeyPress}
                            className='w-full text-[13px] text-black outline-none bg-white py-2'
                        />
                    </div>
                    {error && <p className='text-xs text-red-500 mt-1'>{error}</p>}
                </div>

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

export default AddAttachmentsInput