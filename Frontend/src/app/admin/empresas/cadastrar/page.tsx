"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Checkbox } from "@/src/components/ui/checkbox"
import { ArrowLeft, Building2, MapPin, Phone, FileText, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { createEnterprise } from "@/src/services/enterprise"
import { toast } from "sonner"
import { EnterpriseAddressRequest, EnterpriseContactRequest } from "@/src/types/enterprise"
import { Select } from "@/src/components/ui/select"
import { AutocompleteField } from "@/src/components/auto-complete-field"

interface IEnterpriseFormData {
  licenseId?: string | null;
  fantasyName: string;
  socialReason: string;
  cnpj: string;
  stateRegistration: string;
  municipalRegistration: string;
  observation: string;
  licenseQuantity: number;
  isActive: boolean;
  enterpriseAddresses: EnterpriseAddressRequest[];
  enterpriseContacts: EnterpriseContactRequest[];
}

export default function CadastrarEmpresaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<IEnterpriseFormData>({
    fantasyName: '',
    socialReason: '',
    cnpj: '',
    stateRegistration: '',
    municipalRegistration: '',
    observation: '',
    licenseQuantity: 1,
    isActive: true,
    enterpriseAddresses: [{
      postalCode: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: ''
    }],
    enterpriseContacts: [{
      telephone: '',
      emailAddress: '',
      responsible: ''
    }]
  });

  const handleInputChange = (field: keyof IEnterpriseFormData, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (index: number, field: keyof EnterpriseAddressRequest, value: string) => {
    setFormData(prev => {
      const updatedAddresses = [...prev.enterpriseAddresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [field]: value
      };
      return { ...prev, enterpriseAddresses: updatedAddresses };
    });
  };

  const handleContactChange = (index: number, field: keyof EnterpriseContactRequest, value: string) => {
    setFormData(prev => {
      const updatedContacts = [...prev.enterpriseContacts];
      updatedContacts[index] = {
        ...updatedContacts[index],
        [field]: value
      };
      return { ...prev, enterpriseContacts: updatedContacts };
    });
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value)
    if (formatted.replace(/\D/g, "").length <= 14) {
      handleInputChange("cnpj", formatted)
    }
  }

  const handleCEPChange = async (value: string, index: number) => {
    const formatted = formatCEP(value);
    const numericCep = formatted.replace(/\D/g, "");

    if (numericCep.length <= 8) {
      handleAddressChange(index, "postalCode", formatted);

      if (numericCep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${numericCep}/json/`);
          const data = await response.json();

          if (!data.erro) {
            handleAddressChange(index, "street", data.logradouro || "");
            handleAddressChange(index, "district", data.bairro || "");
            handleAddressChange(index, "city", data.localidade || "");
            handleAddressChange(index, "state", data.uf || "");
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        }
      }
    }
  };

  const handlePhoneChange = (value: string, index: number) => {
    const formatted = formatPhone(value);
    const numeric = formatted.replace(/\D/g, "");

    if (numeric.length <= 11) {
      handleContactChange(index, "telephone", formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await createEnterprise(formData);

      if(response.created){
        toast.success("Empresa criada com sucesso!");
        router.push("/admin/empresas")
      }else{
        toast.error(response?.message || "Falha ao criar a empresa. Tente novamente.");
      } 
    } catch (error) {
      const err: any = error;
      const apiErrors = err?.response?.data?.errors;
      const apiMessage = err?.response?.data?.data?.message;
      const msg =
        (Array.isArray(apiErrors) && apiErrors.length > 0 ? apiErrors[0] : undefined) ||
        apiMessage ||
        err?.message ||
        "Erro ao salvar empresa. Tente novamente.";
      toast.error(String(msg));
      console.error("Erro ao salvar empresa:", error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/admin/empresas")
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Cadastrar Nova Empresa</h1>
            <p className="text-gray-600 font-body mt-1">Preencha as informações da empresa</p>
          </div>
          <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-heading font-semibold text-gray-900">Informações Básicas</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="socialReason" className="font-body">
                  Razão Social *
                </Label>
                <Input
                  id="socialReason"
                  value={formData.socialReason}
                  onChange={(e) => handleInputChange("socialReason", e.target.value)}
                  placeholder="Digite a razão social"
                  required
                />
              </div>

              <div>
                <Label htmlFor="fantasyName" className="font-body">
                  Nome Fantasia
                </Label>
                <Input
                  id="fantasyName"
                  value={formData.fantasyName}
                  onChange={(e) => handleInputChange("fantasyName", e.target.value)}
                  placeholder="Digite o nome fantasia"
                />
              </div>

              <div>
                <Label htmlFor="cnpj" className="font-body">
                  CNPJ *
                </Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleCNPJChange(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stateRegistration" className="font-body">
                  Inscrição Estadual
                </Label>
                <Input
                  id="stateRegistration"
                  value={formData.stateRegistration}
                  onChange={(e) => handleInputChange("stateRegistration", e.target.value)}
                  placeholder="Digite a inscrição estadual"
                />
              </div>

              <div>
                <Label htmlFor="municipalRegistration" className="font-body">
                  Inscrição Municipal
                </Label>
                <Input
                  id="municipalRegistration"
                  value={formData.municipalRegistration}
                  onChange={(e) => handleInputChange("municipalRegistration", e.target.value)}
                  placeholder="Digite a inscrição municipal"
                />
              </div>

            <div>
              <Label htmlFor="licenceId" className="font-body text-gray-700">
                Plano/Assinatura *
              </Label>
              <AutocompleteField
                value={formData.licenseId ?? ""}
                onValueChange={(val) => handleInputChange("licenseId", val)}
                options={[
                  { id: "db2ab708-60ba-4944-9b82-50b892b5c1bd", name: "Básico" },
                  { id: "cc74adbb-a4b6-4a0e-bfba-7fe14dedd5c7", name: "Completo (Estoque + Conta.)" },
                  { id: "951a8b8f-f303-483e-93d7-3019421af62c", name: "Premium" },
                ]}
                placeholder="Selecione a Opção"
                emptyMessage="Nenhuma opção encontrada."
                className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
              />
            </div>

            <div>
              <Label htmlFor="licenseQuantity" className="font-body text-gray-700">
                Quantidade de Licenças *
              </Label>
              <AutocompleteField
                value={formData.licenseQuantity.toString()}
                onValueChange={(val) => handleInputChange("licenseQuantity", val)}
                options={[
                  { id: "1", name: "1 Licença" },
                  { id: "3", name: "3 Licenças" },
                  { id: "5", name: "5 Licenças" },
                  { id: "10", name: "10 Licenças" },
                  { id: "unlimited", name: "Ilimitadas" },
                ]}
                placeholder="3 Licenças"
                emptyMessage="Nenhuma opção encontrada."
                className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
              />
            </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-heading font-semibold text-gray-900">Endereço</h2>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {formData.enterpriseAddresses.map((address, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`cep-${index}`} className="font-body">
                      CEP *
                    </Label>
                    <Input
                      id={`cep-${index}`}
                      value={address.postalCode}
                      onChange={(e) => handleCEPChange(e.target.value, index)}
                      placeholder="00000-000"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor={`endereco-${index}`} className="font-body">
                      Endereço *
                    </Label>
                    <Input
                      id={`endereco-${index}`}
                      value={address.street}
                      onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                      placeholder="Digite o endereço"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`numero-${index}`} className="font-body">
                      Número *
                    </Label>
                    <Input
                      id={`numero-${index}`}
                      value={address.number}
                      onChange={(e) => handleAddressChange(index, 'number', e.target.value)}
                      placeholder="Nº"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`complemento-${index}`} className="font-body">
                      Complemento
                    </Label>
                    <Input
                      id={`complemento-${index}`}
                      value={address.complement}
                      onChange={(e) => handleAddressChange(index, 'complement', e.target.value)}
                      placeholder="Apto, sala, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor={`bairro-${index}`} className="font-body">
                      Bairro *
                    </Label>
                    <Input
                      id={`bairro-${index}`}
                      value={address.district}
                      onChange={(e) => handleAddressChange(index, 'district', e.target.value)}
                      placeholder="Digite o bairro"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`cidade-${index}`} className="font-body">
                      Cidade *
                    </Label>
                    <Input
                      id={`cidade-${index}`}
                      value={address.city}
                      onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                      placeholder="Digite a cidade"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`estado-${index}`} className="font-body">
                      Estado *
                    </Label>
                    <Input
                      id={`estado-${index}`}
                      value={address.state}
                      onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                      placeholder="UF"
                      maxLength={2}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-heading font-semibold text-gray-900">Contato</h2>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {formData.enterpriseContacts.map((contact, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`telefone-${index}`} className="font-body">
                      Telefone *
                    </Label>
                    <Input
                      id={`telefone-${index}`}
                      value={contact.telephone}
                      onChange={(e) => handlePhoneChange(e.target.value, index)}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`email-${index}`} className="font-body">
                      E-mail *
                    </Label>
                    <Input
                      id={`email-${index}`}
                      type="email"
                      value={contact.emailAddress}
                      onChange={(e) => handleContactChange(index, "emailAddress", e.target.value)}
                      placeholder="empresa@exemplo.com"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor={`responsavel-${index}`} className="font-body">
                      Responsável
                    </Label>
                    <Input
                      id={`responsavel-${index}`}
                      value={contact.responsible}
                      onChange={(e) => handleContactChange(index, "responsible", e.target.value)}
                      placeholder="Nome do responsável"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-heading font-semibold text-gray-900">Observações</h2>
            </div>

            <div>
              <Label htmlFor="observation" className="font-body">
                Observações Gerais
              </Label>
              <Textarea
                id="observation"
                value={formData.observation}
                onChange={(e) => handleInputChange("observation", e.target.value)}
                placeholder="Digite observações sobre a empresa..."
                rows={4}
              />
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-heading font-semibold text-gray-900">Status</h2>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked as boolean)}
              />
              <Label htmlFor="isActive" className="font-body">
                Empresa ativa
              </Label>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4 pb-6">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Confirmar Cadastro"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
