-- create titles table 
CREATE TABLE titles (
    chat_id UUID PRIMARY KEY,
    title VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create chat table 
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    title_id UUID REFERENCES titles(chat_id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
