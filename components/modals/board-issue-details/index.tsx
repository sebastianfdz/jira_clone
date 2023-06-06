import { IssueDetails } from "@/components/issue/issue-details";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
} from "@/components/ui/modal";
import { useSelectedIssueContext } from "@/context/useSelectedIssueContext";
import { useEffect, useState } from "react";

const IssueDetailsModal: React.FC = () => {
  const { setIssueId, issueId } = useSelectedIssueContext();
  const [isOpen, setIsOpen] = useState(() => !!issueId);

  function handleOpenChange(open: boolean) {
    if (open) return;
    setIssueId(null);
    setIsOpen(false);
  }

  useEffect(() => {
    if (issueId) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [issueId, setIsOpen]);
  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="h-fit max-h-[80vh] w-[80vw] overflow-hidden">
          <IssueDetails issueId={issueId} setIssueId={setIssueId} />
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { IssueDetailsModal };
