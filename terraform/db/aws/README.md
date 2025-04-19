# AWS RDS PostgreSQL - Terraform

Ця конфігурація Terraform створює PostgreSQL базу даних у AWS RDS разом з необхідною мережевою інфраструктурою.

## Що створюється:

1. VPC (Virtual Private Cloud)
2. Дві підмережі в різних зонах доступності
3. Internet Gateway для доступу до інтернету
4. Таблиці маршрутизації та їх асоціації
5. Security Group для контролю доступу
6. DB Subnet Group
7. RDS PostgreSQL екземпляр

## Передумови

1. AWS аккаунт
2. AWS CLI налаштований з відповідними доступами
3. Terraform встановлений

## Налаштування

1. Відредагуйте `terraform.tfvars` файл зі своїми значеннями:
   - `region` - AWS регіон для розгортання
   - `vpc_cidr` - CIDR блок для VPC
   - `subnet_cidrs` - список CIDR блоків для підмереж
   - `db_password` - безпечний пароль для бази даних
   - `allowed_cidr_blocks` - CIDR блоки, які матимуть доступ до бази даних

## Застосування

```bash
# Ініціалізація Terraform
terraform init

# Перегляд плану
terraform plan

# Застосування змін
terraform apply
```

## Після розгортання

Після успішного розгортання, використовуйте вихідні дані для підключення до бази даних:

```bash
# Отримання endpoint бази даних
terraform output postgres_endpoint

# Отримання рядка підключення (чутлива інформація)
terraform output -raw connection_string
```

## Очищення ресурсів

```bash
terraform destroy
``` 