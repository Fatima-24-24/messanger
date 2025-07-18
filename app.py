from flask import Flask,render_template, request, jsonify
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your_secret_key'
#app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)

@app.route('/')
def main():
      return render_template('index.html')

@app.route('/check_inf', methods=['POST'])
def check_inf():
    try:
        # Подключение к БД с контекстным менеджером
        with sqlite3.connect('messanger.db') as conn:
            cur = conn.cursor()
            data = request.get_json()
            
            tel = data.get('tel')
            password = data.get('password')
            print(tel)
            print(password)

            # Единый запрос для получения данных пользователя
            cur.execute('''SELECT user_id, password, name, surname, photo, tel, city, last_time, chats FROM users WHERE tel=?''', (tel,))
            user_data = cur.fetchone()
            print(user_data)


            if not user_data or not check_password_hash(user_data[1], password):
                print('Проверка не прошла')
                return jsonify({'s': 0})

            user_id, _,  name, surname, photo, tel, city, last_time, chats = user_data
            
            # Получение сообщений и информации о пользователях в чатах
            cur.execute('SELECT * FROM messages WHERE send_id=? or receiver_id=?', (user_id, user_id,))
            messages = cur.fetchall()
            print(messages)
            
            
            chat_users = []
            if chats:
                chat_ids = ','.join(['?']*len(chats))
                cur.execute(f'SELECT * FROM users WHERE user_id IN ({chat_ids})', chats)
                chat_users = cur.fetchall()
                test = {'s': 1,
                'user_info': user_data,
                'mes': messages,
                'chats': chats,
                'conv_user_info': chat_users}
                print(test)

            return jsonify({
                's': 1,
                'user_info': user_data,
                'mes': messages,
                'chats': chats,
                'conv_user_info': chat_users
            })

    except sqlite3.Error as e:
        # Обработка ошибок базы данных
        return jsonify({'s': 0, 'error': str(e)})
    except Exception as e:
        # Общая обработка ошибок
        return jsonify({'s': 0, 'error': str(e)})


    else:
        return jsonify({'s': 0})

@app.route('/find_user', methods=['POST'])
def find_user():
    conn = sqlite3.connect('messanger.db')
    cur = conn.cursor()
    data = request.get_json()
    
    tel = data.get('tel')
    main_user_id = data.get('main_user_id')
    print(main_user_id, tel)

    cur.execute('''SELECT user_id, password, name, surname, photo, tel, city, last_time, chats FROM users WHERE tel=?''', (tel,))
    user_data = cur.fetchone()
    print(user_data)

    cur.execute('SELECT * FROM messages WHERE send_id=? and receiver_id=?', (main_user_id, user_data[0],))
    send_main = cur.fetchall()
    print(send_main)

    cur.execute('SELECT * FROM messages WHERE send_id=? and receiver_id=?', (user_data[0], main_user_id,))
    receive_main = cur.fetchall()
    print(receive_main)

    return jsonify({'user_data': user_data, 'send_main': send_main, 'receive_main': receive_main})


@app.route('/registration', methods=['POST'])
def registration(): 
    conn = sqlite3.connect('messanger.db')
    cur = conn.cursor()

    data = request.get_json()  

    tel = data.get('tel')
    password = data.get('password')
    name = data.get('name')
    surname = data.get('surname')
    city = data.get('city')
    photo = data.get('photo')
   
    hashed_password = generate_password_hash(password)

    cur.execute('SELECT * FROM users WHERE tel=?', (tel,))
    result = cur.fetchall()
    print(tel,password,name,surname,city,photo)
    if not result:
        conn.execute('INSERT INTO users (tel, password, name, surname, city, photo) VALUES (?, ?, ?, ?, ?, ?)',(tel, hashed_password, name, surname, city, photo))
        conn.commit()
        conn.close()
        return jsonify({'reg': 1})
    else:
        return jsonify({'reg': 0})

@app.route('/send_mes', methods=['POST'])
def send_mes(): 
    conn = sqlite3.connect('messanger.db')
    cur = conn.cursor()

    data = request.get_json()  

    message = data.get('message')
    time = data.get('time')
    send_id = data.get('send_id')
    receiver_id = data.get('receiver_id')
    mes_chat_id = data.get('mes_chat_id')
    show = 1

    conn.execute('INSERT INTO messages (mes_chat_id, send_id, receiver_id, content, show, sent_at) VALUES (?, ?, ?, ?, ?, ?)',(mes_chat_id, send_id, receiver_id, message, show, time))
    conn.commit()
    conn.close()
    return jsonify({'message': message, 'sent_at': time})


@app.route('/renew', methods=['POST'])
def renew(): 
    conn = sqlite3.connect('messanger.db')
    cur = conn.cursor()

    data = request.get_json()  

    main_user_id = data.get('main_user_id')
    conv_user_id = data.get('conv_user_id')

    cur.execute('SELECT * FROM messages WHERE send_id=? and receiver_id=?', (main_user_id, conv_user_id,))
    send_main = cur.fetchall()

    cur.execute('SELECT * FROM messages WHERE send_id=? and receiver_id=?', (conv_user_id, main_user_id,))
    receive_main = cur.fetchall()

    conn.commit()
    conn.close()

    print(send_main)
    print(receive_main)
    
    return jsonify({'send_main': send_main, 'receive_main': receive_main})

if __name__ == '__main__':
    #app.run(debug=True)
    app.run(host='0.0.0.0', port=5000, debug=True)