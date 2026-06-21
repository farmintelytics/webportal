FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy application source code
COPY . .

# Expose Vite's default dev server port
EXPOSE 5173

# Start development server binding to 0.0.0.0 so Docker can map the port
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
