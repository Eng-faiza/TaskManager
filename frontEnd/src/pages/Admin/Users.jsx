import React, { useState } from 'react';
import { HiMiniPlus } from 'react-icons/hi2';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserCard from '../../components/UserCard';
import Model from '../../components/Model';
import AddUserForm from '../../components/AddUserForm';
import DeleteAlert from '../../components/DeleteAlert';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleDeleteUser = (id) => {
    // Implement the logic to delete a user
  };

  const deleteUser = () => {
    // Implement the logic to delete a user
  };

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className='my-5 min-w-[800px]'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl md:text-xl font-medium flex-shrink-0'>Team Members</h2>
          <button
            className='card-btn-fill flex-shrink-0'
            onClick={() => setOpenAddUserModal(true)}
          >
            <HiMiniPlus className='text-lg' /> Add Member
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
          {users.map((user) => (
            <UserCard
              key={user._id}
              name={user.name}
              email={user.email}
              role={user.role}
              profileImageUrl={user.profileImageUrl}
              onDelete={() => handleDeleteUser(user._id)}
            />
          ))}
        </div>
      </div>

      <Model
        isOpen={openAddUserModal}
        onClose={() => setOpenAddUserModal(false)}
        title="Add Member"
      >
        <AddUserForm onClose={() => setOpenAddUserModal(false)} />
      </Model>

      <Model
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Member"
      >
        <DeleteAlert
          content="Are you sure you want to delete this member?"
          onDelete={deleteUser}
        />
      </Model>
    </DashboardLayout>
  );
};

export default Users; 