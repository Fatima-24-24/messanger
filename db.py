import sqlite3

conn = sqlite3.connect('messanger.db')
cur = conn.cursor()
cur.execute('''CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tel INTEGER,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    city TEXT,
    photo TEXT,
    chats INTEGER,
    last_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);''')

cur.execute('''CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mes_chat_id INTEGER,
    send_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    show INTEGER,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (send_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id)
);
''')

conn.commit()
conn.close()