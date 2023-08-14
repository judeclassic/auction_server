FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g typescript
RUN npx tsc

# Copy source code
COPY . .

# Expose the port number (adjust if necessary)
EXPOSE 8080

# Start the application
CMD [ "npm", "start" ]