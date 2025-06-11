# DevOps QR Code Generator

This project is a full-stack DevOps sample application that allows users to generate QR codes from URLs. It features a Next.js frontend, a FastAPI backend, and is containerized, orchestrated, and deployed using a modern CI/CD pipeline.

---

## 🧩 Application Overview

### Front-End (Next.js)

* Web app that allows users to input a URL.
* Sends a request to the backend to generate a QR code.

### Back-End (FastAPI)

* Accepts the URL, generates a QR code.
* Uploads the generated QR code to an AWS S3 bucket.

---

## 🧪 Run Locally

### Prerequisites

* [Docker](https://docs.docker.com/engine/install/)
* [Minikube](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fwindows%2Fx86-64%2Fstable%2F.exe+download)
* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
* [Helm](https://helm.sh/docs/intro/install/)

### Back-End (FastAPI)

```bash
# Clone the repository
cd qr-code/api

# Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Fill in your AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION, and BUCKET_NAME

# Run the API
uvicorn main:app --reload
# API will run at http://localhost:8000
```

### Front-End (Next.js)

```bash
cd qr-code/front-end-nextjs

# Install dependencies
npm install

# Run the development server
npm run dev
# Frontend will run at http://localhost:3000
```

---

## ⚙️ CI/CD with GitHub Actions

The entire CI/CD pipeline is automated using GitHub Actions and Argo CD:

### GitHub Actions

* Located in: `QR-CODE/.github/workflows/cicd.yml`
* Stages:

  1. **Webhook Trigger**: On commit push
  2. **Pull**: Pull latest code
  3. **Build & Test**:

     * Runs unit tests (`test_main.py`) for the FastAPI backend
     * (Optional) Frontend tests
  4. **Quality Gate**:

     * Runs SonarQube analysis using `sonar-project.properties`
  5. **Docker Build & Push**:

     * Builds Docker images and pushes to Docker Hub: `YOUR_USERNAME/qr-backend` and `YOUR_USERNAME/qr-frontend`
  6. **Argo CD Sync**:

     * Syncs the GitHub repo with the Kubernetes cluster for GitOps deployment

---

## 🚀 Kubernetes Deployment

This project uses Minikube for local Kubernetes and Argo CD for GitOps-style deployment.

### Install Argo CD

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
kubectl create namespace argocd
helm install argocd argo/argo-cd --namespace argocd
```

### Access Argo CD UI

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:80
```

Open `http://localhost:8080` in your browser.

### Retrieve Argo CD Admin Password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo
```

### Argo CD Application Manifest

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: qr-code-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/YOUR_USERNAME/QR-CODE.git
    targetRevision: HEAD
    path: .
  destination:
    server: https://kubernetes.default.svc
    namespace: qr-code
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

Apply the manifest with:

```bash
kubectl apply -f argocd-app.yaml
```

### Create Image Pull Secret (if private registry)

```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_USERNAME \
  --docker-password=YOUR_PAT \
  --namespace=qr-code
```

---

## 📦 Docker Setup

If Docker is not installed:
Follow: [Install Docker](https://docs.docker.com/engine/install/)

Example Build Commands:

```bash
# Build and tag backend image
cd api
docker build -t yourusername/qr-backend:latest .

# Build and tag frontend image
cd ../front-end-nextjs
docker build -t yourusername/qr-frontend:latest .
```

---

## 🛡️ Secrets

Create a `.env` file inside both `api/` and `front-end-nextjs/` directories:

**api/.env**

```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
REGION=your-region
BUCKET_NAME=your-s3-bucket
```

**front-end-nextjs/.env**

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🙌 Contributors

* [Dhruv Patil](https://github.com/dhruvpatil56) — DevOps Engineer

> This project is built as a part of DevOps Capstone, demonstrating end-to-end CI/CD, containerization, orchestration, and cloud-native deployment. 🎯

