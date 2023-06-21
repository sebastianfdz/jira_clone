import { IssueDetails } from "@/components/issue/issue-details";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
} from "@/components/ui/modal";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { useEffect, useState } from "react";

const IssueDetailsModal: React.FC = () => {
  const { setIssueKey, issueKey } = useSelectedIssueContext();
  const [isOpen, setIsOpen] = useState(() => !!issueKey);

  function handleOpenChange(open: boolean) {
    if (open) return;
    setIssueKey(null);
    setIsOpen(false);
  }

  useEffect(() => {
    if (issueKey) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [issueKey, setIsOpen]);
  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="h-fit max-h-[80vh] w-[80vw] overflow-hidden">
          <IssueDetails issueKey={issueKey} setIssueKey={setIssueKey} />
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { IssueDetailsModal };
