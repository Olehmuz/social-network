output "vpc_id" {
  description = "ID of the VPC"
  value       = module.network.vpc_id
}

output "subnet_ids" {
  description = "IDs of the subnets"
  value       = module.network.subnet_ids
}

output "postgres_endpoint" {
  description = "PostgreSQL endpoint"
  value       = module.postgres.db_instance_endpoint
}

output "postgres_connection_string" {
  value       = "postgresql://${var.db_username}:${var.db_password}@${module.postgres.db_instance_endpoint}/${var.db_name}"
  description = "PostgreSQL connection string"
  sensitive   = true
}

output "redis_connection_string" {
  value       = "redis://${module.redis.redis_endpoint}:6379"
  description = "Redis connection string"
  sensitive   = true
}

# Uncomment when the modules are enabled
# output "kafka_endpoint" {
#   description = "Kafka endpoint"
#   value       = module.kafka.kafka_endpoint
# }

# output "redis_endpoint" {
#   description = "Redis endpoint"
#   value       = module.redis.redis_endpoint
# }

# Message Broker outputs
output "rabbitmq_broker_id" {
  description = "The ID of the RabbitMQ broker"
  value       = module.message_broker.broker_id
}

output "rabbitmq_endpoint" {
  description = "The primary endpoint of the RabbitMQ broker"
  value       = module.message_broker.primary_endpoint
} 