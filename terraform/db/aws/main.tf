terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region     = var.region
  # Розкоментуйте наступні рядки та вкажіть ваші облікові дані AWS
  # access_key = var.aws_access_key
  # secret_key = var.aws_secret_key
  
  # АБО налаштуйте AWS CLI:
  # $ aws configure
  # (Та введіть ваші AWS credentials)
}

# Security Group для PostgreSQL
resource "aws_security_group" "postgres_sg" {
  name        = "postgres-sg"
  description = "Allow PostgreSQL inbound traffic"
  vpc_id      = local.vpc_id  # Використовуємо локальну змінну з vpc.tf
  
  ingress {
    description = "PostgreSQL from anywhere"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "postgres-sg"
  }
}

# Subnet Group для RDS
resource "aws_db_subnet_group" "postgres_subnet_group" {
  name       = "postgres-subnet-group"
  subnet_ids = local.subnet_ids  # Використовуємо локальну змінну з vpc.tf
  
  tags = {
    Name = "PostgreSQL subnet group"
  }
}

resource "aws_db_parameter_group" "pg_no_ssl" {
  name        = "postgres16-no-ssl"
  family      = "postgres16"
  description = "Disable force SSL for dev"

  parameter {
    name  = "rds.force_ssl"
    value = "0"
  }
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "postgres" {
  identifier           = "postgres-instance"
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "16.6"
  instance_class       = "db.t3.micro"
  db_name              = var.db_name
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = aws_db_parameter_group.pg_no_ssl.name
  publicly_accessible  = true
  skip_final_snapshot  = true
  db_subnet_group_name = aws_db_subnet_group.postgres_subnet_group.name
  vpc_security_group_ids = [aws_security_group.postgres_sg.id]
  
  tags = {
    Name = "PostgreSQL Database"
  }
} 