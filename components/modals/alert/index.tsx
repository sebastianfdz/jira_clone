import {
  Modal,
  ModalAction,
  ModalCancel,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/alert-modal";
import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";

const AlertModal: React.FC<{
  children: ReactNode;
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
}> = ({ children, title, description, actionText, onAction }) => {
  return (
    <Modal>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
          <div className="flex items-center justify-end gap-x-3">
            <ModalAction>
              <Button
                customColors
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={onAction}
              >
                {actionText}
              </Button>
            </ModalAction>
            <ModalCancel>
              <Button>Cancel</Button>
            </ModalCancel>
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { AlertModal };
