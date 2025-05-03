variable "vpc_id" {
  description = "VPC ID where PostgreSQL will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the PostgreSQL RDS instance"
  type        = list(string)
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