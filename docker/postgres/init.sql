SELECT 'CREATE DATABASE identity'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'identity')\gexec
SELECT 'CREATE DATABASE catalog'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'catalog')\gexec
SELECT 'CREATE DATABASE cart'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'cart')\gexec
SELECT 'CREATE DATABASE orders'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'orders')\gexec
SELECT 'CREATE DATABASE account'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'account')\gexec
SELECT 'CREATE DATABASE sellers'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sellers')\gexec
SELECT 'CREATE DATABASE payments'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'payments')\gexec
SELECT 'CREATE DATABASE panel'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'panel')\gexec
SELECT 'CREATE DATABASE products'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'products')\gexec
SELECT 'CREATE DATABASE tickets'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tickets')\gexec
