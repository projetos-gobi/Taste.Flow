# 🚂 Guia de Configuração do Railway

## Passo a Passo para Deploy do Backend

### 1. Criar conta no Railway
1. Acesse: https://railway.app
2. Clique em "Start a New Project"
3. Faça login com GitHub
4. Autorize o Railway a acessar seus repositórios

### 2. Criar novo projeto
1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha o repositório: `projetos-gobi/Taste.Flow`
4. Railway vai detectar automaticamente que é um projeto .NET

### 3. Configurar variáveis de ambiente
No painel do Railway, vá em **Variables** e adicione:

```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:$PORT

ConnectionStrings__DefaultConnection=Host=db.twcwycecokaiiaeptndq.supabase.co;Database=postgres;Username=postgres;Password=vmedxADqPy5mDBgG;Port=5432;SSL Mode=Require
```

**Importante:** O Railway define automaticamente a variável `$PORT`, então use `http://0.0.0.0:$PORT`

### 4. Configurar o serviço
1. No painel do projeto, clique no serviço criado
2. Vá em **Settings**
3. Configure:
   - **Root Directory**: Deixe vazio (ou `/` se necessário)
   - **Build Command**: `dotnet publish Backend/TasteFlow.Api/TasteFlow.Api.csproj -c Release -o ./publish`
   - **Start Command**: `dotnet Backend/TasteFlow.Api/publish/TasteFlow.Api.dll`

### 5. Deploy
1. Railway vai fazer o deploy automaticamente após conectar o repositório
2. Aguarde o build completar (pode levar 3-5 minutos na primeira vez)
3. Verifique os logs em **Deployments** → **View Logs**

### 6. Obter a URL da API
1. No painel do serviço, vá em **Settings**
2. Ative **Generate Domain**
3. Copie a URL gerada (algo como: `tasteflow-production.up.railway.app`)

### 7. Configurar CORS (se necessário)
No `Program.cs` do backend, certifique-se de que o CORS está configurado para aceitar requisições do frontend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercel", policy =>
    {
        policy.WithOrigins(
            "https://seu-frontend.vercel.app",
            "http://localhost:3000"
        )
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});
```

### 8. Atualizar Frontend
No frontend, atualize a URL da API para apontar para o Railway:

```typescript
// Exemplo em um arquivo de configuração
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tasteflow-production.up.railway.app';
```

## Variáveis de Ambiente no Railway

### Obrigatórias:
- `ASPNETCORE_ENVIRONMENT=Production`
- `ASPNETCORE_URLS=http://0.0.0.0:$PORT`
- `ConnectionStrings__DefaultConnection` (connection string do Supabase)

### Opcionais (se usar no appsettings.json):
- `Auth__Secret`
- `SmtpSettings__Server`
- `SmtpSettings__Password`
- etc.

## Troubleshooting

### Build falha:
- Verifique se o caminho do projeto está correto
- Confirme que o arquivo `.csproj` existe em `Backend/TasteFlow.Api/`

### Aplicação não inicia:
- Verifique os logs no Railway
- Confirme que a porta está configurada como `$PORT`
- Verifique se a connection string está correta

### Erro de conexão com banco:
- Confirme que a connection string do Supabase está correta
- Verifique se o Supabase permite conexões externas
- Confirme que o SSL está habilitado na connection string

## Próximos Passos

1. ✅ Configurar Railway
2. ✅ Fazer primeiro deploy
3. ✅ Obter URL da API
4. ✅ Atualizar frontend com URL da API
5. ✅ Configurar variáveis de ambiente no Vercel (para o frontend)

