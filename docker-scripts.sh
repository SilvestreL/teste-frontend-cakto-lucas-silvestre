#!/bin/bash

# Script para facilitar o uso dos containers Docker

case "$1" in
  "start")
    echo "🚀 Iniciando aplicação..."
    docker-compose up --build
    ;;
  "stop")
    echo "🛑 Parando todos os containers..."
    docker-compose down
    ;;
  "clean")
    echo "🧹 Limpando containers e imagens..."
    docker-compose down -v --rmi all
    docker system prune -f
    ;;
  "logs")
    echo "📋 Mostrando logs da aplicação..."
    docker-compose logs -f app
    ;;
  "shell")
    echo "🐚 Acessando shell do container..."
    docker-compose exec app sh
    ;;
  "test")
    echo "🧪 Executando testes no container..."
    docker-compose exec app pnpm test
    ;;
  *)
    echo "Uso: $0 {start|stop|clean|logs|shell|test}"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start       - Inicia a aplicação"
    echo "  stop        - Para todos os containers"
    echo "  clean       - Remove containers e limpa imagens"
    echo "  logs        - Mostra logs da aplicação"
    echo "  shell       - Acessa shell do container"
    echo "  test        - Executa testes"
    exit 1
    ;;
esac
