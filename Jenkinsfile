pipeline {
    agent any

    environment {
        REGISTRY_CREDS = 'docker-hub-credentials'
        IMAGE_NAME = 'talha09haseeb/local-node-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
        
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
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage('Update the Kubernetes manifest') {
            steps {
                sh """
                    sed -i 's|image: ${IMAGE_NAME}:.*|image: ${IMAGE_NAME}:${IMAGE_TAG}|' k8s/deployment.yaml
                """
            }
        }

        stage('Commit and Push Manifest') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-new',
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_TOKEN'
                    )
                ]) {
                    sh """
                        git config user.email "talhahaseeb2@gmail.com"
                        git config user.name "talhaseeb"

                        git add k8s/deployment.yaml
                        git commit -m "Update image to ${IMAGE_NAME}:${IMAGE_TAG}" || echo "No changes to commit"
                        git push https://${GIT_USER}:${GIT_TOKEN}@github.com/talhaseeb/node-kubernetes-project.git HEAD:main
                    """
                }
            }
        }

        // stage('Deploy to Kubernetes') {
        //     steps {
        //         sh '''
        //             echo "Current Kubernetes Context"
        //             kubectl config current-context

        //             echo "Kubernetes nodes:"
        //             kubectl get nodes

        //             echo "Deploying image: ${IMAGE_NAME}:${IMAGE_TAG}..."
        //             kubectl set image deployment/nodejs-app-deployment \
        //                 nodejs-app=${IMAGE_NAME}:${IMAGE_TAG}
                    
        //             kubectl rollout status deployment/nodejs-app-deployment
        //         '''
        //     }
        // }
    }
}