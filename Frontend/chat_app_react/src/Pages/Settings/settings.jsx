import React, { useState } from "react";
import { ArrowDownOnSquareIcon, ArrowRightCircleIcon,  ArrowRightEndOnRectangleIcon,  BellAlertIcon,  HeartIcon, LockClosedIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import default_avatar from '../../Assets/images/default_avatar.png'
import { Link, Navigate, useNavigate } from "react-router-dom";
import { clearUser } from "../../Store/UserSlice";
export function Settings() {
  return (
    <MainContent
      leftContent={<SettingsLeft/>}
      rightContent={<SettingsRight/>}
    />
  );
}
const SettingsRight=()=>{
    return(
        <div className="settingRight h-screen flex flex-col items-center justify-center gap-4">
            <div className="icon">
                <Cog6ToothIcon className="w-20 h-20"/>
            </div>
            <div className="title text-2xl">
                <h1>Settings</h1>
            </div>
        </div>
    )
}

const SettingsLeft=()=>{
    const user = useSelector((state)=>state.user.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sideItems = [
        {
            id:1,
            title:"Account",
            icon:HeartIcon,
            description:"account info ,security notification,"
        },
        {
            id:2,
            title:"Privacy",
            description:"Blocked Contents , etc",
            icon:LockClosedIcon
        },
        {
            id:8,
            title:"Notification",
            description:"message notifications",
            icon:BellAlertIcon
        },
        {
            id:9,
            title:"Help",
            description:"Blocked Contents , etc",
            icon:QuestionMarkCircleIcon
        },
        {
            id:10,
            title:"Logout",
            description:"Help Center",
            icon:ArrowRightEndOnRectangleIcon,
            action:()=>{
              dispatch(clearUser());
              navigate('/')
            }
        }
        
    ]
    return(
        <div className="settingsLeftItems">
            <Link to={'/profile'} className="userProfile flex items-center gap-3  p-3.5 rounded mb-2 hover:bg-[var(--color-bg-tra)] transition-shadow duration-300">
                <div className="avatar">
                    <img
              src={user?.avatar || default_avatar}
              alt={user?.name || "User Avatar"}
              className="w-16 h-16 rounded-full object-cover border-4 border-[var(--color-border)] shadow-lg bg-white"
            />
                </div>
                <p>{user?.username || "User"}</p>
            </Link>
            <hr  className="mb-4"/>
            <ul className="flex flex-col gap-3 mb-6">
                {
                    sideItems.map((item)=>{
                        return(

                <li key={item.id} onClick={item.action} className="flex items-center gap-6 bg-[var(--color-bg-tra)] hover:bg-[var(--color-glass)] rounded-xl p-3 hover:shadow-md cursor-pointer">
                    <div className="icon">
                        {item.icon && <item.icon className="h-6 w-6 font-bold" />}
                    </div>
                    <div className="settingsList flex flex-col">
                        <div className="title text-md">
                            <h3 className="text-[var(--color-text)]">{item.title}</h3>
                        </div>
                        <div className="small-title text-[var(--color-text-small)] text-sm">
                            <p>{item.description}</p>
                        </div>
                    </div>
                </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

const MainContent = ({ leftContent, rightContent }) => {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="mainBody flex flex-1 h-[calc(100vh-4rem)] w-full">
      {/* Left Side */}
      <div
        className={`relative w-full  md:w-96  border-r border-[var(--color-border)] ${
          selectedContact ? "hidden" : "block"
        } lg:block h-full overflow-y-auto overflow-x-hidden`}
      >
        <div className="serachSection bg-[var(--color-bg)] sticky top-0 p-3 border-b border-[var(--color-border)]">

        <SearchInput onChange={(e) => console.log(e.target.value)} />
            {/* <hr className="border-r border-[var(--color-border)] mt-1" /> */}
        </div>


        <div className="leftSideContent mt-2 mx-3">

        {leftContent}
        </div>
      </div>

      {/* Right Side */}
      <div
        className={`flex-1 flex flex-col lg:flex h-full overflow-y-auto overflow-x-hidden`}
      >
        {rightContent}
      </div>
    </div>
  );
};


const SearchInput = ({ placeholder = "Search...", onChange }) => {
  return (
    <div className="  max-w-sm rounded-2xl">
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all duration-200"
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--color-text)] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z" />
      </svg>
    </div>
  );
};
