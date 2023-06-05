import {
  Modal,
  ModalCancel,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
} from "@/components/ui/alert-modal";
import { Button } from "@/components/ui/button";
import { IoWarning } from "react-icons/io5";

const AlertModal: React.FC<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
}> = ({ title, description, actionText, onAction, isOpen, setIsOpen }) => {
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <div className="flex items-center gap-x-2">
            <IoWarning className="text-xl text-red-600" />
            <ModalTitle>{title}</ModalTitle>
          </div>
          <ModalDescription>
            <BoldDescription description={description} />
          </ModalDescription>
          <div className="mt-5 flex items-center justify-end gap-x-3">
            <Button
              customColors
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={onAction}
            >
              {actionText}
            </Button>
            <ModalCancel>
              <Button
                customColors
                className="transition-all duration-150 hover:bg-gray-200"
              >
                Cancel
              </Button>
            </ModalCancel>
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

const BoldDescription: React.FC<{ description: string }> = ({
  description,
}) => {
  const parts = description.split("BOLD");

  return (
    <span className="text-gray-700">
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          // This part should be bold
          return <strong key={index}>{part}</strong>;
        } else {
          // This part should not be bold
          return part;
        }
      })}
    </span>
  );
};

export { AlertModal };
