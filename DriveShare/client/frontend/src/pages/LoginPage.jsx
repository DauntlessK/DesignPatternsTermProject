import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />

      <hr style={{ margin: "30px 0" }} />

      <h2>New to DriveShare?</h2>
      <RegisterForm />
    </div>
  );
}