output "broker_id" {
  description = "The ID of the RabbitMQ broker"
  value       = aws_mq_broker.rabbitmq.id
}

output "broker_arn" {
  description = "The ARN of the RabbitMQ broker"
  value       = aws_mq_broker.rabbitmq.arn
}

output "primary_endpoint" {
  description = "The primary endpoint of the RabbitMQ broker"
  value       = aws_mq_broker.rabbitmq.instances[0].endpoints[0]
}

output "console_url" {
  description = "The URL to access the web console for the RabbitMQ broker"
  value       = "https://${aws_mq_broker.rabbitmq.instances[0].console_url}"
} 