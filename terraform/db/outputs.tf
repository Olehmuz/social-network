output "db_instance_endpoint" {
  description = "The connection endpoint for the PostgreSQL instance"
  value       = aws_db_instance.postgres.endpoint
}

output "db_instance_name" {
  description = "The database name"
  value       = aws_db_instance.postgres.db_name
}

output "db_instance_username" {
  description = "The master username for the database"
  value       = aws_db_instance.postgres.username
}

output "db_security_group_id" {
  description = "The ID of the security group for the PostgreSQL database"
  value       = aws_security_group.postgres_sg.id
} 