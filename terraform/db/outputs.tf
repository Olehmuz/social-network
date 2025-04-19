output "postgres_public_ip" {
  value       = google_sql_database_instance.postgres.public_ip_address
  description = "The public IP address of the PostgreSQL instance"
}

output "connection_string" {
  value       = "postgresql://${var.db_username}:${var.db_password}@${google_sql_database_instance.postgres.public_ip_address}:5432/${var.db_name}"
  description = "PostgreSQL connection string"
  sensitive   = true
} 