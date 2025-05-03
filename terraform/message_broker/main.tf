resource "aws_security_group" "mq_sg" {
  name        = "mq-sg"
  description = "Allow MQ inbound traffic"
  vpc_id      = var.vpc_id
  
  ingress {
    description = "MQ from VPC"
    from_port   = 5671
    to_port     = 5671
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "MQ Web Console"
    from_port   = 443
    to_port     = 443
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
    Name = "mq-sg"
  }
}

resource "aws_mq_broker" "rabbitmq" {
  broker_name         = "rabbitmq-broker"
  engine_type         = "RabbitMQ"
  engine_version      = "3.13"
  host_instance_type  = "mq.t3.micro"
  security_groups     = [aws_security_group.mq_sg.id]
  subnet_ids          = [var.subnet_ids[0]]
  deployment_mode     = "SINGLE_INSTANCE"
  publicly_accessible = false
  auto_minor_version_upgrade = true
  
  user {
    username = var.mq_username
    password = var.mq_password
  }
  
  tags = {
    Name = "RabbitMQ Broker"
  }
} 