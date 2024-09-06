import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "./input";
import { useTheme } from "@/context/ThemeContext";

const EditUserDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [userEmail, setUserEmail] = useState("john.doe@example.com");
  const { darkMode } = useTheme();
  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  const handleSave = () => {
    console.log("User saved:", { userName, userEmail });
    toggleDialog();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button onClick={toggleDialog} className="bg-violet-700 rounded-full pt-1">
            <Settings2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className={`p-4 ${darkMode ? 'bg-neutral-950 text-white border-neutral-800' : 'bg-white text-black'}`}>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Modifique as informações do usuário abaixo.</DialogDescription>
          </DialogHeader>

          <div className="p-4">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={`mb-4 ${darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-100 border-neutral-300 text-black'}`}
            />

            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className={`mb-4 ${darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-100 border-neutral-300 text-black'}`}
            />
          </div>

          <DialogFooter>
            <Button onClick={handleSave} className={`bg-violet-700 text-white ${darkMode ? 'bg-violet-700 text-white' : 'bg-violet-500 text-black'}`}>
              Salvar
            </Button>
            <Button variant="outline" onClick={toggleDialog} className={`border-neutral-800 text-white ${darkMode ? 'border-neutral-800 text-black hover:text-white hover:bg-neutral-950' : 'border-neutral-300 text-black'}`}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditUserDialog;
