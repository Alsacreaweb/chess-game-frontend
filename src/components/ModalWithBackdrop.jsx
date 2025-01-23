import { createPortal } from "react-dom";

const ModalWithBackdrop = ({ message, buttons, children }) => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm z-50"></div>
      {createPortal(
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-60">
          {children}{" "}
          <div className="bg-white flex flex-col gap-3 p-8 rounded-lg shadow-md z-10">
            <p className="text-2xl">{message}</p>
            <div className="flex w-full justify-center gap-2">{buttons}</div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ModalWithBackdrop;
