import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OwnTripWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OwnTripWarningModal({
  isOpen,
  onClose,
}: OwnTripWarningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eigene Fahrt</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Sie können Ihre eigene Fahrt nicht buchen. Bitte nutzen Sie die
            Verwaltungsoptionen in Ihrem Profil, um Ihre Fahrt zu bearbeiten
            oder zu verwalten.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Ok</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
