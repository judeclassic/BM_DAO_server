interface ConfirmResetPasswordRequest {
  emailAddress: string,
  code: string,
  password: string;
  confirmPassword: string;
}

export default ConfirmResetPasswordRequest;
