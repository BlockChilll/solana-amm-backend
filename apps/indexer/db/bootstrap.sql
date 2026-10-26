CREATE SCHEMA IF NOT EXISTS squid_processor;

CREATE TABLE IF NOT EXISTS squid_processor.status (
    id int4 PRIMARY KEY,
    height int4 NOT NULL,
    hash text DEFAULT '0x',
    nonce int4 DEFAULT 0
);

INSERT INTO squid_processor.status (id, height, hash)
VALUES (
    0,
    514880719,
    'APQETN2jDv2fFfVQQaPUmU2jVnEb5cXHESbScLxS43vE'
);
