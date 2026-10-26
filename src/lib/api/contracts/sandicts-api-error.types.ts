import type {
  ApiErrorResponseApiErrorResponse as ApiErrorResponse,
  ApiErrorResponseApiErrorResponseCode as ApiErrorResponseCode,
  ApiErrorResponseApiValidationIssue as ApiValidationIssue,
} from "@/lib/api/generated/sandicts-api/model";

type SandictsApiErrorCode =
  ApiErrorResponseCode | (string & Record<never, never>);

type SandictsApiErrorResponse = Readonly<
  Omit<ApiErrorResponse, "code"> & {
    code: SandictsApiErrorCode;
  }
>;

type SandictsApiValidationIssue = ApiValidationIssue;

export type {
  SandictsApiErrorCode,
  SandictsApiErrorResponse,
  SandictsApiValidationIssue,
};
