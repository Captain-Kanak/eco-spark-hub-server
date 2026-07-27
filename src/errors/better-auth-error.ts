import status from "http-status";

export const handleBetterAuthError = (err: any) => {
  return {
    statusCode: err.status || status.BAD_REQUEST,
    message: err.message || "Authentication Error",
    errorSources: [],
  };
};
