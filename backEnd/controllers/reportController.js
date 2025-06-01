const excelJS = require("exceljs");
const User = require("../models/User");
const Task = require("../models/Task");

const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id").lean();
        const userTasks = await Task.find().populate("assignedTo", "name email _id");

        const userTaskMap = {};
        users.forEach(user => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        userTasks.forEach(task => {
            if (Array.isArray(task.assignedTo)) {
                task.assignedTo.forEach(assignedUser => {
                    if (userTaskMap[assignedUser._id]) {
                        userTaskMap[assignedUser._id].taskCount += 1;
                        if (task.status === "Pending") {
                            userTaskMap[assignedUser._id].pendingTasks += 1;
                        } else if (task.status === "In Progress") {
                            userTaskMap[assignedUser._id].inProgressTasks += 1;
                        } else if (task.status === "Completed") {
                            userTaskMap[assignedUser._id].completedTasks += 1;
                        }
                    }
                });
            }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User Task Report");

        worksheet.columns = [
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
            { header: "Pending Tasks", key: "pendingTasks", width: 20 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            { header: "Completed Tasks", key: "completedTasks", width: 20 },
        ];

        Object.values(userTaskMap).forEach(user => {
            worksheet.addRow(user);
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", 'attachment; filename="users_report.xlsx"');

        return workbook.xlsx.write(res).then(() => res.end());

    } catch (err) {
        console.error("Export Error:", err)
        res.status(500).json({ message: "error exporting tasks", error: err.message });
    }
};

const exportTasksReport = async (req, res) => {
    try {
        // Placeholder, implement your export logic here
        res.status(200).json({ message: "exportTasksReport not implemented yet" });
    } catch (err) {
        res.status(500).json({ message: "error exporting tasks report", error: err.message });
    }
};

module.exports = {
    exportUsersReport,
    exportTasksReport,
};
