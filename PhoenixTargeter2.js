//ALL CREDIT TO SPADAR FOR THIS, IVE ONLY MODIFIED THE ORIGINAL VERSION
// https://github.com/Spadar/AdventureLand  

var targeter = new Targeter(

  { crab:14,armadillo:13,minimush:12,frog:11,croc:10,snowman:9,mvampire:6,goldenbat:5, jr:3,greenjr:2,phoenix:1},

  ["Foaly", "UnDeadifier", "Magiest"], // whitelist

   ["Cannabis","Rabbit"], // blacklist

  {UseGreyList: true, RequireLOS: false, DebugPVP: false, TagTargets: true}

);






setInterval(function(){

	var targets = targeter.GetPriorityTarget(1);

  clear_drawings();

  

	if(targets)	{
		

		for(var id in targets){

			var target = targets[id];
			change_target(target);
			draw_circle(target.real_x, target.real_y, 20);
            draw_circle(target.real_x, target.real_y, 180, 5 , color=0x00A33E0);
		
		}
		if(can_use("3shot")){
			   use_skill("3shot",target);
		
	}
	if(can_use("scare",target)){
	//	use_skill("scare",target);
	}	
  }
  if(target && in_attack_range(target)){
    if(character.ctype === "ranger"){
      if(can_use("supershot") && can_attack(target) && character.mp > 400){
        use_skill("supershot", target);
      }

      var mobsTargetingParty = Object.values(parent.entities).filter(

        shoot => shoot.type == "monster" && (

          shoot.target === "Sinstrite" || shoot.target === "Curse" || shoot.target === "Shield"

        )
      );
      var arrayMTP = [];
      for(var i = 0; i < mobsTargetingParty.length; i++){
      var m_t_p = mobsTargetingParty[i].id;
      arrayMTP.push(m_t_p);

      }



      if(can_use("3shot") && arrayMTP.length >= 2){

        parent.socket.emit("skill", { name: "3shot", ids: arrayMTP });

      }

      if(can_use("5shot") && arrayMTP.length >= 4){

        parent.socket.emit("skill", { name: "5shot", ids: arrayMTP });

      }

      

    }



    if(character.ctype === "priest"){



      if(can_use("curse")){

 //       use_skill("curse", target);

      }



      if(can_use("darkblessing")){

        if(character.level >= 70){

          use_skill("darkblessing");

        }

      }



    }



    if(character.ctype === "warrior"){



      if(can_use("warcry")){

        if(character.level >= 70){

          use_skill("warcry");

        }

      }



      // if(can_use("charge")){

      //   use_skill("charge", target);

      // }



      // if(can_use("agitate")){

      //   use_skill("agitate", target);

      // }



      // if(can_use("taunt")){

      //   use_skill("taunt", target);

      // }



      if(character.hp <= character.max_hp * 0.5){

        if(can_use('hardshell')){

          use_skill('hardshell');

        }

      }

      

    }



  }


  if(target && can_attack(target) && !smart.moving) {

    set_message("Attacking");

		attack(target);

		return;

  } else if(target && !in_attack_range(target) && !smart.moving){

    if (can_move_to(target.real_x, target.real_y)){

      if(!is_moving(character)){

          var tr_x = target.real_x;

          var tr_y = target.real_y;

          var cr = character.range - 10;

          var cx = character.real_x;

          var cy = character.real_y;

          var dt = Math.round(distanceToPoint(cx, cy, tr_x, tr_y)); // distance to target

          var ar = Math.atan2(cy - tr_y, cx - tr_x); // angle to target in radians

          var rd = dt - cr; // distance from attack range to target

          var dx = cx - (rd * Math.cos(ar));

          var dy = cy - (rd * Math.sin(ar));

     //     move( dx, dy );

      }

    } else if(!smart.moving && !is_moving(character)){

 //     smart_move(farm_spot);

    }

  } else if(!target){

var farm_spot = "cave";
    if(target){

      change_target(target);

      return;
	}
     else if(!smart.moving && !is_moving(character)){

//		  smart_move(farm_spot);

      }

    }

 



}, 250);




function Targeter(priorityArgs, whitelist, blacklist, args)

{

	//Set up configuration

	this.TargetingPriority = priorityArgs;

	this.WhiteList = whitelist;

	this.BlackList = blacklist;

	this.GreyList = {};

	

	if(args.UseGreyList === undefined){

		args.UseGreyList = true;

	}

	this.UseGreyList = args.UseGreyList;

	

	if(args.RequireLOS === undefined){

		args.RequireLOS = true;

	}

	this.RequireLOS = args.RequireLOS;

	

	if(args.DebugPVP === undefined){

		args.DebugPVP = false;

	}

	this.DebugPVP = args.DebugPVP;

	

	if(args.TagTargets === undefined){

		args.TagTargets = true;

	}

	this.TagTargets = args.TagTargets;



	this.GetPriorityTarget = function(count){

		let potentialTargets = [];

		

		for(let id in parent.entities)

		{

			let entity = parent.entities[id];

			

			if(this.IsPVP() && entity.type == "character" && !entity.npc && !entity.rip)

			{

				if(this.GreyList[entity.id] === undefined)

				{

					this.GreyListPlayer(entity);

				}

				

				if(!this.IsPlayerSafe(entity))

				{

					let targetArgs = {};

					targetArgs.priority = 0;

					targetArgs.distance = parent.distance(character, entity);

					targetArgs.entity = entity;

					potentialTargets.push(targetArgs);

				}

			}

			else

			{

				if(entity.type == "monster")

				{

					if(this.TagTargets || parent.party_list.includes(entity.target) || this.IsTargetingParty(entity))

					{

						if(this.TargetingPriority[entity.mtype] != null)

						{

							if(!this.RequireLOS || can_move_to(entity.real_x, entity.real_y))

							{

								let targetArgs = {};

								targetArgs.priority = this.TargetingPriority[entity.mtype];

								targetArgs.distance = parent.distance(character, entity);

								targetArgs.entity = entity;

								potentialTargets.push(targetArgs);

							}

						}

					}

				}

			}

		}

		

		potentialTargets.sort(function(a, b) {

			if(a.priority > b.priority)

			{

				return 1;

			}

			else if(a.priority < b.priority)

			{

				return -1;

			}

			else if(a.distance > b.distance)

			{

				return 1;

			}

			else

			{

				return -1;

			}

		});

		

		if(potentialTargets.length > 0)

		{

			if(!count)

			{

				return potentialTargets[0].entity;

			}

			else

			{

				return potentialTargets.slice(0, count).map(a => a.entity);

			}

		}

		

		return null;

	};

	

	/*

		Returns if the player is currently in a PvP environment.

	*/

	this.IsPVP = function(){

		if(this.DebugPVP || parent.is_pvp || get_map().pvp)

		{

			return true;

		}

		else

		{

			return false;

		}

	}

	

	/*

		Returns if the provided entity is targeting either the player or the player's party.

	*/

	this.IsTargetingParty = function(entity){

		if(entity.target == character.id)

		{

			return true;

		}

		

		if(parent.party_list.indexOf(entity.id) > -1)

		{

			return true;

		}

		

		return false;

	}

	

	/*

		Returns if, according to our configuration, a player should be attacked or not.

	*/

	this.IsPlayerSafe = function(entity){

		

		if(parent.party_list.indexOf(entity.id) > -1)

		{

			return true;

		}

		

		if(this.BlackList.indexOf(entity.id) > -1)

		{

			return false;

		}

		

		if(this.WhiteList.indexOf(entity.id) > -1)

		{

			return true;

		}

		

		let greyListEntry = this.GreyList[entity.id];

		

		

		if(this.UseGreyList && (greyListEntry === undefined || greyListEntry === true))

		{

			return true;

		}

		

		return false;

	};

	

	/*

		Adds a player to the GreyList, which is used to allow players to not be attacked unless instigated.

	*/

	this.GreyListPlayer = function(entity){

		if(entity.type == "character")

		{

			game_log("Adding " + entity.id + " to GreyList.");

			this.GreyList[entity.id] = true;

		}

	};

	

	/*

		Marks a player on the GreyList to be no longer considered safe. This means that they will be attacked in PvP environments.

	*/

	this.RemoveFromGreyList = function(name){

		this.GreyList[name] = false;

	};

	

	/*

		Returns whether or not we want to consider hostile action against this player a reason to engage the aggressor in PvP.

	*/

	this.IsPlayerFriendly = function(name){

		if(character.id == name)

		{

			return true;

		}

		

		if(parent.party_list.indexOf(name) > -1)

		{

			return true;

		}

		

		return false;

	}

	

	//Set up hit event handling to react when attacked

	

	//Clean out an pre-existing listeners

	if (parent.prev_handlerstargeting) {

		for (let [event, handler] of parent.prev_handlerstargeting) {

		  parent.socket.removeListener(event, handler);

		}

	}



	parent.prev_handlerstargeting = [];



	//handler pattern shamelessly stolen from JourneyOver

	function register_targetinghandler(event, handler) 

	{

		parent.prev_handlerstargeting.push([event, handler]);

		parent.socket.on(event, handler);

	};

	

	let targeter = this;

	this.hitHandler = function(event){

		console.log(event);

		if(parent != null)

		{

			

			var attacker = event.hid;

			var attacked = event.id;



			var attackedEntity = parent.entities[attacked];



			if(attacked == character.name)

			{

				attackedEntity = character;

			}



			if(attackedEntity != null && event.heal == null)

			{

				if(attackedEntity.type == "character" && targeter.IsPlayerFriendly(attacked))

				{

					

					targeter.RemoveFromGreyList(attacker);

					game_log("Removing " + attacker + " from greylist for attacking " + attacked);

				}

			}

		}

	}



	register_targetinghandler("hit", this.hitHandler);

}
