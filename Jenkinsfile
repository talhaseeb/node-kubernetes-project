pipeline {
    agent any

    environment {
        REGISTRY_CREDS = 'docker-hub-credentials'
        IMAGE_NAME = 'talha09haseeb/local-node-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
        KUBECONFIG = '/var/jenkins_home/.kube/config'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push Image to Registry') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: env.REGISTRY_CREDS,
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"

                    sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "docker push ${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    echo "Current Kubernetes Context"
                    kubectl config current-context

                    echo "Kubernetes nodes:"
                    kubectl get nodes

                    echo "Deploying image: ${IMAGE_NAME}:${IMAGE_TAG}..."
                    kubectl set image deployment/nodejs-app-deployment \
                        nodejs-app=${IMAGE_NAME}:${IMAGE_TAG}
                    
                    kubectl rollout status deployment/nodejs-app-deployment
                '''
            }
        }
    }
}