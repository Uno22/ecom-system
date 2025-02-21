# Use a lightweight Node.js image
FROM node:20-alpine as builder

# Set the working directory
WORKDIR /app

# Install dependencies (only production dependencies for a smaller image)
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Use a minimal base image for the final stage
FROM node:20-alpine

WORKDIR /app

# Copy built application and dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose port 80 instead of 3000
EXPOSE 80

# Start the application
CMD ["node", "dist/main.js"]
