# Use .NET 8 SDK oficial
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar arquivos do projeto
COPY TasteFlow.Api/TasteFlow.Api.csproj TasteFlow.Api/
COPY TasteFlow.Application/TasteFlow.Application.csproj TasteFlow.Application/
COPY TasteFlow.Contracts/TasteFlow.Contracts.csproj TasteFlow.Contracts/
COPY TasteFlow.Domain/TasteFlow.Domain.csproj TasteFlow.Domain/
COPY TasteFlow.Infrastructure/TasteFlow.Infrastructure.csproj TasteFlow.Infrastructure/
COPY TasteFlow.Ioc/TasteFlow.Ioc.csproj TasteFlow.Ioc/
COPY TasteFlow.Shared/TasteFlow.Shared.csproj TasteFlow.Shared/

# Restaurar dependências
RUN dotnet restore TasteFlow.Api/TasteFlow.Api.csproj

# Copiar todo o código
COPY . .

# Build e publicar
WORKDIR /src/TasteFlow.Api
RUN dotnet publish -c Release -o /app/publish

# Imagem final
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

# Expor porta
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "TasteFlow.Api.dll"]
