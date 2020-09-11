var timer = 256
var tickRate = 16
var visualRate = 256
var resources = { "gold": 0, "xp": 0, "sword": 0, "monster_health": 5, "stage": 49, "hp": 100, "goldrate": 1 }
var costs = {
	"sword": 10, //attack upgrade
	"heal": 10, //potion
	"hp": 10, //maxhp upgrade
	"damage": 1, //used to scale damage taken
	"armor": 500 //armor cost from town
}
var growthRate = {
	"sword": 1.50,
	"heal": 1.075,
	"hp": 1.50,
	"monster_health": 1.10,
	"gold": 1.25,
	"damage": 1.08
}
// this is used to automate gold income.
var increments = [{
	"input": ["goldrate"],
	"output": "gold"
}]

var unlocks = {
	"town": { "stage": 25 },
	"boss": { "stage": 50 }
}



function attack() {
	var strength = 1 + (resources["sword"]); //damage that each attack does

	let monster_health_bar = document.getElementById("monster_health_bar")
	monster_health_bar.value -= strength
	resources["monster_health"] -= strength //updates monster health bar
	if (monster_health_bar.value <= 0) {
		resources["xp"] += (resources["stage"]) //xp gain that scales w/ each stage
		resources["gold"] += (resources["stage"] * growthRate["gold"]) //gold gain that scales w/ each stage
		costs["damage"] *= growthRate["damage"] //increases damage that next monster does
		costs["heal"] *= growthRate["heal"] //increasing heal cost
		resources["stage"] += 1
		
		if (resources["stage"] == 50)
		{
			resources["monster_health"] = 999
			monster_health_bar.value = (resources["monster_health"])
			monster_health_bar.max = (resources["monster_health"]) //resets monster healthbar with new max
			alert("Boss battle! Defeat the dragon before he burns you down!");
			showBoss();
		}
		resources["monster_health"] = (monster_health_bar.max + 1)
	
		monster_health_bar.value = (resources["monster_health"])
		monster_health_bar.max = (resources["monster_health"]) //resets monster healthbar with new max
		if (resources["stage"] == 25) { //town phase
			alert("You've arrived at a town!");
			showTown();
			let health_bar = document.getElementById("health_bar")
			health_bar.value = health_bar.max
			resources["hp"] = health_bar.max //restoring health
		}
		updateText()

	} // updates to variables after monster is slain

};



function heal() {
	if (resources["gold"] >= costs["heal"]) {
		resources["gold"] -= costs["heal"]

		let health_bar = document.getElementById("health_bar")
		health_bar.value = health_bar.max
		resources["hp"] = health_bar.max
		//resets health to max


		updateText()
	}
};

function upgradesword() {
	if (resources["xp"] >= costs["sword"]) {
		resources["sword"] += 1
		resources["xp"] -= costs["sword"]

		costs["sword"] *= growthRate["sword"]

		updateText()
	}
};
function upgradehp() {
	if (resources["xp"] >= costs["hp"]) {
		resources["xp"] -= costs["hp"]

		let health_bar = document.getElementById("health_bar")
		health_bar.max += 25
		resources["hp"] = health_bar.max
		health_bar.value = resources["hp"]
		//sets new maximum and updates health bar

		costs["hp"] *= growthRate["hp"]

		updateText()
	}

};


function townSword() //sword damage upgrade
{
	resources["sword"] += 10
	leaveTown();

}

function townLife() //max hp upgrade 
{
	let health_bar = document.getElementById("health_bar")
	health_bar.max += 100
	resources["hp"] = health_bar.max
	health_bar.value = resources["hp"]
	updateText()
	leaveTown();

}

function townXP() //xp bonus
{
	resources["xp"] += 200
	leaveTown();
}

function townArmor() //damage reduction purchase
{
	if (resources["gold"] >= costs["armor"]) {
		resources["gold"] -= costs["armor"]
		growthRate["damage"] = 1.07
		document.getElementById("armor").style.display = "inline"
		updateText()
	}
}



function leaveTown() {
	hideTown();
	alert("You leave town and go back to slaying monsters.")
	resources["stage"] += 1

}


function showTown() {
	document.getElementById("town").style.display = "inline"
	document.getElementById("monster_health").style.display = "none"
	document.getElementById("monster_health_bar").style.display = "none"
	document.getElementById("attack_button").style.display = "none"
}

function hideTown() {
	document.getElementById("town").style.display = "none"
	document.getElementById("monster_health").style.display = "inline"
	document.getElementById("monster_health_bar").style.display = "inline"
	document.getElementById("attack_button").style.display = "inline"
}

function showBoss() {
	document.getElementById("boss").style.display = "inline"

	let health_bar = document.getElementById("health_bar")
		
	document.getElementById("boss").style.display= "inline"
	var timeLeft = 60

	var bossTimer = setInterval(function() {
		timeLeft--
		document.getElementById("timer").innerHTML = timeLeft

		if (timeLeft % 10 == 0)
		{
			resources["hp"] -= 50
			health_bar.value = resources["hp"]
		}

		if (timeLeft == 0)
		{
			resources["hp"] = 0
			health_bar.value = resources["hp"]
		}
		
	}, 1000)

}


function updateText() {
	for (var key in unlocks) {
		var unlocked = true
		for (var criterion in unlocks[key]) {
			unlocked = unlocked && resources[criterion] >= unlocks[key][criterion]
		}
		if (unlocked) {
			for (var element of document.getElementsByClassName("show_" + key)) {
				element.style.display = "block"
			}
		}
	}

	for (var key in resources) {
		for (var element of document.getElementsByClassName(key)) {
			element.innerHTML = resources[key].toFixed(2)
		}
	}
	for (var key in costs) {
		for (var element of document.getElementsByClassName(key + "_cost")) {
			element.innerHTML = costs[key].toFixed(2)
		}
	}
};

window.setInterval(function () {


	if (resources["stage"] != 25) {

		timer += tickRate
		
		// this block is used for calculating passive gold
		for (var increment of increments) {
			total = 1
			for (var input of increment["input"]) {
				total *= resources[input]

			}
			if (total) {
				console.log(total)
				resources[increment["output"]] += total / tickRate
			}
		}
		
	}
	if (timer > visualRate && (resources["stage"] != 25 )) {
		timer -= visualRate

		if (resources["stage"] != 50)
		{
		let health_bar = document.getElementById("health_bar")
		health_bar.value -= (costs["damage"])
		resources["hp"] -= (costs["damage"])
		//constant damage taken from monster
		}
		updateText()
		if (health_bar.value <= 0) {
			alert("You lose! High score: Stage " + resources["stage"]);
			location.reload();
		}

	}


}, tickRate);
