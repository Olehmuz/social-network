output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.app_vpc.id
}

output "subnet_ids" {
  description = "IDs of the subnets"
  value       = [aws_subnet.app_subnet_1.id, aws_subnet.app_subnet_2.id]
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.app_vpc.cidr_block
} 