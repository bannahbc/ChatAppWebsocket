import { useState } from "react";

const MainContent = ({ title,leftContent, rightContent }) => {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="mainBody flex flex-1 h-[calc(100vh-4rem)] w-full">
      {/* Left Side */}
      <div
        className={`relative w-full  md:w-96  border-r border-[var(--color-border)] ${
          selectedContact ? "hidden" : "block"
        } lg:block h-full overflow-y-auto overflow-x-hidden`}
      >
        <div className="title p-4  sticky top-0 z-10 bg-[var(--color-bg)]">
            <h2 className="text-xl font-bold text-[var(--color-primary)]">{title}</h2>
        </div>
        {/* <div className="serachSection bg-[var(--color-bg)] sticky top-0 p-3 border-b border-[var(--color-border)]">

        <SearchInput onChange={(e) => console.log(e.target.value)} />
        </div> */}
            {/* <hr className="border-r border-[var(--color-border)] mt-1" /> */}


        <div className="leftSideContent">
        {/* <div className="leftSideContent mt-2 mx-3"> */}

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

export default MainContent;