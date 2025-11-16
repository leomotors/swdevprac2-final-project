"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { client } from "@/libs/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerTel, setRegisterTel] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoginLoading(true);

    try {
      const { data, error } = await client.POST("/auth/login", {
        body: {
          email: loginEmail,
          password: loginPassword,
        },
      });

      if (error || !data) {
        setLoginError("Invalid email or password");
        return;
      }

      if (data.token) {
        await login(data.token);
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred. Please try again.");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setIsRegisterLoading(true);

    try {
      const { data, error } = await client.POST("/auth/register", {
        body: {
          name: registerName,
          email: registerEmail,
          tel: registerTel,
          password: registerPassword,
        },
      });

      if (error || !data) {
        setRegisterError("Registration failed. Please check your information.");
        return;
      }

      if (data.token) {
        await login(data.token);
        router.push("/");
      }
    } catch (error) {
      console.error("Register error:", error);
      setRegisterError("An error occurred. Please try again.");
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Welcome Back!
          </h1>
          <p className="mt-2 text-gray-600">
            Login or create an account to book your booth
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-gray-200/50 bg-white/40 backdrop-blur-xs">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoginLoading}
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      minLength={6}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoginLoading}
                      className="bg-white/80"
                    />
                  </div>
                  {loginError && (
                    <p className="text-sm font-medium text-red-500">
                      {loginError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-linear-to-r from-pink-500 to-purple-600 font-semibold text-white hover:opacity-90"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-gray-200/50 bg-white/40 backdrop-blur-xs">
              <CardHeader>
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription>
                  Fill in your details to create a new account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Your Name"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      disabled={isRegisterLoading}
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      disabled={isRegisterLoading}
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-tel">Phone Number</Label>
                    <Input
                      id="register-tel"
                      type="tel"
                      placeholder="0812345678"
                      value={registerTel}
                      onChange={(e) => setRegisterTel(e.target.value)}
                      required
                      disabled={isRegisterLoading}
                      className="bg-white/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      disabled={isRegisterLoading}
                      className="bg-white/80"
                    />
                  </div>
                  {registerError && (
                    <p className="text-sm font-medium text-red-500">
                      {registerError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-linear-to-r from-pink-500 to-purple-600 font-semibold text-white hover:opacity-90"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? "Creating account..." : "Register"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
