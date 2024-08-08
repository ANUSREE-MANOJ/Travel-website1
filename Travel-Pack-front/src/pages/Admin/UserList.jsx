import { useEffect, useRef, useState } from "react";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from "../../redux/api/userSlice";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserType, setEditableUserType] = useState("");
  const selectRef = useRef(null); // Reference for the dropdown

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.value = editableUserType;
    }
    console.log("Current editableUserType:", editableUserType);
  }, [editableUserType]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, userType) => {
    console.log("Toggling edit for user:", id, "with userType:", userType);
    setEditableUserId(id);
    setEditableUserType(userType);
  };

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    console.log("Selected value:", newValue);
    setEditableUserType(newValue);
  };

  const updateHandler = async (id) => {
    console.log("Updating user with ID:", id, "and editableUserType:", editableUserType);
    try {
      await updateUser({
        userId: id,
        userType: editableUserType,
      }).unwrap();
      setEditableUserId(null);
      setEditableUserType(""); 
      refetch();
      toast.success('successfully updated')
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center mt-20">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-600">Error: {error.message}</p>
      ) : (
        <div className="flex flex-col md:flex-row">
          <table className="w-full md:w-4/5 mx-auto mt-16">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">USER TYPE</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2 text-left">{user._id}</td>
                  <td className="px-4 py-2 text-left">{user.username}</td>
                  <td className="px-4 py-2 text-left">{user.email}</td>
                  <td className="px-4 py-2 text-left">
                    {user.isAdmin ? (
                      <p>Admin</p>
                    ) : editableUserId === user._id ? (
                      <div className="flex items-center">
                        <select
                          ref={selectRef}
                          onChange={handleSelectChange}
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="user">User</option>
                          <option value="agent">Agent</option>
                        </select>
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-blue-500 py-2 px-4 rounded-lg"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <p>{user.userType}</p>
                        <button
                          onClick={() =>
                            toggleEdit(user._id, user.userType)
                          }
                        >
                          <FaEdit className="ml-[1rem]" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 flex justify-end">
                    {!user.isAdmin && (
                      <div className="flex">
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 font-bold py-2 px-4 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
