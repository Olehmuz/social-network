variable "region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "db_name" {
  description = "Name of the database"
  type        = string
}

variable "db_username" {
  description = "Username for the database"
  type        = string
}

variable "db_password" {
  description = "Password for the database"
  type        = string
  sensitive   = true
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