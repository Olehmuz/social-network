terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Cloud SQL (PostgreSQL) instance
resource "google_sql_database_instance" "postgres" {
  name             = "postgres-instance"
  database_version = "POSTGRES_14"
  region           = var.region
  
  deletion_protection = false
  
  settings {
    tier = "db-f1-micro"
    
    ip_configuration {
      ipv4_enabled    = true  # Дозволяє публічний IP для підключення
      
      # Дозволяємо підключення з будь-якої IP-адреси
      # В продакшені потрібно обмежити до конкретних IP-адрес
      authorized_networks {
        name  = "all"
        value = "0.0.0.0/0"
      }
    }
  }
}

# Створення бази даних
resource "google_sql_database" "database" {
  name     = var.db_name
  instance = google_sql_database_instance.postgres.name
}

# Створення користувача бази даних
resource "google_sql_user" "postgres_user" {
  name     = var.db_username
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
} 