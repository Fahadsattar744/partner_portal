# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Install Nest CLI globally (optional, helpful in dev)
RUN npm install -g @nestjs/cli

# Start the app in development mode with live reload
CMD ["npm", "run", "start:dev"]
