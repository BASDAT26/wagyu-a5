import { useForm } from "@tanstack/react-form";
import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Label } from "@wagyu-a5/ui/components/label";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "../../../components/loader";
import { Card } from "@wagyu-a5/ui/components/card";

export default function LoginModule() {
  const navigate = useNavigate();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.username,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate("/dashboard");
            toast.success("Login berhasil");
          },
          onError: (error) => {
            toast.error(error.error.message || "Login gagal");
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        username: z.string().min(3, "Username minimal 3 karakter"),
        password: z.string().min(6, "Password minimal 6 karakter"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-blue-600 rounded-xl p-3 mb-4">
            <span className="text-2xl font-bold text-white">TT</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">TikTakTuk</h1>
          <p className="">Platform Manajemen Pertunjukan & Tiket</p>
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-white shadow-lg">
          {/* Title */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-1">Masuk ke Akun Anda</h2>
            <p className="text-sm ">
              Gunakan kredensial Anda untuk mengakses platform
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <div>
              <form.Field name="username">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="username" className="font-medium">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Masukkan username"
                      value={field.state.value as string}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="border-gray-300"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name="password">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Masukkan password"
                      value={field.state.value as string}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="border-gray-300"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-900 text-white font-medium py-2 mt-6"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Memproses..." : "Masuk"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6  text-sm">
          <span>Belum punya akun? </span>
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Daftar sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
