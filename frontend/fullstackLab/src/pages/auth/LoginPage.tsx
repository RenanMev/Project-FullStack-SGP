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
import Logo from "../../assets/image/Logo/Logo Renan.svg";
import { Link, useNavigate } from 'react-router-dom';
import { apiAuth } from "@/axiosConfig";
import Notification from "@/components/ui/notification";

export const description =
  "Um formulário de login simples com email e senha. O botão de envio diz 'Entrar'.";

const LoginPage = () => {
  const [formValue, setFormValue] = useState<{ email: string; senha: string }>({
    email: '',
    senha: ''
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState<string>('');
  const [titleAlert, setTitleAlert] = useState<string>('');

  const navigate = useNavigate();

  const handleValueForm = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormValue(prev => ({
      ...prev,
      [id]: value
    }));

    if (id === 'email') {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailError(isValidEmail ? null : 'O email deve ser válido e terminar com ".com"');
    }

    if (id === 'senha') {
      const isValidPassword = value.length >= 8;
      setPasswordError(isValidPassword ? null : 'A senha deve ter pelo menos 8 dígitos');
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValue.email);
    const isValidPassword = formValue.senha.length >= 8;

    if (!isValidEmail) {
      setEmailError('O email deve ser válido e terminar com ".com"');
    }

    if (!isValidPassword) {
      setPasswordError('A senha deve ter pelo menos 8 dígitos');
    }

    if (isValidEmail && isValidPassword) {
      apiAuth.post('/login', formValue).then((res) => {
        if (res.status === 200) {
          const sessionToken = res.data.token;
          const user = res.data.id;
          localStorage.setItem("sessionToken", sessionToken);
          localStorage.setItem("user", user);

          navigate('/main');
        }
      }).catch((err) => {

        if(err.status === 401){
          setOpenNotification(true);
          setMessageAlert(err.response.data.msg);
          setTitleAlert('Acesso negado');
        }
        if(err.status === 500){
          setOpenNotification(true);
          setMessageAlert(err.response.data.msg);
          setTitleAlert('Erro a acessar!');
        }
       
      });

      setEmailError(null);
      setPasswordError(null);
    }
  };

  const isFormValid = formValue.email.trim() !== '' &&
    formValue.senha.trim() !== '' &&
    !emailError &&
    !passwordError;

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-neutral-50 dark:bg-neutral-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-sm border rounded-xl"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl mx-auto mb-4 flex gap-3 flex-wrap-reverse">
              <div>
                <img src={Logo} alt="logo" />
              </div>
              <div>
                FullStack Lab
              </div>
            </CardTitle>
            <CardDescription>
              Digite seu email abaixo para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formValue.email}
                  onChange={handleValueForm}
                  required
                  aria-required="true"
                  aria-label="Digite seu e-mail"
                />
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm"
                  >
                    {emailError}
                  </motion.p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="senha">Senha</Label>
                  <Link to="/" className="ml-auto inline-block text-sm underline">
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input
                  id="senha"
                  type="password"
                  value={formValue.senha}
                  onChange={handleValueForm}
                  required
                  aria-required="true"
                  aria-label="Digite sua senha"
                />
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm"
                  >
                    {passwordError}
                  </motion.p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid}
              >
                Entrar
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full border"
                onClick={handleRegisterClick}
              >
                Cadastre-se
              </Button>
            </form>
          </CardContent>
        </Card>
        {openNotification && (
          <Notification
            variant="destructive"
            title={titleAlert}
            description={messageAlert}
            onClose={() => setOpenNotification(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
