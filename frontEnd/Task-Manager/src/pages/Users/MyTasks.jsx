import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utilis/axiosInstance'
import { API_PATHS } from '../../utilis/apiPaths'
import TaskStatusTabs from '../../components/TaskStatusTabs'
import TaskCard from '../../Cards/TaskCard'

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([])
  const [tabs, setTabs] = useState([])
  const [filterStatus, setFilterStatus] = useState("All")
  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      // map statusSummary data with fixed labels and order
      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTask || 0 },
        { label: "Completed", count: statusSummary.completedTask || 0 }
      ];
      setTabs(statusArray);
    }
    catch (error) {
      console.log("Error fetching tasks:", error);
    }
  }

  const handleClick = (taskId) => {
    navigate(`/user/tasks-details/${taskId}`)
  }

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu='My Tasks'>
      <div className='my-5 min-w-[800px]'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
          <h2 className='text-xl md:text-xl font-medium flex-shrink-0'>My Tasks</h2>
          <div className='flex-shrink-0'>
            {allTasks.length > 0 && (
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
          {allTasks.map((item) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}  
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map(user => user.profileImageUrl)}
              attachmentCount={item.attachments?.length || 0}
              CompletedToDoCount={item.todoChecklist?.filter(todo => todo.completed)?.length || 0}
              todoChecklist={item.todoChecklist || []}
              onClick={() => handleClick(item._id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyTasks
