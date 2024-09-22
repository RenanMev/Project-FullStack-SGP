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
import { Link, useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiAuth } from "@/axiosConfig";
import axios from 'axios';
import Notification from "@/components/ui/notification";

export const description =
  "Um formulário de cadastro com nome, email e senha dentro de um card.";



const RegisterPage = () => {
  const [formValue, setFormValue] = useState({
    nome: "",
    email: "",
    senha: "",
    papel: ""
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState<string>('');
  const [titleAlert, setTitleAlert] = useState<string>('');

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

    if (id === "senha") {
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

  const handleSelectChange = (value: string) => {
    setFormValue((prevValue) => ({
      ...prevValue,
      papel: value,
    }));
  };

  const isFormValid = () => {
    const isFormFilled =
      formValue.nome.trim() !== "" &&
      formValue.email.trim() !== "" &&
      formValue.senha.trim() !== "" &&
      formValue.papel.trim() !== "";

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValue.email);
    const hasNumber = /\d/;
    const hasLetter = /[a-zA-Z]/;
    const isValidPassword =
      formValue.senha.length >= 8 &&
      hasNumber.test(formValue.senha) &&
      hasLetter.test(formValue.senha);

    return isFormFilled && isValidEmail && isValidPassword;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  
    apiAuth.post("/register", formValue)
      .then((response) => {
        if (response.status === 201) {
          const sessionToken = response.data.token;
          const user = response.data.id;
          localStorage.setItem("sessionToken", sessionToken);
          localStorage.setItem("user", user);
  
          return axios.post('https://formspree.io/f/xeojwpdg', {
            email: formValue.email,
            subject: 'Registro de usuario',
            message: `O usuario ${formValue.nome} registrou no sistema`
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer YOUR_FORMSPREE_API_KEY'
            }
          });
        }
        throw new Error('Falha ao registrar o usuário');
      })
      .then(() => {
        navigate('/main');
      })
      .catch((error) => {
        setOpenNotification(true);
        setTitleAlert('Erro');
        setMessageAlert(error.response?.data.msg);
        console.error("Erro no registro ou envio do e-mail:", error);
      });
  };
  

  const papel = [
    'Gerente', 'Desenvolvedor', 'Designer', "QA"
  ]

  return (
    <div className="h-screen w-screen flex justify-center items-center ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
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
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    placeholder="Max"
                    required
                    value={formValue.nome}
                    onChange={handleInputChange}
                  />
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
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="********"
                    required
                    value={formValue.senha}
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
                <div className="grid gap-2">
                  <Label htmlFor="papel">Cargo</Label>
                  <Select onValueChange={handleSelectChange} value={formValue.papel}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Selecione o cargo' />
                    </SelectTrigger>
                    <SelectContent>
                      {papel.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!isFormValid()}>
                Criar conta
              </Button>
              {!isFormValid() && <p className="flex justify-center text-neutral-600">É necessário preencher o formulário!</p>}
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
      {openNotification && (
          <Notification
            variant="destructive"
            title={titleAlert}
            description={messageAlert}
            onClose={() => setOpenNotification(false)}
          />
        )}
    </div>
  );
};

export default RegisterPage;
