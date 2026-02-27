#!/bin/bash

# Local Development Setup Script

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Setting up development environment...${NC}"

# Navigate to project root
cd "$PROJECT_ROOT"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created (please update with your values)${NC}"
fi

# Create necessary directories
mkdir -p generated_resumes logs nginx/ssl

# Set up backend
echo -e "${BLUE}Setting up backend...${NC}"
cd backend
if [ ! -d venv ]; then
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
fi
cd ..

# Set up frontend
echo -e "${BLUE}Setting up frontend...${NC}"
cd frontend
npm install
cd ..

echo -e "${GREEN}✓ Development environment setup complete${NC}"
echo -e "${BLUE}To start development:${NC}"
echo "  docker-compose up"
