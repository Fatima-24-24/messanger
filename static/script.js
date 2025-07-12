$(document).ready(function() {
    let mespol = 0
    let mesconinf = 0 
    let main_user_id = 0
    let conv_user_id = 0
    let mes_chat_id = 0
    $('#a4').click(function() {
        $('#a5').css('display', 'none')
        $('#a6').css('display', 'block')

    });
//&& - и
//|| - или



    $(document).on('click', '#left_part .chats', function() { 
        alert("нажали на чат")
        $('#right_part').empty()
        conv_user_id = $(this).data('id');
        let result = mesconinf.find(item => item[0] == conv_user_id); //находим информацию по конкретному id
        let mess = mespol.filter(item => (item[2] == main_user_id && item[3] == conv_user_id) || (item[2] == conv_user_id && item[3] == main_user_id));
        mes_chat_id = Number (mess.length)
        let messagesHTML = mess.map(msg => `<div class="message"><div class="mes_text">${msg[4]}</div><div class="mes_time">${msg[6]}</div></div>`).join('');
        

        // messages = [[1, "Привет!", 1001, 2002],  [2, "Как дела?", 2002, 1001]]
        // [1, "Привет!", 1001, 2002] - В МАП ПОЙДЕТ ПЕРВЫМ
        // let messagesHTML = messages.map(msg => `<div class="message">${msg[1]}</div>`).join('');


        $('#right_part').append(`
            <div id="a16"><img class="user_avatar" src="${result[6]}"> ${result[3]} ${result[4]}</div><div id="a17">${messagesHTML}</div><input id="a19" type="text" placeholder="Cообщение" name="message"><button type="text" id="a20">Отправить</button>`)
        
        //for (let i in mess){
        //    $('#a17').append(`<div class="message">${i}</div>`)
        //}
        
        console.log(mespol)
    });


    $(document).on('click', '#right_part #a20', function() { 
        let message = document.getElementById('a19').value;
        let time = new Date();
        console.log(time)
        $.ajax({
            url: "/send_mes",
            method: "POST",
            contentType: "application/json", // 👈 важно!
            data: JSON.stringify({
                'message': message,
                'time': time,
                'send_id': main_user_id,
                'receiver_id': conv_user_id,
                'mes_chat_id': mes_chat_id + 1
        }),
            success: function(response) {
                $('#a17').append(`<div class="message"><div class="mes_text">${response.message}</div><div class="mes_time">${response.time}</div></div>`)
                alert("Загрузили сообщение")
            }
        });
    });

    $('#b1').click(function() {
        let tel = document.getElementById('find_user').value;
        let main_user_id2 = main_user_id
        console.log(main_user_id2, tel)
        $.ajax({
            url: "/find_user",
            method: "POST",
            contentType: "application/json", // 👈 важно!
            data: JSON.stringify({
                'main_user_id': main_user_id2,
                'tel': tel
            }),
            success: function(response) {
                console.log(response)
                q=0
                $('#a17').empty()
                $('#a16').empty()
                $('#a17').append(`<div class="message">`)
                $('#a16').append(`<img class="user_avatar" src="${response.user_data[4]}"> ${response.user_data[2]} ${response.user_data[3]}</div>`)
                while (true) {
                    q+=1
                    let result = response.send_main.find(item => item[1] == q); //находим информацию по конкретному id
                    console.log('Вывод result send_main', result)
                    if (!result) {
                        result = response.receive_main.find(item => item[1] == q);
                        console.log('Вывод result receive_main', result)
                        if (!result) {
                            break
                        }
                        $('#a17').append(`<div class="conv_user_mes_text"><div>${result[4]}</div><div class="mes_time">${result[6]}</div></div>`)
                    }
                    $('#a17').append(`<div class="main_user_mes_text"><div>${result[4]}</div><div class="mes_time">${result[6]}</div></div>`)
                }
                $('#a17').append(`</div><input id="a19" type="text" placeholder="Cообщение" name="message"><button type="text" id="a20">Отправить</button>`)
            }
        });
    });

    $('#a3').click(function() {
        let tel = document.getElementById('a1').value;
        let password = document.getElementById('a2').value;
        $.ajax({
            url: "/check_inf",
            method: "POST",
            contentType: "application/json", // 👈 важно!
            data: JSON.stringify({
                'tel': tel,
                'password': password
            }),
            success: function(response) {
                console.log(response)
                mesconinf = response.conv_user_info
                mespol = response.mes
                main_user_id = response.user_info[0]
                //alert( `Данные успешно отправлены! ${response.result}`);
                $('#a18').css('display', 'block')
                if (response.s == 1){
                    $('#a14').append(`
                            <div id="left_part">
                                <div id="user_info"><div id="user_avatar"><img class="user_avatar" src="${response.user_info[4]}"></div></div>
                                <div id="user_name" class="user_name">${response.user_info[2]} ${response.user_info[3]}</div>
                            </div>
                            <div id="right_part"></div>`);
                    let x = 2;
                   
                    for (let i in response.conv_user_info) {
                        let item = response.conv_user_info[i];      
                        let avatarUrl = item[6];
                        let namePart = item[3] + item[4];
                        let id_per = item[0]
                        $('#left_part').append(`
                            <div class="chats" data-id="${id_per}">
                            <div id="user_avatar">
                                <img class="user_avatar" src="${avatarUrl}">
                            </div>
                            <div id="user_name">
                                ${namePart}
                            </div></div>
                        `);
                    }

                    //<div id="right_part">
                    //    <div id="a16">${response.conv_user_info}</div>
                    //    <div id="a17">${response.mes}</div>
                    //</div>

                    // $('#t19').append(`<div>Данные успешно отправлены!<br> Ваши логин и пароль: <br> ${n.login} ${n.password}<div>`);
                    $('#a5').css('display', 'none')
                
                }
                else{
                    alert("Ошибка");
                    console.log(response)
                }
               
            },
            error: function() {
                //alert("Ошибка отправки данных");
            }

        });
    });

    $('#a13').click(function() {
        let tel = document.getElementById('a7').value;
        let password = document.getElementById('a8').value;
        let name = document.getElementById('a9').value;
        let surname = document.getElementById('a10').value;
        let city = document.getElementById('a11').value;
        let photo = document.getElementById('a12').value;
        $.ajax({
            url: "/registration",
            method: "POST",
            contentType: "application/json", // 👈 важно!
            data: JSON.stringify({
                'tel': tel,
                'password': password,
                'name': name,
                'surname': surname,
                'city': city,
                'photo': photo
            }),
            success: function(response) {
                if (response.reg == 1){
                    $('#a5').css('display', 'block')
                    $('#a6').css('display', 'none')
                    alert("Вы успешно зарегистрировались!");
                }
                else{
                    alert("Ошибка, пользователь c таким телефоном уже существует!");
                }
               
            },
            error: function() {
                //alert("Ошибка отправки данных");
            }

        });
    });

    function renew() {
        let main_user_id2 = main_user_id
        let conv_user_id2 = conv_user_id

        $.ajax({
            url: "/renew",
            method: "POST",
            contentType: "application/json", // 👈 важно!
            data: JSON.stringify({
                'main_user_id': main_user_id2,
                'conv_user_id': conv_user_id2,
            }),

            success: function(response) {
                q=0
                $('#a17').empty()
                $('#a17').append(`<div class="message">`)

                while (true) {
                    q+=1
                    let result = response.send_main.find(item => item[1] == q); //находим информацию по конкретному id
                    if (!result) {
                        result = response.receive_main.find(item => item[1] == q);
                        if (!result) {
                            break
                        }
                        $('#a17').append(`<div class="conv_user_mes_text"><div>${result[4]}</div><div class="mes_time">${result[6]}</div></div>`)
                    }
                    $('#a17').append(`<div class="main_user_mes_text"><div>${result[4]}</div><div class="mes_time">${result[6]}</div></div>`)
                }
                $('#a17').append(`</div>`)
            }
        })
    }

    let intervalId = setInterval(renew, 10000);
    

});