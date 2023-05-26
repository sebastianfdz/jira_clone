"use client";
import { useState, type ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { type Sprint } from "@prisma/client";
import { UpdateSprintForm } from "./form";

const UpdateSprintModal: React.FC<{
  children: ReactNode;
  sprint: Sprint;
}> = ({ children, sprint }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <ModalTitle>Edit Sprint: {sprint.name}</ModalTitle>
          <UpdateSprintForm sprint={sprint} setModalIsOpen={setIsOpen} />
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { UpdateSprintModal };
