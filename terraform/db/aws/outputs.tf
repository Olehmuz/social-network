output "postgres_endpoint" {
  value       = aws_db_instance.postgres.endpoint
  description = "The endpoint of the PostgreSQL instance"
}

output "postgres_port" {
  value       = aws_db_instance.postgres.port
  description = "The port of the PostgreSQL instance"
}

output "postgres_address" {
  value       = aws_db_instance.postgres.address
  description = "The address of the PostgreSQL instance"
}

output "connection_string" {
  value       = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.endpoint}/${var.db_name}"
  description = "PostgreSQL connection string"
  sensitive   = true
}

output "security_group_id" {
  value       = aws_security_group.postgres_sg.id
  description = "The ID of the security group"
} 