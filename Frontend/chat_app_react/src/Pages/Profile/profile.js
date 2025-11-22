import react from "react";
import MainContent from "../../Components/MainLayout/mainLayout";
import {
  ArrowDownOnSquareStackIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PencilIcon,
  PhoneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import SearchInput from "../../Components/Search/searchinput";
import { useDispatch, useSelector } from "react-redux";
import default_avatar from "../../Assets/images/default_avatar.png";
import Logout from "../../Logout/Logout";
import { logout } from "../../Store/authSlice";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../Store/UserSlice";
import { useState } from "react";
import { API } from "../../Api/Axios";
import Spinner from "../../Utils/loadingspinner";
import Swal from "sweetalert2";
import { updateProfilePicture } from "../../Store/UserSlice";
import { Base_Url } from "../../Api/ApiUtils";

const ProfilePage = () => {
  return (
    <div className="profileContent">
      <MainContent
        title={"Profile"}
        leftContent={<ProfileLeft />}
        rightContent={<ProfileRight />}
      />
    </div>
  );
};
export default ProfilePage;

const ProfileRight = () => {
  return (
    <div className="profileRight h-screen flex flex-col items-center justify-center gap-4">
      <div className="icon">
        <UserCircleIcon className="w-20 h-20" />
      </div>
      <div className="title text-2xl">
        <h1>Profile</h1>
      </div>
    </div>
  );
};


const ProfileLeft = () => {
  const user = useSelector((state) => state.user.user);
  console.log("User Data in ProfileLeft:", user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const userDetails = [
    { id: 1, content: user?.username || "Name", icon: UserCircleIcon },
    { id: 2, content: user?.email || "Email", icon: EnvelopeIcon },
    { id: 3, content: "phone", icon: DevicePhoneMobileIcon },
    { id: 4, content: "Website", icon: GlobeAltIcon },
  ];

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile){
      Swal.fire({
                icon: 'warning',
                title: 'No File Selected',
                text: 'Please choose an image file to upload.',
                confirmButtonColor: '#3085d6'
              });
              return;
            } 
              
    setIsUploading(true);

    const formData = new FormData();
    formData.append("profile_picture", selectedFile);
    try {
      const response = await API.patch("/user/update-profile-pic/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Profile picture updated successfully:", response.data.data);
      const newProfilePicUrl = response.data.data.profile_picture; 
      const urlobject = new URL(newProfilePicUrl, Base_Url);
      const actualUrl = urlobject.href;

        console.log("New Profile Picture URL:", actualUrl);
        dispatch(updateProfilePicture(actualUrl));
      Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Profile picture updated successfully!',
                timer: 3000, // Auto-close after 3 seconds
                showConfirmButton: false
            });
    } catch (error) {
      console.log("Error updating profile picture:", error);  
      let errorMessage = "Error updating profile picture.";
            if (error.response && error.response.data && error.response.data.detail) {
                errorMessage = error.response.data.detail;
            }

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
                confirmButtonColor: '#d33'
            });
    }finally {
      setIsUploading(false);
    }
    

    setShowForm(false);
    setSelectedFile(null);
    // Optionally refresh user data here
  };

  return (
    <div className="profileLeft">
      <div className="profilePic relative h-40 bg-[var(--color-accent)]">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="avatar relative">
            <img
              src={user?.profile_picture || default_avatar}
              alt={user?.name || "User Avatar"}
              className="w-32 h-32 rounded-full object-cover border-4 border-[var(--color-border)] shadow-lg bg-white"
            />

            {/* Edit Button Overlay */}
            <button
              onClick={() => setShowForm(true)}
              className="absolute top-2 right-2 bg-[var(--color-bg)] text-[var(--color-text)] p-2 py-1 rounded-full text-xs shadow-md hover:bg-[var(--color-accent-dark)] "
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300">
  {/* Modal Content Container: Styled for modern look */}
  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl w-full max-w-sm transform transition-transform duration-300 scale-100 border border-gray-200 dark:border-gray-700">
    
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
      Update Profile Picture
    </h2>
    
    <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
      
      {/* File Input: Styled for better UX */}
      <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-indigo-500 transition duration-200">
        <label className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">
          Choose an image file
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden" // Hides the default file input style
          />
        </label>
      </div>

      {/* Action Buttons: Grouped and restyled */}
      <div className="flex space-x-3 pt-2">
        {/* Cancel Button (Secondary Action) */}
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-300 transition duration-150"
        >
          Cancel
        </button>
        
        {/* Upload Button (Primary Action) */}
        <button
          type="submit"
          className="flex-1 bg-[var(--color-accent-dark)] text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-indigo-700 transition duration-150 shadow-md shadow-indigo-500/50"
        >
          Upload Photo
        </button>
      </div>
      <div className="error-message">
        {isUploading &&(
          <Spinner/>
        )
        }
      </div>
    </form>
  </div>
</div>
      )}

      {/* User Details List */}
      <div className="listItems mt-20 ">
        <ul className="mx-1 flex flex-col gap-2 mb-10 ">
          {userDetails.map((user, index) => (
            <li
              key={index}
              className="p-2.5 bg-[var(--color-glass)] rounded-2xl hover:shadow-lg transition-shadow duration-300"
            >
              <div className="item flex gap-4 items-center text-[var(--color-text)]">
                <div className="icon flex items-center justify-center w-12 h-12 bg-[var(--color-glass)] text-[var(--color-accent)] rounded-full shadow-inner">
                  {user.icon && <user.icon className="w-6 h-6" />}
                </div>
                <div className="details flex flex-col gap-1 text-left">
                  <h2 className="text-[var(--color-text)]">{user.content}</h2>
                  <p className="text-[var(--color-text-small)] text-sm">{user.text}</p>
                </div>
                <div className="editbutton mx-3 ml-auto ">
                  <PencilIcon className="w-6 h-6 cursor-pointer" />
                </div>
              </div>
            </li>
          ))}
          <li
            className="p-2.5 bg-[var(--color-bg-tra)] rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => {
              dispatch(clearUser());
              navigate("/", { replace: true });
            }}
          >
            <div className="item flex gap-4 items-center">
              <div className="icon flex items-center justify-center w-12 h-12 bg-red-900 text-white rounded-full shadow-inner">
                <ArrowDownOnSquareStackIcon className="w-6 h-6" />
              </div>
              <div className="details flex flex-col gap-1 text-left">
                <h2 className="font-bold text-lg text-red-600">Logout</h2>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};




const sweetAlertStyle = {
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  confirmButtonColor: 'var(--color-accent-dark)',
  cancelButtonColor: 'var(--color-accent)',
};
