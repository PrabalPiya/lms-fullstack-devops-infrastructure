# LearnHub LMS DevOps Infrastructure

This is a simple full-stack LMS project that I created to practice DevOps deployment.

The project contains a frontend, backend, database, infrastructure code, and CI/CD pipeline.
The main goal of this project is to understand how a real web application can be deployed on AWS using DevOps tools.

## Project Overview

LearnHub LMS is a basic Learning Management System.

It has:

* A React frontend
* A Node.js/Express backend
* PostgreSQL database
* Docker for backend containerization
* Terraform for AWS infrastructure
* GitHub Actions for CI/CD
* AWS S3 and CloudFront for frontend hosting
* AWS EC2 for backend deployment
* AWS RDS for database

## Architecture

The project follows this simple deployment flow:

```text
User
  |
  v
CloudFront
  |
  |-- Frontend files from S3
  |
  |-- /api requests to EC2 backend
                    |
                    v
              Docker Backend
                    |
                    v
              RDS PostgreSQL
```

## Tech Stack

### Frontend

* React
* Vite
* TypeScript
* Axios
* React Router

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Docker

### DevOps / Cloud

* AWS EC2
* AWS RDS PostgreSQL
* AWS S3
* AWS CloudFront
* AWS SSM
* Terraform
* GitHub Actions
* DockerHub

## Folder Structure

```text
lms-fullstack-devops-infrastructure
│
├── app
│   ├── backend
│   │   ├── src
│   │   ├── prisma
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── frontend
│       ├── src
│       ├── index.html
│       ├── vite.config.ts
│       └── package.json
│
├── terraform
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── versions.tf
│
├── .github
│   └── workflows
│       ├── backend-gitops.yml
│       └── frontend-s3.yml
│
└── README.md
```

## How the Deployment Works

### Frontend Deployment

The frontend is deployed using GitHub Actions.

When changes are pushed to the frontend folder:

```text
app/frontend
```

GitHub Actions will:

1. Install frontend dependencies
2. Build the React app
3. Upload the build files to S3
4. Clear the CloudFront cache

The frontend is served to users through CloudFront.

## Backend Deployment

The backend is deployed as a Docker container on an EC2 instance.

When changes are pushed to the backend folder:

```text
app/backend
```

GitHub Actions will:

1. Build the backend Docker image
2. Push the image to DockerHub
3. Connect to EC2 using AWS SSM
4. Pull the latest Docker image
5. Stop the old backend container
6. Run the new backend container
7. Run Prisma database sync
8. Check the backend health endpoint

## Infrastructure

The AWS infrastructure is created using Terraform.

Terraform creates:

* EC2 instance for backend
* RDS PostgreSQL database
* S3 bucket for frontend
* CloudFront distribution
* Security groups
* IAM role for SSM
* CloudFront routing for frontend and backend API

## API Routing

The frontend is served from CloudFront.

API requests go through this path:

```text
/api/*
```

CloudFront forwards these API requests to the backend running on EC2.

This means the frontend can call the backend using:

```text
/api
```

instead of directly using the EC2 public IP.

## Backend Health Check

The backend has a health check endpoint:

```text
/health
```

It is used to check if the backend is running properly.

There is also a readiness endpoint:

```text
/ready
```

This checks if the backend can connect to the database.

## Required GitHub Secrets

The GitHub Actions workflows need secrets to work properly.

Some required secrets are:

```text
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION

EC2_INSTANCE_ID
DATABASE_URL
JWT_SECRET
CLIENT_URL

FRONTEND_BUCKET_NAME
CLOUDFRONT_DISTRIBUTION_ID
```

These secrets should be added in:

```text
GitHub Repository > Settings > Secrets and variables > Actions
```

## Local Development

### Backend

Go to the backend folder:

```bash
cd app/backend
```

Install dependencies:

```bash
npm install
```

Run the backend:

```bash
npm run dev
```

Build the backend:

```bash
npm run build
```

Start the backend:

```bash
npm start
```

### Frontend

Go to the frontend folder:

```bash
cd app/frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

## Terraform Commands

Go to the terraform folder:

```bash
cd terraform
```

Initialize Terraform:

```bash
terraform init
```

Check the plan:

```bash
terraform plan
```

Create AWS resources:

```bash
terraform apply
```

Destroy AWS resources:

```bash
terraform destroy
```

## What I Learned From This Project

From this project, I learned how to:

* Structure a full-stack DevOps project
* Deploy a frontend using S3 and CloudFront
* Deploy a backend using Docker on EC2
* Use RDS PostgreSQL as a managed database
* Use Terraform to create AWS infrastructure
* Use GitHub Actions for CI/CD
* Use AWS SSM to deploy without SSH
* Connect frontend and backend through CloudFront routing

## Important Note

This project is mainly for learning and practice.

For a real production project, I should improve:

* Security
* Monitoring
* Logging
* HTTPS for backend origin
* Secret management
* Terraform remote state
* Better error handling
* Backup strategy
* Domain name setup

Also, sensitive files like Terraform state files and secret values should not be committed to GitHub.

## Final Summary

This project is a beginner-friendly DevOps deployment of a full-stack LMS application.

It shows how a frontend, backend, database, infrastructure, and CI/CD pipeline work together in a real cloud deployment.
