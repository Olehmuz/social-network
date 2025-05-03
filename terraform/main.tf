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

# Network module
module "network" {
  source = "./network"
  
  region       = var.region
  vpc_cidr     = "10.0.0.0/16"
  subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
}

# Database module
module "postgres" {
  source = "./db"
  
  vpc_id      = module.network.vpc_id
  subnet_ids  = module.network.subnet_ids
  db_name     = var.db_name
  db_username = var.db_username
  db_password = var.db_password
}

# Uncomment below modules as needed

# Message broker module
module "message_broker" {
  source      = "./message_broker"
  vpc_id      = module.network.vpc_id
  subnet_ids  = module.network.subnet_ids
  mq_username = var.mq_username
  mq_password = var.mq_password
}

# Cache module
module "redis" {
  source = "./cache"
  
  vpc_id      = module.network.vpc_id
  subnet_ids  = module.network.subnet_ids
} 