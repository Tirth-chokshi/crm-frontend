import RegisterForm from "@/components/Register";

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center mt-8">Register</h1>
      <RegisterForm />
    </div>
  );
}