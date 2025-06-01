import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utilis/axiosInstance'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import moment from 'moment'
import AvatarGroup from '../../components/AvatarGroup'
import { LuSquareArrowOutUpRight } from 'react-icons/lu'
import { API_PATHS } from '../../utilis/apiPaths'

const ViewTasksDetails = () => {
  const { id } = useParams()
  const [task, setTask] = useState(null)

  const getStatusTagColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-cyan-100 text-cyan-600 border-cyan-500/10';
      case 'Completed':
        return 'bg-lime-100 text-lime-600 border-lime-500/10';
      default:
        return 'bg-violet-100 text-violet-600 border-violet-500/10';
    }
  }

  // get task info by id
  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id))
      if (response.data) {
        const taskInfo = (response.data);
        setTask(taskInfo);
      };

    } catch (error) {
      console.error("Error fetching task:", error);
    }
  }

  // Update task status
  const updateTaskStatus = async (newStatus) => {
    try {
      const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(id), {
        status: newStatus
      });
      if (response.data) {
        setTask(response.data.task);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  }

  // Check if all todos are completed and update status
  const checkAndUpdateTaskStatus = (todoChecklist) => {
    if (!todoChecklist || todoChecklist.length === 0) return;
    
    const allCompleted = todoChecklist.every(todo => todo.completed);
    if (allCompleted && task.status !== 'Completed') {
      updateTaskStatus('Completed');
    } else if (!allCompleted && task.status === 'Completed') {
      updateTaskStatus('In Progress');
    }
  }

  //handle todo check
  const updateTodoCheckList = async (index) => { 
    const todoChecklist = [...task.todoChecklist];
    const taskId = id;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
      try {
        const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
          {todoChecklist}
        );
        if (response.status === 200) {
          setTask(response.data?.task);
          checkAndUpdateTaskStatus(response.data?.task?.todoChecklist);
        } else {
          // Revert the toggle if the API call fails
          todoChecklist[index].completed = !todoChecklist[index].completed;
        }
      } catch (error) {
        console.error("Error updating todo checklist:", error);
        // Revert the toggle if there's an error
        todoChecklist[index].completed = !todoChecklist[index].completed;
        setTask(prevTask => ({...prevTask, todoChecklist}));
      }
    }
  }

  // handle attachment link click
  const handleAttachmentLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https:// "+ link; // Ensure the link starts with http:// or https://
    }
    window.open(link, '_blank');
  }

  useEffect(() => {
    if (id) {
      getTaskDetailsById()
    }
    return () => { }
  }, [id])

  // Check task status whenever todoChecklist changes
  useEffect(() => {
    if (task?.todoChecklist) {
      checkAndUpdateTaskStatus(task.todoChecklist);
    }
  }, [task?.todoChecklist]);

  return (
    <DashboardLayout activeMenu='My Tasks'>
      <div className='mt-5 min-w-[800px]'>
        {task && (
          <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
            <div className='form-card col-span-3'>
              <div className='flex items-center justify-between'>
                <h2 className='text-sm md:text-xl font-medium flex-shrink-0'>
                  {task?.title}
                </h2>
                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(task?.status)} px-4 py-0.5 rounded flex-shrink-0`}>
                   {task?.status}
                </div>
              </div>

              <div className='mt-4'>
                <InfoBox label="Description" value={task?.description} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className='col-span-6 md:col-span-4'>
                  <InfoBox label="priority" value={task?.priority} />
                </div>

                <div className='col-span-6 md:col-span-4'>
                  <InfoBox label="Due Date" value={task?.dueDate ? moment(task?.dueDate).format("Do MMM YYYY") : 'N/A'} />
                </div>

                <div className='col-span-6 md:col-span-4'>
                  <label className='text-xs font-medium text-slate-500'>Assigned To</label>
                  <div className='flex-shrink-0'>
                    <AvatarGroup
                      avatars={
                        task?.assignedTo?.map((item) => item?.profileImageUrl) || []
                      }
                      maxVisible={5}
                    />
                  </div>
                </div>
              </div>

              <div className='mt-2'>
                <label className='text-xs font-medium text-slate-500'>Todo Checklist</label>
                <div className='space-y-1'>
                  {task?.todoChecklist?.map((item, index) => (
                    <TodoChecklist
                      key={`todo-${index}`}
                      text={item.text}
                      isChecked={item.completed}
                      onChange={() => updateTodoCheckList(index)}
                    />
                  ))}
                </div>
              </div>

              {task?.attachments?.length > 0 && (
                <div className='mt-4'>
                  <label className='text-xs font-medium text-slate-500'>Attachments</label>
                  <div className='space-y-2'>
                    {task?.attachments?.map((link, index) => (
                      <Attachment
                        key={`attachment-${index}`}
                        link={link}
                        index={index}
                        onClick={() => handleAttachmentLinkClick(link)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ViewTasksDetails

const InfoBox = ({ label, value }) => {
  return  (
    <>
      <label className='text-xs font-medium text-slate-500'>{label}</label>
      <p className='text-[12px] md:text:text-[13px] font-medium text-gray-700 mt-0.5'>{value}</p>
    </>
  )
}

const TodoChecklist = ({ text, isChecked, onChange }) => {
  return <div className='flex items-center gap-2 p-3'>
    <input type="checkbox"
      checked={isChecked} 
      onChange={onChange}
      className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none ' />
    
    <p className='text-[13px] text-gray-800'>
      {text}</p>
  </div>
}

const Attachment = ({ link, onClick, index }) => {
  return <div className='flex justify-between px-3 py-2 border border-gray-100 rounded-md mb-3 mt-2 cursor-pointer'
    onClick={onClick}>
    <div className='flex-1 flex items-center gap-3'>
      <span className='text-xs text-gray-500 font-semibold mr-2'>
        {index < 9 ? `0${index + 1}` : index + 1}
      </span>
      <p className='text-xs text-black'>{link}</p>
    </div>
    <LuSquareArrowOutUpRight className='text-gray-400' />
  </div>
}