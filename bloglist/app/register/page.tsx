import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Create account
      </h1>
      <RegisterForm />
    </section>
  );
}
