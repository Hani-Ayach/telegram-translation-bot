FROM node:18-buster-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy bot files
COPY . .

# Expose port (if needed for additional features)
EXPOSE 3000

# Run the bot
CMD ["node", "index.js"]
