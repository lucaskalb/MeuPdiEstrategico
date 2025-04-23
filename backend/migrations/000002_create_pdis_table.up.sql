-- +migrate Up
CREATE TABLE IF NOT EXISTS pdis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    user_id UUID NOT NULL,
    activated BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pdis_user_id ON pdis(user_id);
CREATE INDEX IF NOT EXISTS idx_pdis_deleted_at ON pdis(deleted_at);
CREATE INDEX IF NOT EXISTS idx_pdis_status ON pdis(status);

CREATE TRIGGER update_pdis_updated_at
    BEFORE UPDATE ON pdis
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

