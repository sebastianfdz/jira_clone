"use client";
import { type ReactNode } from "react";
import { toast as _toast, Toaster } from "react-hot-toast";
import {
  BsCheckCircleFill,
  BsX,
  BsFillExclamationCircleFill,
} from "react-icons/bs";

type ToastProps = {
  message: string;
  description: string;
};

export default Toaster;

export const toast = {
  success: (props: ToastProps) => {
    _toast.custom(() => (
      <ToastContainer {...props}>
        <BsCheckCircleFill className="w-fit pr-4 text-2xl text-green-600" />
      </ToastContainer>
    ));
  },
  error: (props: ToastProps) => {
    _toast.custom(() => (
      <ToastContainer {...props}>
        <BsFillExclamationCircleFill className="w-fit pr-4 text-2xl text-red-600" />
      </ToastContainer>
    ));
  },
};

const ToastContainer: React.FC<{
  children: ReactNode;
  message: string;
  description?: string;
}> = ({ children, message, description = "" }) => {
  return (
    <div className="flex w-96 justify-between rounded-sm border-[0.3px] bg-white p-4 shadow-lg ">
      {children}
      <div className="flex w-full flex-col gap-y-3">
        <span className="text-sm font-semibold text-gray-600">{message}</span>
        <span className="text-sm text-gray-500">{description}</span>
      </div>
      <button onClick={() => _toast.remove()} className="flex flex-col">
        <BsX className="text-3xl" />
      </button>
    </div>
  );
};
