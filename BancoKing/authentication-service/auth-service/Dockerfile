# Dockerfile para Railway — root: BancoKing/authentication-service/auth-service
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY *.sln ./
COPY src/AuthService.Api/*.csproj src/AuthService.Api/
COPY src/AuthService.Application/*.csproj src/AuthService.Application/
COPY src/AuthService.Domain/*.csproj src/AuthService.Domain/
COPY src/AuthService.Persistence/*.csproj src/AuthService.Persistence/

RUN dotnet restore

COPY . ./

RUN dotnet publish "src/AuthService.Api/AuthService.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "AuthService.Api.dll"]
