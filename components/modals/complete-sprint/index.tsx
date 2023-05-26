"use client";
import { useState, type ReactNode } from "react";
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
import { CompleteSprintForm } from "./form";
import { type IssueType } from "@/utils/types";
import { SprintTrophy } from "@/components/icons";

const CompleteSprintModal: React.FC<{
  children: ReactNode;
  issues: IssueType[];
  sprint: Sprint;
}> = ({ children, issues, sprint }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent>
          <SprintTrophy className="-m-8 mb-8" />
          <ModalTitle>Complete {sprint.name}</ModalTitle>
          <ModalDescription>
            <span>This sprint contains:</span>
            <span className="font-medium">
              {issues.length} completed issues
            </span>
            <span className="font-medium">{issues.length} open issues</span>
          </ModalDescription>
          <CompleteSprintForm
            sprint={sprint}
            setModalIsOpen={setIsOpen}
            issues={issues}
          />
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { CompleteSprintModal };
