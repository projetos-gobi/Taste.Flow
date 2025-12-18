"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select } from "@/src/components/ui/select"
import { Checkbox } from "@/src/components/ui/checkbox"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { TasteFlowLogo } from "@/src/components/tasteflow-logo"
import { toast } from "sonner"
import { getAllEnterprisesForUserRegistration } from "@/src/services/enterprise"
import { IEnterpriseForUserRegistration } from "@/src/types/enterprise"
import { createUsersRange } from "@/src/services/user"
import { maskField } from "@/src/app/utils/utils"
import useSession from "@/src/hooks/useSession"
import { AutocompleteField } from "@/src/components/auto-complete-field"

interface UserRegister {
  id: string;
  enterpriseId?: string | null;
  name: string;
  emailAddress: string;
  contact: string;
  accessProfileId: string;
  isActive: boolean;
}

export default function CreateUserPage() {
  const session = useSession();
  const router = useRouter()

  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [enterpriseSelected, setEnterpriseSelected] = useState<IEnterpriseForUserRegistration>({
    id: "",
    licenseId: "",
    fantasyName: "",
    socialReason: "",
    cnpj: "",
    licenseQuantity: 0,
    hasUnlimitedLicenses: false,
  });

  const [enterprises, setEnterprises] = useState<IEnterpriseForUserRegistration[]>([]);
  const [users, setUsers] = useState<UserRegister[]>([{
    id: crypto.randomUUID(),
    accessProfileId: "",
    enterpriseId: null,
    name: "",
    emailAddress: "",
    contact: "",
    isActive: isActive
  }]);

  const fetchInitialData = async () => {
    try {
      const response = await getAllEnterprisesForUserRegistration();

      setEnterprises(response);
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAddProfile = () => {
    if (users.length > enterpriseSelected.licenseQuantity && enterpriseSelected.id !== "") {
      return;
    }

    const newProfile: UserRegister = {
      id: crypto.randomUUID(),
      enterpriseId: (enterpriseSelected.id !== "")? enterpriseSelected.id : null,
      name: "",
      emailAddress: "",
      contact: "",
      accessProfileId: "",
      isActive: isActive
    };
    
    setUsers([...users, newProfile]);
  }

  const handleDeleteUser = (id: string) => {
    if (users.length > 1) {
      setUsers(users.filter((user) => user.id !== id))
    }
  }

  const handleProfileChange = (id: string, field: keyof UserRegister, value: string | null) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, [field]: value } : user)));
  }

  const handleChangeEnterprise = (enterpriseId: string | null) => {
    const selected = enterprises.find(e => e.id === enterpriseId);
    if (selected) {
      setEnterpriseSelected(selected);
    }
  }

  const isAnyUserInvalid = users.some(user =>
    user.name.trim() === "" ||
    user.emailAddress.trim() === "" ||
    user.contact.trim() === "" ||
    user.accessProfileId.trim() === ""
  );

  const handleCancel = () => {
    router.push("/admin/usuarios")
  }

  const handleSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    session.setRefresh(false);

    try {
      const usersRequest = users.map((user) => ({
        ...user,
        enterpriseId: enterpriseSelected.id !== "" ? enterpriseSelected.id : null,
        isActive: isActive,
      }));

      const response = await createUsersRange({
        users: usersRequest,
        enterpriseId: enterpriseSelected.id !== "" ? enterpriseSelected.id : null,
      });

      // Robustez: caso algum deploy/ambiente retorne PascalCase por qualquer motivo.
      const created = Boolean((response as any)?.created ?? (response as any)?.Created);
      const message =
        ((response as any)?.message ?? (response as any)?.Message ?? "").toString().trim();

      if (created) {
        toast.success(message || "Usuários criados com sucesso!");
        session.setRefresh(true);
        router.push("/admin/usuarios");
        return;
      }

      toast.error(message || "Não foi possível criar os usuários. Tente novamente.");
    } catch (error: any) {
      const apiErrors = error?.response?.data?.errors;
      const apiMessage = error?.response?.data?.data?.message;
      const msg =
        (Array.isArray(apiErrors) && apiErrors.length > 0 ? apiErrors[0] : undefined) ||
        apiMessage ||
        "Erro ao salvar usuários. Tente novamente.";

      toast.error(String(msg));
      console.error("Erro ao salvar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/usuarios");
  }

  const remainingLicenses = enterpriseSelected.licenseQuantity - users.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <TasteFlowLogo size="small" />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-gray-900">Cadastrando Novo Usuário</h1>
            <p className="text-sm sm:text-base text-gray-600 font-body">
              Área dedicada ao cadastro e gerenciamento de Usuários.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 font-body bg-transparent w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-heading font-semibold text-gray-900">Cadastro Manual de Usuário</h2>
          </div>

          {/* Card Content */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Active Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked === true)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <Label htmlFor="active" className="text-sm font-medium text-gray-900 font-body">
                Ativo
              </Label>
            </div>

            {/* Company, Plan, Licenses Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-gray-700 font-body">
                  Empresa do Perfil
                </Label>
                <AutocompleteField
                  value={enterpriseSelected.id}
                  onValueChange={handleChangeEnterprise}
                  options={enterprises.map((e) => ({ id: e.id.toString(), name: e.fantasyName }))}
                  placeholder="Selecione a Opção"
                  emptyMessage="Nenhuma opção encontrada."
                  className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
                />

              </div>

              <div className="space-y-2">
                <Label htmlFor="plan" className="text-sm font-medium text-gray-700 font-body">
                  Plano/Assinatura
                </Label>
                <AutocompleteField
                  value={enterpriseSelected.licenseId}
                  onValueChange={() => {}}
                  options={[
                    { id: "db2ab708-60ba-4944-9b82-50b892b5c1bd", name: "Básico" },
                    { id: "cc74adbb-a4b6-4a0e-bfba-7fe14dedd5c7", name: "Completo (Estoque + Conta.)" },
                    { id: "951a8b8f-f303-483e-93d7-3019421af62c", name: "Premium" },
                  ]}
                  placeholder="Plano/Assinatura"
                  emptyMessage="Nenhuma opção encontrada."
                  className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
                  disabled={true}
                />
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="licenses" className="text-sm font-medium text-gray-700 font-body">
                  Quantidade de Licenças
                </Label>
                <AutocompleteField
                  value={enterpriseSelected.licenseQuantity > 0 ? enterpriseSelected.licenseQuantity.toString() : ""}
                  onValueChange={() => {}}
                  options={[
                    { id: "1", name: "1 Licença" },
                    { id: "3", name: "3 Licenças" },
                    { id: "5", name: "5 Licenças" },
                    { id: "10", name: "10 Licenças" },
                  ]}
                  placeholder="Quantidade de Licenças"
                  emptyMessage="Nenhuma opção encontrada."
                  className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profiles Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-heading font-semibold text-gray-900">Cadastrar Perfis</h3>
              <span className="text-sm text-gray-500 font-body">
                {users.length} de {enterpriseSelected.licenseQuantity} licenças
              </span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 sm:p-6 space-y-6">
            {users.map((user, index) => (
              <div key={user.id} className="space-y-4">
                {/* Profile Separator */}
                {index > 0 && <div className="border-t border-gray-200 pt-6" />}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 font-body">Nome do Usuário</Label>
                    <Input
                      placeholder="Junior"
                      value={user.name}
                      onChange={(e) => handleProfileChange(user.id, "name", e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 font-body">E-Mail de Login</Label>
                    <Input
                      type="email"
                      placeholder="email@gmail.com"
                      value={user.emailAddress}
                      onChange={(e) => handleProfileChange(user.id, "emailAddress", e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 font-body">Contato (Email ou Celular)</Label>
                    <Input
                      placeholder="+00 00 00000-0000"
                      value={user.contact}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '');
                        const mask = raw.length > 10 ? '(99) 99999-9999' : '(99) 9999-9999';
                        handleProfileChange(user.id, "contact", maskField(e.target.value, mask));
                      }}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2 items-end">
                    <div className="space-y-2 flex-1">
                      <Label className="text-sm font-medium text-gray-700 font-body">Tipo de Perfil</Label>
                      <AutocompleteField
                        value={user.accessProfileId}
                        onValueChange={(val) => handleProfileChange(user.id, "accessProfileId", val)}
                        options={[
                          { id: "109ae3c4-17fd-4cf3-a0e2-e781fe457dcf", name: "Administrador" },
                          { id: "b7c9b9d4-4c1f-4f01-a3b3-5ae71f66dabc", name: "Usuário" },
                        ]}
                        placeholder="Selecione a Opção"
                        emptyMessage="Nenhuma opção encontrada."
                        className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
                      />
                    </div>

                    {users.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="h-10 w-10 p-0 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add Profile Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                onClick={handleAddProfile}
                disabled={(users.length >= enterpriseSelected.licenseQuantity && enterpriseSelected.id !== "")}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 font-body disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                Adicionar novo perfil
                {remainingLicenses === 0 && <span className="text-xs">({remainingLicenses} restantes)</span>}
              </Button>
            </div>

            {remainingLicenses === 0 && (
              <p className="text-sm text-amber-600 font-body bg-amber-50 p-3 rounded-lg border border-amber-200">
                Você atingiu o limite de licenças disponíveis ({enterpriseSelected.licenseQuantity}).
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-8 py-2 font-body bg-transparent w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            disabled={isAnyUserInvalid || isLoading}
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 font-body w-full sm:w-auto"
          >
            {isLoading ? "Salvando..." : "Confirmar Cadastro"}
          </Button>
        </div>
      </div>
    </div>
  )
}
