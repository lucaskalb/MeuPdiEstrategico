-- +migrate Up
ALTER TABLE pdis ADD COLUMN content JSONB DEFAULT '{}'; 