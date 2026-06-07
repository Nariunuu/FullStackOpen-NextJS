"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import { registerUser, type RegisterState } from "./actions";

const initialState: RegisterState = {
  values: { username: "", name: "" },
  errors: {},
};

function FieldError({
  message,
  testId,
}: {
  message?: string;
  testId: string;
}) {
  if (!message) return null;
  return (
    <span
      role="alert"
      data-testid={testId}
      className="text-xs text-red-600 dark:text-red-400"
    >
      {message}
    </span>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const { notify } = useNotification();

  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    registerUser,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      notify(
        `Account "${state.success.username}" created — please sign in`,
        "success",
      );
      router.push("/login");
    }
  }, [state.success, notify, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Name
        <input
          type="text"
          name="name"
          autoComplete="name"
          defaultValue={state.values.name}
          aria-invalid={Boolean(state.errors.name)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <FieldError message={state.errors.name} testId="name-error" />
      </label>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Username
        <input
          type="text"
          name="username"
          autoComplete="username"
          defaultValue={state.values.username}
          aria-invalid={Boolean(state.errors.username)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <FieldError message={state.errors.username} testId="username-error" />
      </label>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Password
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          aria-invalid={Boolean(state.errors.password)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <FieldError message={state.errors.password} testId="password-error" />
      </label>

      <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
        Confirm Password
        <input
          type="password"
          name="passwordConfirm"
          autoComplete="new-password"
          aria-invalid={Boolean(state.errors.passwordConfirm)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <FieldError
          message={state.errors.passwordConfirm}
          testId="passwordConfirm-error"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        data-testid="register-button"
        className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {pending ? "Creating…" : "Create account"}
      </button>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
