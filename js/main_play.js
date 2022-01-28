var game_over_flag = false;
var round_for_player = true;

function play_game(e)//распредление очередей между игроком и pc
{
  if(game_ready && !game_over_flag)
  {
    if(e === null && !round_for_player)//очередь компьютера
    {
      e = pc_intel_process(arr_ships_player);
      shooting_ships(block_play[0], e, arr_ships_player);
    }
    else if(round_for_player)//очередь игрока
    {
      shooting_ships(block_play[1], e, arr_ships_pc);
    }


    //проверка на конец игры
    if(check_over(arr_ships_player) || check_over(arr_ships_pc))
    {
      game_over_flag = true;
      if(round_for_player)
        alert("Конец игры. Вы победили");
      else
        alert("Конец игры. Вы проиграли");
    }
  }
}

//0 free_place
//1 miss_place
//2 hit_place
//3 destroy_place
//4 ship_place
function shooting_ships(block_play, e, arr)//проверка каждого выстрела
{
  var coordination = e.getAttribute('coordination');
  var row = coordination.split(',')[0];
  var col = coordination.split(',')[1];

  var message = document.getElementsByClassName('block_messages')[0];//сообщения о попадании и промахе
  message.style.display = 'block';

  if(arr[row][col] === 4)//попадние по цели
  {
    arr[row][col] = 2;
    message.children[0].textContent = "Попадание";
    show_ships(block_play, arr);

    if(!round_for_player)//если компьютер попал, то ход продолжается
      setTimeout(()=>{play_game(null);}, 1500);
  }
  else
  {
    if(arr[row][col] !== 2 && arr[row][col] !== 1)//промах
    {
      arr[row][col] = 1;
      message.children[0].textContent = "Промах";
      show_ships(block_play, arr);

      if(round_for_player)//переход хода компьютеру
      {
        document.getElementsByClassName("block_name_game")[0].children[0].textContent = "Ход противника";
        round_for_player = false;
        setTimeout(()=>{play_game(null);}, 1500);
      }
      else//переход хода игроку
      {
        document.getElementsByClassName("block_name_game")[0].children[0].textContent = "Ваш ход";
        round_for_player = true;
      }
    }
  }
}

function check_over(array)//проверка на конец игры
{
  for(var i = 0; i < max_row; i++)
  {
    for(var j = 0; j < max_col; j++)
    {
      if(array[i][j] === 4)
      {
        game_over_flag = false;
        return false;
      }
    }
  }
  return true;
}

function pc_intel_process(array)//выбор клетки со стороны компьютера
{
  var rand_row, rand_col;
  do
  {
    rand_row = getRandomInt(15);
    rand_col = getRandomInt(20);

  }while(array[rand_row][rand_col] === 1 || array[rand_row][rand_col] === 2)


  return rows[rand_row].getElementsByClassName('cell')[rand_col];
}



