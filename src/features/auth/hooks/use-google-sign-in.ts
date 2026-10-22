"use client";

import { useGoogleSignInControllerSignIn } from "@/lib/api/generated/sandicts-api/auth/auth";
import { useQueryClient } from "@tanstack/react-query";
import { clearGoogleOneTapState } from "@/features/auth/google-one-tap/google-one-tap-storage";
import { applyAuthSessionSnapshot } from "./apply-auth-session-snapshot";

function useGoogleSignIn() {
  const queryClient = useQueryClient();

  return useGoogleSignInControllerSignIn({
    mutation: {
      onSuccess: (authSession) => {
        applyAuthSessionSnapshot(queryClient, authSession);
        clearGoogleOneTapState();
      },
    },
  });
}

export { useGoogleSignIn };
