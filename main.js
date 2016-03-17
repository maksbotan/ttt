// Функция инициализации
$(function() {
    var field = $("#ttt");
    for (var i = 0; i < 3; i++) {
        var row = $("<tr>");
        for (var j = 0; j < 3; j++) {
            row.append($("<td>").data("x", i).data("y", j));
        }
        field.append(row);
    }
    $("#ttt td").click(click);
});

// Основная функция минимакса
// Аргументы:
// state -- текущее состояние игрового поля
// a, b -- текущие значения параметров отсечения alpha и beta
// max -- какой игрок. true если компьютер, false если человек
function minimax(state, a, b, max) {
    var finish = isFinish(state);
    if (finish != null)
        return [finish, null];

    if (max) {
        var v = -1000000;
        var targetMoves = moves(state, 'o');
        var winMove = null;
        for (var move of targetMoves) {
            // Перебираем все возможные наши ходы и пытаемся просчитать ходы противника
            var test = minimax(move, a, b, false);
            if (test[0] > v) {
                // Если нашли ветку, где гарантированно можем лучше, чем известно сейчас, запомним её
                v = test[0];
                winMove = move;
            }
            a = Math.max(a, v);
            // Проверим условие альфа-бета отсечения и обрежем заведомо ненужные ветки перебора
            if (b <= a)
                break;
        }
        return [v, winMove];
    } else {
        // Аналогично случаю хода компьютера
        var v = 1000000;
        var targetMoves = moves(state, 'x');
        for (var move of targetMoves) {
            var test = minimax(move, a, b, true);
            if (test[0] < v) {
                v = test[0];
                winMove = move;
            }
            b = Math.min(b, v);
            if (b <= a)
                break;
        }
        return [v, winMove];
    }
}

// Проверяем, является ли состояние конечным
// Возвращаемое значение:
// 1 -- выиграл компьютер
// 0 -- ничья
// -1 -- выиграл человек
// null -- не конечное состояние
function isFinish(state) {
    for (var i = 0; i < 3; i++) {
        if (state[i][0] == 'o' && state[i][1] == 'o' && state[i][2] == 'o')
            return 1;
        if (state[0][i] == 'o' && state[1][i] == 'o' && state[2][i] == 'o')
            return 1;
        if (state[i][0] == 'x' && state[i][1] == 'x' && state[i][2] == 'x')
            return -1;
        if (state[0][i] == 'x' && state[1][i] == 'x' && state[2][i] == 'x')
            return -1;
    }
    if (state[0][0] == 'o' && state[1][1] == 'o' && state[2][2] == 'o')
        return 1;
    if (state[2][0] == 'o' && state[1][1] == 'o' && state[0][2] == 'o')
        return 1;
    if (state[0][0] == 'x' && state[1][1] == 'x' && state[2][2] == 'x')
        return -1;
    if (state[2][0] == 'x' && state[1][1] == 'x' && state[0][2] == 'x')
        return -1;

    for (var i = 0; i < 3; i++)
        for (var j = 0; j < 3; j++)
            if (state[i][j] == '')
                return null;

    return 0;
}

// Генерируем все возможные ходы каким-либо символом
function moves(state, symbol) {
    var res = [];
    for (var i = 0; i < 3; i++)
        for (var j = 0; j < 3; j++) {
            if (state[i][j] == '') {
                var move = $.extend(true, [], state);
                move[i][j] = symbol;
                res.push(move);
            }
        }
    return res;
}

// Читаем текущее состояние из HTML страницы
function getState() {
    var state = [];
    for (var row of $("#ttt tr")) {
        var state_row = [];
        for (var cell of $(row).find("td")) {
            var val = $(cell).text();
            if (val == 'X')
                state_row.push('x')
            else {
                if (val == 'O')
                    state_row.push('o')
                else
                    state_row.push('')
            }
        }
        state.push(state_row);
    }
    return state;
    return state;
}

// Отображаем новое состояние на экране
function setState(state) {
    var i = 0;
    for (var row of $("#ttt tr")) {
        var j = 0;
        for (var cell of $(row).find("td")) {
            if (state[i][j] == 'x')
                $(cell).text('X')
            if (state[i][j] == 'o')
                $(cell).text('O')
            j++;
        }
        i++;
    }
}

// Один шаг игры -- вызвать minimax, сделать ход, отобразить результат
function gameStep() {
    var res = minimax(getState(), -1000000, 1000000, true);
    if (res[1] != null) {
        setState(res[1]);
    } else {
        res[1] = getState();
    }
    var finish = isFinish(res[1]);
    if (finish != null) {
        if (finish == 1)
            $("#result").text("Computer wins");
        if (finish == -1)
            $("#result").text("You win");
        if (finish == 0)
            $("#result").text("Draw");
    }
}

// Функция-обработчик нажатия на поле
function click() {
    var val = $(this).text();
    if (val == 'O' || val == 'X')
        return;

    $(this).text('X');
    gameStep();
}
