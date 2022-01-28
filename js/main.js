var game_ready = false;

var rows;
var arr_ships_pc;//массив кораблей pc
var arr_ships_player;//массив кораблей игрока
var block_play = document.getElementsByClassName("block_play");//область для игры

var max_row = 15;//кол-во строк
var max_col = 20;//кол-во стобцов

var free_place = "#b3d4fc"; //0 / клетка свободна
var miss_place = "rgb(112, 255, 75)"; //1 / клетка 'промах'
var hit_place = "rgba(187, 187, 187, 0.37)"; //2 / клетка 'попадание'
var destroy_place = "rgb(255,142,142)"; //3
var ship_place = "white"; //4 / 'клетка 'корабль'

function send_name_player() {//функция для ввода имени
  var name_player = document.getElementById("input_name_player").value;

  if (name_player != "")
  {
    //Скрываем блок для ввода имени, показываем область с игрой
    document.getElementsByClassName("block_input_name")[0].style.display = "none";
    document.getElementsByClassName("block_game")[0].style.display = "flex";

    //Переносим имя в игру
    document.getElementById("name_player").innerHTML  = name_player;

    //Создание сетки
    create_grid();
  }
}

function create_grid()
{
  //Создание сетки для игры
  for(var j = 0; j < max_row; j++)
  {

    //для обозначения ряда (для игрока и для компьютера)
    var div_row1 = document.createElement('div');
    var div_row2 = document.createElement('div');
    div_row1.classList.add('row');
    div_row2.classList.add('row');

    //сетка
    for(var i = 0; i < max_col; i++)
    {
      var div1 = document.createElement('div');
      div1.classList.add('cell');
      //задаём аттрибут с координатами
      div1.setAttribute("coordination", j.toString() + "," + i.toString());

      var div2 = document.createElement('div');
      div2.classList.add('cell');
      //задаём аттрибут с координатами
      div2.setAttribute("coordination", j.toString() + "," + i.toString());
      div2.setAttribute('onclick','play_game(this);');

      div_row1.appendChild(div1);
      div_row2.appendChild(div2);
    }

    block_play[0].appendChild(div_row1);
    block_play[1].appendChild(div_row2);
  }
}

function getRandomInt(max) {//рандомайзер
  return Math.floor(Math.random() * max);
}

function show_enemy_ships()//показывает и скрывает корабли противника
{
  var block = document.getElementsByClassName("btn_show_ship")[0].getElementsByClassName("btn")[0];

  if(block.textContent == "Скрыть корабли противника")
  {
    clear_place(block_play[1]);
    show_ships(block_play[1], arr_ships_pc, false);
    block.textContent = "Показать корабли противника";
  }
  else
  {
    clear_place(block_play[1]);
    show_ships(block_play[1], arr_ships_pc, true);
    block.textContent = "Скрыть корабли противника";
  }
}

function generate_game()//генерация кораблей и подготовка интерфейса
{
  //интерфейс
  if(document.getElementsByClassName("btn_generate")[0].children[0].textContent === "Начать игру заново")
  {
    document.getElementsByClassName("btn_generate")[0].children[0].textContent = "Генерация кораблей";
    document.getElementsByClassName("btn_start")[0].children[0].style.display = "block";
    document.getElementsByClassName('block_messages')[0].style.display = 'none';
    document.getElementsByClassName("block_name_game")[0].children[0].textContent = "Морской бой";
  }

  document.getElementsByClassName("btn_show_ship")[0].
  getElementsByClassName("btn")[0].textContent = "Показать корабли противника";

  //подгтовка игры
  game_ready = false;
  game_over_flag = false;

  //генерация кораблей
  arr_ships_player = init_ships(block_play[0]);
  arr_ships_pc = init_ships(block_play[1]);

  //вывод кораблей на поля
  show_ships(block_play[0], arr_ships_player, true);
  show_ships(block_play[1], arr_ships_pc);
}

function start_game()
{
  game_ready = true;
  document.getElementsByClassName("btn_generate")[0].children[0].textContent = "Начать игру заново";
  document.getElementsByClassName("btn_start")[0].children[0].style.display = "none";
  document.getElementsByClassName("block_name_game")[0].children[0].textContent = "Ваш ход";
}

function show_ships(block_play, array, show_white = false)//вывод кораблей на поля
{
  rows = block_play.getElementsByClassName('row');
  for(var i = 0; i < max_row; i++)
  {
    for(var j = 0; j < max_col; j++)
    {
      if(array[i][j] === 0)
        rows[i].getElementsByClassName('cell')[j].style.backgroundColor = free_place;
      else if(array[i][j] === 1)
        rows[i].getElementsByClassName('cell')[j].style.backgroundColor = miss_place;
      else if(array[i][j] === 2)
        rows[i].getElementsByClassName('cell')[j].style.backgroundColor = hit_place;
      else if(array[i][j] === 3)
        rows[i].getElementsByClassName('cell')[j].style.backgroundColor = destroy_place;
      else if(array[i][j] === 4 && show_white)
        rows[i].getElementsByClassName('cell')[j].style.backgroundColor = ship_place;
    }
  }
}

function clear_place(block_play)//очищение поля (визуально)
{
  rows = block_play.getElementsByClassName('row');
  for(var i = 0; i < max_row; i++)
  {
    for(var j = 0; j < max_col; j++)
    {
      rows[i].getElementsByClassName('cell')[j].style.backgroundColor = free_place;
    }
  }
}

function init_ships(block_play)//генерация кораблей
{
  var array_ships = new Array(max_row);
  //запишем каждую клетку в двумерный массив array_ships
  for(var i = 0; i < max_row; i++)
  {
    array_ships[i] = new Array(max_col);
    for(var j = 0; j < max_col; j++)
    {
      array_ships[i][j] = 0;
    }
  }

  show_ships(block_play, array_ships);

  //количество кораблей и сколько имеет палуб
  var ships_four = 5; //5 ships (4)
  var ships_two = 6; //6 ships (2)
  var ships_one = 8; //8 ships (1)

  for(var  i = 0; i < ships_four; i++)
    create_ships(4, array_ships);

  for(var i = 0; i < ships_two; i++)
    create_ships(2, array_ships)

  for(var i = 0; i < ships_one; i++)
    create_ships(1, array_ships)

  return array_ships;
}

function create_ships(count_ship, arr_ships)
{
  var rand_row = getRandomInt(max_row);
  var rand_col = getRandomInt(max_col);
  var rand_angle = getRandomInt(4);//0 - left, 1 - up, 2 - right, 3 - down

  var count_break = 0;
  //выбираем рандомные коордианты и направление для расположение корабля до тех пор,
  //пока не будет выбрано правильное место
  //при зацикливании возвращаемся назад и повторяем расстановку заново
  while(!check_around(rand_row, rand_col, rand_angle, count_ship, arr_ships))
  {
    rand_row = getRandomInt(max_row);
    rand_col = getRandomInt(max_col);
    rand_angle = getRandomInt(4);

    if(count_break > 500)
    {
      init_ships();
      break;
    }
    else
      count_break++;
  }

  //после нахождение координат и направления, расставляем корабли в массив arr_ships
  for(var i = 0; i < count_ship; i++)
  {
    if(i > 0)
    {
      switch (rand_angle)
      { //0 - left, 1 - up, 2 - right, 3 - down
        case 0:
          rand_col = rand_col - 1;
          break;
        case 1:
          rand_row = rand_row - 1;
          break;
        case 2:
          rand_col = rand_col + 1;
          break;
        case 3:
          rand_row = rand_row + 1;
          break;
      }
    }
    arr_ships[rand_row][rand_col] = 4;//white,ship place
  }
}

function check_place(row, col, angle, count_ship)//проверка на выход за поле
{
  switch(angle)
  { //0 - left, 1 - up, 2 - right, 3 - down
    case 0: {
      if(col - count_ship < 0) return false;
      else return true;
    }
    case 1: {
      if(row - count_ship < 0) return false;
      else return true;
    }
    case 2: {
      if(col + count_ship >= max_col - 1) return false;
      else return true;
    }
    case 3: {
      if(row + count_ship >= max_row - 1) return false;
      else return true;
    }
  }
}

function check_around(row, col, angle, count_ship, arr_ships)//главная ф-я проверки расстановки кораблей
{

  if(!check_place(row, col, angle, count_ship)) return false;//проверка на выход за поле
  switch(angle)//проверка на занятость места для корабля (если пересекается с другими, либо вплотную)
  { //0 - left, 1 - up, 2 - right, 3 - down
    case 0: {
      for(var i = 0; i < count_ship; i++)
      {
        if(!check_take_place(row, col, arr_ships)) return false;
        else
        {
          col = col - 1;
        }
      }
      return true;
    }
    case 1: {
      for(var i = 0; i < count_ship; i++)
      {
        if(!check_take_place(row, col, arr_ships)) return false;
        else
        {
          row = row - 1;
        }
      }
      return true;
    }
    case 2: {
      for(var i = 0; i < count_ship; i++)
      {
        if(!check_take_place(row, col, arr_ships)) return false;
        else
        {
          col = col + 1;
        }
      }
      return true;
    }
    case 3: {
      for(var i = 0; i < count_ship; i++)
      {
        if(!check_take_place(row, col, arr_ships)) return false;
        else
        {
          row = row + 1;
        }
      }
      return true;
    }
  }
}

function check_take_place(row, col, arr_ships)//проверка массива на местонахождения близжайших кораблей
{
  var r1, c1, r2, c2; //r1, c2 = min/r2, c2 = max
  r1 = row === 0? row : row - 1;
  c1 = col === 0? col : col - 1;
  r2 = row === max_row - 1? row : row + 1;
  c2 = col === max_col - 1? col : col + 1;

  if(arr_ships[row][col] === 4) return false;
  if(arr_ships[r1][col] === 4) return false;
  if(arr_ships[r1][c1] === 4) return false;
  if(arr_ships[r1][c2] === 4) return false;
  if(arr_ships[row][c1] === 4) return false;
  if(arr_ships[row][c2] === 4) return false;
  if(arr_ships[r2][col] === 4) return false;
  if(arr_ships[r2][c1] === 4 ) return false;
  if(arr_ships[r2][c2] === 4) return false;

  return true;
}

