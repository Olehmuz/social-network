variable "region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

# AWS Credentials змінні
variable "aws_access_key" {
  description = "AWS Access Key ID"
  type        = string
  default     = ""
  sensitive   = true
}

variable "aws_secret_key" {
  description = "AWS Secret Access Key"
  type        = string
  default     = ""
  sensitive   = true
}

variable "vpc_cidr" {
  description = "CIDR block для VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidrs" {
  description = "CIDR блоки для підмереж"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

# Ці змінні більше не використовуються для визначення ресурсів, але залишаються
# для зворотної сумісності та документації
variable "vpc_id" {
  description = "VPC ID (не використовується, VPC створюється автоматично)"
  type        = string
  default     = ""
}

variable "subnet_ids" {
  description = "List of subnet IDs (не використовується, підмережі створюються автоматично)"
  type        = list(string)
  default     = []
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "api"
}

variable "db_username" {
  description = "PostgreSQL username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to connect to the database"
  type        = list(string)
  default     = ["0.0.0.0/0"]
} 