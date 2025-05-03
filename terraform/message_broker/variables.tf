variable "vpc_id" {
  description = "VPC ID where the MQ broker will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs where the MQ broker will be deployed"
  type        = list(string)
}

variable "mq_username" {
  description = "Username for RabbitMQ broker"
  type        = string
  default     = "admin"
}

variable "mq_password" {
  description = "Password for RabbitMQ broker"
  type        = string
  sensitive   = true
} 