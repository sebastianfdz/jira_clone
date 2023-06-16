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
import { SprintTrophy } from "@/components/svgs";

const CompleteSprintModal: React.FC<{
  children: ReactNode;
  issues: IssueType[];
  sprint: Sprint;
}> = ({ children, issues, sprint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const completedIssues = issues.filter((issue) => issue.status === "DONE");
  const openIssues = issues.filter((issue) => issue.status !== "DONE");
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="max-w-[540px]">
          <SprintTrophy className="-m-8 mb-8" size={540} />
          <ModalTitle>Complete {sprint.name}</ModalTitle>
          <ModalDescription>
            <span className="text-gray-600">This sprint contains:</span>
            <ul className="ml-6 mt-2 list-disc text-sm text-gray-900">
              <li>
                <span className="font-bold">{completedIssues.length} </span>
                completed issues
              </li>
              <li>
                <span className="font-bold">{openIssues.length} </span>
                open issues
              </li>
            </ul>
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
