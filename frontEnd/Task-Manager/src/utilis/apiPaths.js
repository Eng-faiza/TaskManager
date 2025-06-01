export const BASE_URL ="https://taskmanager-backend-85jr.onrender.com";

// utils /apiPaths.js
export const API_PATHS={
    AUTH:{
        REGISTER:"/api/auth/register", // register new user (admin or member)
        LOGIN:"/api/auth/login" , //authentication user 8 return jwt token
        GET_PROFILE:"/api/auth/profile", // get logged-in user details
    },
    USERS:{
        GET_ALL_USERS:"/api/users", // get all users (admin only)
        GET_USER_BY_ID:(userId)=>`/api/users/${userId}` ,// GET USER BY ID 
        CREATE_USER:"/api/users", // create user (admin only)
        UPDATE_USER:(userId)=>`/api/users/${userId}`,
        DELETE_USER:(userId)=>`/api/users/${userId}`
    },
    TASKS:{
        GET_DASHBOARD_DATA:"api/tasks/dashboard-data", // get dashboard data
        GET_USER_DASHBOARD_DATA:"/api/tasks/user-dashboard-data ", //get user dashboard 
        GET_ALL_TASKS:"/api/tasks", // get all tasks 
        GET_TASK_BY_ID:(taskId)=>`/api/tasks/${taskId}` ,// GET task BY ID 
        CREATE_TASK:"/api/tasks", // create task (admin only)
        UPDATE_TASK:(taskId)=>`/api/tasks/${taskId}`,
        DELETE_TASK:(taskId)=>`/api/tasks/${taskId}`,
        UPDATE_TASK_STATUS:(taskId)=>`/api/tasks/${taskId}/status`, // update task status 
        UPDATE_TODO_CHECKLIST:(taskId)=>`/api/tasks/${taskId}/todo`, //update task todo checklist 
    },

    REPORTS:{
        EXPORT_TASKS:"/api/reports/export/tasks",  // dowload all tasks an excel/pdf report 
        EXPORT_USERS:"/api/reports/export/users"  // dowload all users-task report  
    },

    IMAGE:{
        UPLOAD_IMAGE :"api/auth/upload-image",
    }

}

