import { Book, Store, Triangle, ShoppingCart, Users, Scale, Flag, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CadastrosPage() {
  return (
    <div className="bg-gray-50 p-6 min-h-full relative">
      {/* Elementos decorativos */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#322CA7]/10 rounded-2xl rotate-12"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-[#1C194D]/10 rounded-2xl -rotate-12"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Cadastros</h1>
          <p className="font-nunito font-light text-sm text-gray-600 mt-1">
            Área dedicada ao cadastro de Informações para o Sistema.
          </p>
        </div>

        {/* Cadastro de Produtos */}
        <div>
          <h2 className="font-nunito font-medium text-lg text-gray-800 mb-3">Cadastro de Produtos</h2>
          <Link href="/cadastros/produtos" className="block group">
            <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]">
              <div className="flex items-stretch h-32">
                <div className="relative w-1/3">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Book className="text-white h-12 w-12 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6 w-2/3">
                  <h3 className="font-bebas text-2xl text-white tracking-wide">PRODUTOS</h3>
                  <p className="font-nunito font-light text-sm text-white/90 mt-1">
                    Sessão responsável pelo cadastro das fichas técnicas e produtos do seu restaurante.
                  </p>
                </div>
                <div className="w-3/6 relative">
                  <Image
                    src="/images/produtos-food.png"
                    alt="Produtos do restaurante"
                    width={500}
                    height={128}
                    className="object-cover w-full h-full"
                    priority
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(90deg, rgba(50,44,167,0.7) 0%, rgba(50,44,167,0) 100%)",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Cadastro de Mercadoria */}
        <div>
          <h2 className="font-nunito font-medium text-lg text-gray-800 mb-3">Cadastro de Mercadoria</h2>
          <Link href="/cadastros/mercadorias" className="block group">
            <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]">
              <div className="flex items-stretch h-32">
                <div className="relative w-1/3">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Store className="text-white h-12 w-12 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6 w-2/3">
                  <h3 className="font-bebas text-2xl text-white tracking-wide">MERCADORIAS</h3>
                  <p className="font-nunito font-light text-sm text-white/90 mt-1">
                    Sessão responsável pela junção de todas as informações cadastradas anteriormente para a criação das
                    mercadorias do seu restaurante.
                  </p>
                </div>
                <div className="w-3/6 relative">
                  <Image
                    src="/images/mercadorias-shopping.png"
                    alt="Mercadorias do supermercado"
                    width={500}
                    height={128}
                    className="object-cover w-full h-full"
                    priority
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(90deg, rgba(50,44,167,0.7) 0%, rgba(50,44,167,0) 100%)",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Cadastro de Categorias */}
        <div>
          <h2 className="font-nunito font-medium text-lg text-gray-800 mb-3">Cadastro de Categorias</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/cadastros/categorias" className="block group">
              <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] h-full">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-center justify-center mb-4">
                      <Triangle className="text-white h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-bebas text-xl text-white tracking-wide text-center">CATEGORIAS</h3>
                    <p className="font-nunito font-light text-sm text-white/90 mt-2 text-center">
                      Área designada ao cadastro dos nomes das categorias.
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/cadastros/subcategorias" className="block group">
              <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] h-full">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-center justify-center mb-4">
                      <Triangle className="text-white h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-bebas text-xl text-white tracking-wide text-center">SUB-CATEGORIAS</h3>
                    <p className="font-nunito font-light text-sm text-white/90 mt-2 text-center">
                      Área designada ao cadastro de Subcategorias.
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/cadastros/tipo-categoria" className="block group">
              <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] h-full">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-center justify-center mb-4">
                      <Triangle className="text-white h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-bebas text-xl text-white tracking-wide text-center">TIPO DE CATEGORIA</h3>
                    <p className="font-nunito font-light text-sm text-white/90 mt-2 text-center">
                      Área designada ao cadastro de tipos de categorias.
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Cadastro de Base */}
        <div>
          <h2 className="font-nunito font-medium text-lg text-gray-800 mb-3">Cadastro de Base</h2>

          {/* Primeira linha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Link href="/cadastros/itens" className="block group">
              <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] h-full">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="relative z-10 p-6 flex items-center">
                    <ShoppingCart className="text-white h-8 w-8 mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h3 className="font-bebas text-xl text-white tracking-wide">ITENS</h3>
                      <p className="font-nunito font-light text-sm text-white/90 mt-1">
                        Área designada ao cadastro de Itens.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/cadastros/fornecedores" className="block group">
              <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] h-full">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="relative z-10 p-6 flex items-center">
                    <Users className="text-white h-8 w-8 mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h3 className="font-bebas text-xl text-white tracking-wide">FORNECEDORES</h3>
                      <p className="font-nunito font-light text-sm text-white/90 mt-1">
                        Área designada ao cadastro de Fornecedores e Parceiros.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Segunda linha */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/cadastros/unidades" className="block group">
              <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] h-full">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="relative z-10 p-6 flex items-center">
                    <Scale className="text-white h-8 w-8 mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h3 className="font-bebas text-xl text-white tracking-wide">UNIDADES</h3>
                      <p className="font-nunito font-light text-sm text-white/90 mt-1">
                        Área designada ao cadastro de Unidades de Medida.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/cadastros/marca" className="block group">
              <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] h-full">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="relative z-10 p-6 flex items-center">
                    <Flag className="text-white h-8 w-8 mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h3 className="font-bebas text-xl text-white tracking-wide">MARCA</h3>
                      <p className="font-nunito font-light text-sm text-white/90 mt-1">
                        Área designada ao cadastro de Marcas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/cadastros/tipo" className="block group">
              <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] h-full">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="relative z-10 p-6 flex items-center">
                    <Package className="text-white h-8 w-8 mr-4 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h3 className="font-bebas text-xl text-white tracking-wide">TIPO</h3>
                      <p className="font-nunito font-light text-sm text-white/90 mt-1">
                        Área designada ao cadastro de tipos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
