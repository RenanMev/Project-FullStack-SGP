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
import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const description =
  "Um formulário de cadastro com nome, sobrenome, email e senha dentro de um card.";

const RegisterPage = () => {
  const [formValue, setFormValue] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValue((prevValue) => ({
      ...prevValue,
      [id]: value,
    }));

    if (id === "email") {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailError(isValidEmail ? null : "O email deve ser válido");
    }

    if (id === "password") {
      const hasNumber = /\d/;
      const hasLetter = /[a-zA-Z]/;
      const isValidPassword =
        value.length >= 8 && hasNumber.test(value) && hasLetter.test(value);
      setPasswordError(
        isValidPassword
          ? null
          : "A senha deve ter pelo menos 8 caracteres, incluindo letras e números"
      );
    }
  };

  const isFormValid = () => {
    const isFormFilled =
      formValue.firstName.trim() !== "" &&
      formValue.lastName.trim() !== "" &&
      formValue.email.trim() !== "" &&
      formValue.password.trim() !== "";

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValue.email);
    const hasNumber = /\d/;
    const hasLetter = /[a-zA-Z]/;
    const isValidPassword =
      formValue.password.length >= 8 &&
      hasNumber.test(formValue.password) &&
      hasLetter.test(formValue.password);

    return isFormFilled && isValidEmail && isValidPassword;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      console.log("Formulário enviado:", formValue);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-neutral-50 dark:bg-neutral-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Cadastre-se na FullStack Lab</CardTitle>
            <CardDescription>
              Insira suas informações para criar uma conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Nome</Label>
                  <Input
                    id="firstName"
                    placeholder="Max"
                    required
                    value={formValue.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Sobrenome</Label>
                  <Input
                    id="lastName"
                    placeholder="Robinson"
                    required
                    value={formValue.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@exemplo.com"
                  required
                  value={formValue.email}
                  onChange={handleInputChange}
                />
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm"
                  >
                    {emailError}
                  </motion.p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                  value={formValue.password}
                  onChange={handleInputChange}
                />
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm"
                  >
                    {passwordError}
                  </motion.p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={!isFormValid()}>
                Criar conta
              </Button>
              {!isFormValid() && <p className="flex justify-center text-neutral-600">É necessario prencher o formulario!</p>}
            </form>
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{" "}
              <Link to="/" className="underline">
                Entrar
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
