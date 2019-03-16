//This Script was Written by QRICH, Pieces of this code were originally created by SPADAR. 
//the Compound Script that is used with this script was created by SPADAR, please get it at his github.
// 


/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// LOADED CODE ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

load_code("GoldHour");
load_code("Compound");

//////////////////////////////// END LOADED CODE //////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// FUNCTIONS /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

function on_party_invite(name) {
    var player = get_player(name);
    if (player.owner == character.owner || isFriend(player.owner)) {
        game_log("Accepting party invite from " + player.name + "...");
        accept_party_invite(name);
    }
}

function on_cm(name, data) {
    function on_magiport() {
        game_log("Accepting magiport!");
        accept_magiport(name);
    }
    on_magiport("WolfQueen");
}

function handle_inventory() {
    for (let i = 0; i < character.items.length; i++) { // this loops all the items of your inventory.
        let c = character.items[i]; // i is the current item in the loop, i.e. the slot in your inventory.
        if (c) { // if there is an item, check if we should sell it.
            if (c && sell_whitelist.includes(c.name)) // if there is an item and the name matches the whitelist,
                sell(i); // sell the item.
        }
    } // ends the loop through the inventory.
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

//Finds items in inventory

function find_item(filter) {
    for (let i = 0; i < character.items.length; i++) {
        let item = character.items[i];
        if (item && filter(item))
            return [i, character.items[i]];
    }
    return [-1, null];
}
////////////////////////////////// END FUNCTIONS /////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// VARIABLES //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

var p = 0;
var j = 0;
var sell_whitelist = ['hpbelt', 'hpamulet', 'stramulet', 'firestaff',
				      'ringsj', 'strearring', 'vitearring', 'fireblade'];
// names of items you want to sell.
var currentIndex = 0;
//////////////////////////////// END VARIABLES //////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// NEW INTERVAL /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

setInterval(function () {

    //START SWITCH CASE	P
    switch (p) {

        case 0:
            handle_inventory();
            p++;
            //               game_log("P = 0");
            loot();
            break;

        case 2:
            handle_inventory();
            p++;
            //               game_log("P = 1");
            loot();
            break;

        case 4:
            handle_inventory();
            p++;
            //               game_log("P = 2");
            loot();
            break;

        case 6:
            compound_items();
            p = 0;
            j++;
            //                game_log("New Loop P");
            loot();
            break;

        default:
            p++;
            break;
    }

    //END SWITCH CASE P

    //START SWITCH CASE	J
    switch (j) {

        case 20:
            j++;
            game_log("Accepting Party Invite");
            break;

        case 21:
            j = 0;
            game_log("Restarting J Loop");
            break;

        default:
            j = 0;

            break;
    }
    //END SWITCH CASE J

    // START LUCK BUFF 	
    var entities = [];

    for (id in parent.entities) {
        var entity = parent.entities[id];
        if (distance(character.real_x, character.real_y, entity.real_x, entity.real_y) < (character.range + 1000)) {
            if (entity.type == "character" && !entity.npc) {
                entities.push(entity);
            }
        }
    }
    if (currentIndex > entities.length - 1) {
        currentIndex = 0;
    }
    var entity = entities[currentIndex];
    if (entity && (!entity.s.mluck || entity.s.mluck.ms <= /*3599000*/ 3590000 || entity.s.mluck.f != "MerkChant" && entity.name != "CeeNote")) {
        if (entity && distance(character.real_x, character.real_y, entity.real_x, entity.real_y) < (character.range + 80)) {
            if (can_use('mluck')) {
                use_skill("mluck", entity);
            }
        }
    }

    currentIndex++;
    //END LUCK BUFF FUNCTION

    //START HP AND MP MANAGEMENT
    if (character.max_hp - character.hp > 300) {

        heal(parent.character);
    }
    if (character.max_hp - character.hp > 300 ||

        character.max_mp - character.mp > 300) {

        use_hp_or_mp();

    }
    //END HP AND MP MANAGEMENT

}, 1000);
//////////////////////////////// END INTERVAL //////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// NEW INTERVAL /////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

setInterval(function () {
    if (!character.party) {
        accept_party_invite("Wired");
    }

}, 20000);
//////////////////////////////// END INTERVAL //////////////////////////////////////////
