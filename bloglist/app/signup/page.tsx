import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Create account
      </h1>
      <SignupForm />
    </section>
  );
}
