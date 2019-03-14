///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////LOAD CODES////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

load_code("PhoenixTargeter")

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////GlobalVariables////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

var p = 0; // switch case number for travel
var leader = get_player(character.party); // leader 
var autoTime = new Date(); // time since last group teleport
var till_level = 0; //Kills till level = 0, XP till level = 1
var lastburst; // time since last energize
var player1 = "Wired"; // Party Leader
var player2 = "BuffNStuff"; // Party Member 2
var player3 = "MerkChant"; // Party Member 3
var ranger = "Wired"; // Your Ranger
var priest = "BuffNStuff"; // Your Priest
var mage = "WolfQueen"; // Your Mage
var merchant = "MerkChant"; // Your Merchant

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////FUNCTIONS//////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//START AUTOBOTS FUNCTION
function autoBOTS() {
    use_skill("magiport", player2); // magiport player 2
    send_cm(player2, {
        data: on_cm(player2) // cm mage to accept teleport
    });
    use_skill("magiport", player1); // magiport player 1
    send_cm(player1, {
        data: on_cm(player1) // cm mage to accept teleport
    });
}
//END FUNCTION

//START PARTY ACCEPT FUNCTION

function on_party_invite(name) {
    var player = get_player(name);
    if (player.owner == character.owner || isFriend(player.owner)) {
        game_log("Accepting party invite from " + player.name + "...");
        accept_party_invite(name);
    }
}
//END FUNCTION

//START  ENERGIZE RANGER FUNCTION
function energyRanger() {

    // energize 
    var leader = player1
    if (leader.mp) {
        var leader = get_player(character.party);
        if (leader.mp < leader.max_mp && can_use("energize")) {

            use_skill("energize", ranger);
        }
    }

}
//END FUNCTION

//START MOVE ON COMBINED DAMAGE FUNCTION
function on_combined_damage() // When multiple characters stay in the same spot, they receive combined damage, this function gets called whenever a monster deals combined damage
{
    move(character.real_x - 45, character.real_y + 45);
}
//END FUNCTION

//START HANDLE DEATH FUNCTION
function handle_death() {

    if (character.rip) // if you are dead,
        parent.socket.emit('respawn'); // try to respawn,
    return; // then return because running anymore code is pointless.
}
//END FUNCTION

setInterval(function () {
    var target = get_targeted_monster();
    if (target && can_attack(target) && character.mp > 3500) {
        // Current target isn't empty and attackable.
        attack(target);

    }

    if (target && !in_attack_range(target) && !smart.moving) {
        move(
            character.x + (target.x - character.x) / 2,
            character.y + (target.y - character.y) / 2
        );
        // Walk half the distance
    }
    //SKILLS

    energyRanger();

    //END SKILLS    

    //START PARTY TRANSPORTATION    

    if ((in_attack_range(target)) && (character.mp > 3000 && target.max_hp > 20000) && (target.hp > 10000)) {
        game_log(new Date() - autoTime)
        if (new Date() - autoTime > 18000) {
            autoTime = new Date();
            autoBOTS();
            game_log("AutoBOT");
            stop();
        }
    }
    //END TRANSPORTATION

    //START MANA AND POTION MANAGEMENT
    if (character.max_hp - character.hp > 600 && can_use("use_hp")) {
        use_skill("use_hp");
    }

    if (character.max_mp - character.mp > 400 && can_use("use_mp")) {

        use_skill("use_mp");
    }
    //END MANAGMENT

    if (can_use("scare", target)) {
        use_skill("scare");
    }
    loot();
}, 150)
//START INVERVAL FUNCTION
setInterval(function () {
    var target = get_targeted_monster();
    if (!smart.moving && !target || target && target.max_hp < 10000) {

        switch (p) {
            case 0:
                // code block

                use_skill("blink", [1210, -355]);
                p = p + 1;
                game_log("P = 0");

                break;
            case 1:
                // code block
                use_skill("blink", [675, 1745]);
                p++;
                //	j++;
                game_log("P = 1");
                autoBots();
                break;
            case 2:
                // code block
                use_skill("blink", [-1155, 861]);
                p++;
                //	j++
                game_log("P = 2");
                break;
            case 3:
                // code block
                use_skill('blink', [155, 1410])
                smart_move("cave")
                p++;
                game_log("P = 3");
                break;
            case 4:
                // code block
                use_skill("blink", [1125, 10]);
                p++;
                game_log("P = 4");
                break;
            case 5:
                // code block
                use_skill("blink", [-205, -1170]);
                //	j++;
                p++;
                game_log("P = 5");
                break;
            case 6:
                // code block
                smart_move("croc");
                use_skill("use_town")
                p++;
                game_log("P = 6");
                break;
            case 7:
                // code block
                smart_move("minimush")
                use_skill("blink", [-50, -450]);

                p++;
                game_log("P = 7");
                break;
            case 8:
                // code block
                use_skill("blink", [0, 445]);
                p++;
                game_log("P = 8");
                break;
            case 9:
                // code block
                use_skill("blink", [-50, -280])
                smart_move("crab");
                p = 0;
                game_log("P = 9");
                break;
            default:
                break;
                // code block
        }
    }
}, 8000)
//END INTERVAL FUNCTION

// START FUNCTION INTERVAL
setInterval(function () {

    handle_death()

    var give_merchant = true;

    function give_goods() {
        var receiver = "MerkChant";
        var gold = "100000";
        for (var i = 5; i < (43 - character.esize); i++) {
            send_item(receiver, i, 10000);
        }
        send_gold(receiver, gold);
    }

    if (give_merchant && get_player("MerkChant")) {
        give_goods();
    }

    if (character.party != "Wired") {
        game_log(character.party);
        leave_party();
    }

}, 10000);
// END FUNCTION INERVAL
