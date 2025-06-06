import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { PRIORITY_DATA } from '../../utilis/data'
import axiosInstance from '../../utilis/axiosInstance'
import { API_PATHS } from '../../utilis/apiPaths'
import toast from "react-hot-toast"
import { useLocation,useNavigate } from 'react-router-dom'
import moment from 'moment'
import { LuTrash, LuTrash2 } from 'react-icons/lu'
import SelectDropdown from '../../components/Inputs/SelectDropdown'
import { SelectUsers } from '../../components/Inputs/SelectUsers'
import TodoListInput from '../../components/Inputs/TodoListInput'
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput'
import DeleteAlert from '../../components/DeleteAlert '
import Model from '../../components/Model'
const CreateTask = () => {
 const  location =useLocation();
 const {taskId}=location.state || {};
 const navigate=useNavigate();

 const [taskData,setTaskData]=useState({
  title:"",
  description:"",
  priority:"",
  dueDate:null,
  assignedTo:[],
  todoChecklist:[],
  attachments:[],
 });
 const [currentTask,setCurrentTask] =useState(null);
 const [error,setError]=useState("");
 const [loading, setLoading]= useState(false);
 const [openDeleteAlert,setOpenDeleteAlert ] = useState(false);

 const handleValueChange=(key,value)=>{
  setTaskData((prevData)=>({...prevData,[key]:value}));
 }

 const clearData=()=>{
  //reset form
  setTaskData({
    title:"",
    description:"",
    priority:"",
    dueDate:null,
    assignedTo:[],
    todoChecklist:[],
    attachments:[],
  })
 }

 // create task
 const CreateTask =async()=>{
  setLoading(true)
  try{
    const todoList=taskData.todoChecklist?.map((item)=>({
      text:item,
      completed:false,
    }))
    const response =await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK,{
      ...taskData,
      dueDate:new Date (taskData.dueDate).toISOString(),
      todoChecklist:todoList,
      attachments: taskData.attachments,
    });

    toast.success("Task created successfully ");
    clearData()
    navigate("/admin/tasks")

  }catch(error){
    console.log("Error creating task:", error)
    toast.error("Failed to create task")
    setLoading(false)
  } finally{
    setLoading(false)
  }

 }

 //update task
 const updateTask = async()=>{
  setLoading(true);
  try {
    const todoList=taskData.todoChecklist?.map((item)=>{
     const preventTodoChecklist = currentTask?.todoChecklist || [];
     const matchedTask = preventTodoChecklist.find((task) => task.text == item);

     return {
        text: item,
        completed: matchedTask ? matchedTask.completed : false,
     }

    })

    

    const response =await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId),{
      ...taskData,
      dueDate:new Date (taskData.dueDate).toISOString(),
      todoChecklist:todoList,
      attachments: taskData.attachments,
    });

    toast.success("Task updated successfully ");
    navigate("/admin/tasks") 
    
  } catch (error) {
    console.log("Error updating task:", error);
    toast.error("Failed to update task")
    setLoading(false);
  } finally {
    setLoading(false);
  }
 }

 const handleSubmit=async ()=>{
  setError(null)

  //input validation
  if(!taskData.title.trim()){
    setError("Title is required.")
    return
  }
  if(!taskData.description.trim()){
    setError("Description is required.")
    return
  }
  if(!taskData.dueDate){
    setError("DueDate is required.")
    return
  }
  if(taskData.assignedTo.length === 0){
    setError("Task not assigned to any member.")
    return
  }
  if(taskData.todoChecklist.length === 0){
    setError("Add at least one todo task.")
    return
  }
  if(taskId){
    updateTask()
    return
  }
 
  CreateTask()
 }
// get task info by id 
const getTaskDetailsByID=async()=>{
  try {
    const response =await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId))
    if(response.data){
      const taskInfo=response.data;
      setCurrentTask(taskInfo);
      setTaskData((prevState)=>({
        title:taskInfo.title,
        description:taskInfo.description,
        priority:taskInfo.priority,
        dueDate:taskInfo.dueDate
        ? moment (taskInfo.dueDate).format("YYYY-MM-DD")
        :null,
        assignedTo:taskInfo?.assignedTo?.map((item)=>item?._id)|| [],
        todoChecklist:
        taskInfo?.todoChecklist?.map((item)=>item?.text) || [],
        attachments:taskInfo?.attachment || [],
         
      }))
    }
    
  } catch (error) {
    console.log("error fetching users", error);
    
    
  }
}

//delete Task
const deleteTask =async()=>{
  try {
    await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
    setOpenDeleteAlert(false);
    toast.success("expense detail deleted successfully");
    navigate("/admin/tasks")
  } catch (error) {
    console.log("Error deleting task:", error.response?.data || error.message);
  }
}
  
useEffect(()=>{
  if(taskId){
    getTaskDetailsByID(taskId)
  }
  return ()=>{}
},[taskId])


return (
    <DashboardLayout activeMenu="Create Task">
      <div className='mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-4 mt-4 min-w-[800px]'>
          <div className='form-card col-span-3'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-xl font-medium flex-shrink-0'>
                {taskId? "Update Task ":"Create Task"}
              </h2>

              {taskId && (
                <button
                className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer flex-shrink-0'
                onClick={()=>setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className='text-base'/> Delete
                </button>
              )}
            </div>

            <div className='mt-4'>
              <label className='text-xs font-medium text-slate-600'>
                Task Title
              </label>

              <input 
              placeholder='Create App UI'
              className='form-input'
              value={taskData.title}
              onChange={({target})=>
                handleValueChange ("title",target.value)
              }
               />
            </div>

              <div className='mt-3'>
                <label  className='text-xs font-medium text-slate-600'>
                Description
                </label>

                <textarea 
                placeholder='Describe Task'
                className='form-input'
                rows={4}
                value={taskData.description}
                onChange={({target})=>
                  handleValueChange("description", target.value)
                
                }
                
                >

                </textarea>
              </div>

              <div className='grid grid-cols-12 gap-4 mt-2'>
                <div className='col-span-6 md:col-span-4'>
                  <label className='text-xs font-medium text-slate-600'>
                    Priority
                  </label>

                  <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value)=>
                  handleValueChange("priority",value)
                  }
                   placeholder="Select Priority"
                  />
                </div>

                  <div className='col-span md:col-span-4'>
                    <label className=' text-xs font-medium text-slate-600'>
                      Due Date
                    </label>
                    <input 
                    placeholder='Create App IU'
                    className='form-input'
                    value={taskData.dueDate || ""}
                    onChange={({target})=>
                      handleValueChange("dueDate",target.value)
                    
                    }
                    type='date'
                     />

                  </div>

                  <div className='col-span-12  md:col-span-3'>
                    <label className=' text-xs font-medium text-slate-600'>
                      Assigned To
                    </label>
                    <SelectUsers 
                    SelectedUsers={taskData.assignedTo}
                    setSelectedUsers={(value)=>{
                      handleValueChange("assignedTo",value)
                    }}
                   
                     />

                  </div>


              </div>

              <div className='mt-3'>
                <label className=' text-xs font-medium text-slate-600'>
                  TODO Checklist
                </label>
                <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value)=>
                  //  checklist=checkList :  took me time finding it
                  handleValueChange("todoChecklist",value)
                }
                />
              </div>

              <div className='mt-3'>
                <label className='text-xs font-medium text-slate-600'> Add Attachments</label>
                <AddAttachmentsInput
                  attachments={taskData?.attachments || []}
                  setAttachments={(value) =>
                    handleValueChange("attachments", value)
                  }
                />
              </div>

              {error &&(
                <p className=' text-xs font-medium text-red-500 mt-5'>{error}</p>
              )}

              <div className='flex justify-end mt-7 '>
                <button 
                className='add-btn'
                onClick={handleSubmit}
                disabled={loading}
                >
                  {taskId ? "UPDATED  TASK ": "CREATE TASK"}
                </button>
              </div>

          </div>
        </div>
      </div>

      <Model
        isOpen={openDeleteAlert}
       onClose={()=>setOpenDeleteAlert(false)} 
       title="Delete Task" 
       >
        <DeleteAlert 
        content="Are you sure you want to delete this task?"
        onDelete={() => deleteTask()}/>
      </Model>

    </DashboardLayout>
  )
}

export default CreateTask