import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
    sortable: true,
    width: "450px"
    
  },
  {
    name: "Action",
    selector: (row) => row.action,
  },
];

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Do you want to delete?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/department/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log(response.data);
        if (response.data.success) {
          onDepartmentDelete(id);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        className="flex items-center gap-1 px-2 py-1 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition"
        onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
      >
        <FaEdit size={14} />
        Edit
      </button>
      <button
        className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
        onClick={() => handleDelete(_id)}
      >
        <FaTrash size={14} />
        Delete
      </button>
    </div>
  );
};
