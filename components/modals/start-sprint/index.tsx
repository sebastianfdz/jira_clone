"use client";
import { type ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { type Sprint } from "@prisma/client";
import { StartSprintForm } from "./form";

const StartSprintModal: React.FC<{
  children: ReactNode;
  issueCount: number;
  sprint: Sprint;
}> = ({ children, issueCount, sprint }) => {
  return (
    <Modal>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <ModalTitle>Start Sprint</ModalTitle>
          <ModalDescription>
            <span className="font-bold text-gray-600">{issueCount}</span>
            {issueCount > 1 ? " issues" : " issue"} will be included in this
            sprint.
          </ModalDescription>
          <StartSprintForm sprint={sprint} />
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { StartSprintModal };
