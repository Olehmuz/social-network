# Опціональний файл для створення нового VPC
# Розкоментуйте та використовуйте, якщо у вас немає існуючого VPC

# Створення VPC та підмереж для PostgreSQL

resource "aws_vpc" "postgres_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  
  tags = {
    Name = "postgres-vpc"
  }
}

resource "aws_subnet" "postgres_subnet_1" {
  vpc_id            = aws_vpc.postgres_vpc.id
  cidr_block        = var.subnet_cidrs[0]
  availability_zone = "${var.region}a"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "postgres-subnet-1"
  }
}

resource "aws_subnet" "postgres_subnet_2" {
  vpc_id            = aws_vpc.postgres_vpc.id
  cidr_block        = var.subnet_cidrs[1]
  availability_zone = "${var.region}b"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "postgres-subnet-2"
  }
}

resource "aws_internet_gateway" "postgres_igw" {
  vpc_id = aws_vpc.postgres_vpc.id
  
  tags = {
    Name = "postgres-igw"
  }
}

resource "aws_route_table" "postgres_rt" {
  vpc_id = aws_vpc.postgres_vpc.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.postgres_igw.id
  }
  
  tags = {
    Name = "postgres-rt"
  }
}

resource "aws_route_table_association" "postgres_rt_assoc_1" {
  subnet_id      = aws_subnet.postgres_subnet_1.id
  route_table_id = aws_route_table.postgres_rt.id
}

resource "aws_route_table_association" "postgres_rt_assoc_2" {
  subnet_id      = aws_subnet.postgres_subnet_2.id
  route_table_id = aws_route_table.postgres_rt.id
}

# Використовуємо локальні змінні для передачі значень в інші ресурси
locals {
  vpc_id     = aws_vpc.postgres_vpc.id
  subnet_ids = [aws_subnet.postgres_subnet_1.id, aws_subnet.postgres_subnet_2.id]
}

/*
resource "aws_vpc" "postgres_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  
  tags = {
    Name = "postgres-vpc"
  }
}

resource "aws_subnet" "postgres_subnet_1" {
  vpc_id            = aws_vpc.postgres_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.region}a"
  
  tags = {
    Name = "postgres-subnet-1"
  }
}

resource "aws_subnet" "postgres_subnet_2" {
  vpc_id            = aws_vpc.postgres_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.region}b"
  
  tags = {
    Name = "postgres-subnet-2"
  }
}

resource "aws_internet_gateway" "postgres_igw" {
  vpc_id = aws_vpc.postgres_vpc.id
  
  tags = {
    Name = "postgres-igw"
  }
}

resource "aws_route_table" "postgres_rt" {
  vpc_id = aws_vpc.postgres_vpc.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.postgres_igw.id
  }
  
  tags = {
    Name = "postgres-rt"
  }
}

resource "aws_route_table_association" "postgres_rt_assoc_1" {
  subnet_id      = aws_subnet.postgres_subnet_1.id
  route_table_id = aws_route_table.postgres_rt.id
}

resource "aws_route_table_association" "postgres_rt_assoc_2" {
  subnet_id      = aws_subnet.postgres_subnet_2.id
  route_table_id = aws_route_table.postgres_rt.id
}

# Використовуйте ці значення замість тих, що задані в terraform.tfvars
locals {
  vpc_id     = aws_vpc.postgres_vpc.id
  subnet_ids = [aws_subnet.postgres_subnet_1.id, aws_subnet.postgres_subnet_2.id]
}
*/ 