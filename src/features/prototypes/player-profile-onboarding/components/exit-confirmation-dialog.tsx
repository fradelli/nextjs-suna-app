"use client";

import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@fradelli/ui/alert-dialog";
import type { RefObject } from "react";
import { Button } from "@fradelli/ui/button";
import { prototypeStyles } from "../player-profile-onboarding-prototype.styles";

type ExitConfirmationDialogProps = Readonly<{
  open: boolean;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}>;

function ExitConfirmationDialog({
  onConfirm,
  onOpenChange,
  open,
  returnFocusRef,
}: ExitConfirmationDialogProps) {
  const t = useTranslations(
    "PlayerProfileOnboardingPrototype.exitConfirmation",
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={prototypeStyles.dialogContent}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
      >
        <AlertDialogTitle className={prototypeStyles.dialogTitle}>
          {t("title")}
        </AlertDialogTitle>
        <AlertDialogDescription className={prototypeStyles.dialogDescription}>
          {t("description")}
        </AlertDialogDescription>
        <div className={prototypeStyles.dialogActions}>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline" size="lg">
              {t("safeAction")}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="button"
              variant="destructive"
              size="lg"
              onClick={onConfirm}
            >
              {t("discardAction")}
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ExitConfirmationDialog };
