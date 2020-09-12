var timer = 256
var tickRate = 16
var visualRate = 256
var resources = { "gold": 0, "xp": 0, "sword": 1, "monster_health": 5, "stage": 1, "hp": 100, "goldrate": 1, "mana": 1, "lifesteal": 0 }
var costs = {
	"sword": 12.50, //attack upgrade
	"heal": 10, //potion
	"hp": 10, //maxhp upgrade
	"damage": 1, //used to scale damage taken
	"armor": 400, //armor cost from town
	"fireball": 50, //fireball cost
	"lifesteal": 450 //lifesteal enchant
}
var growthRate = {
	"sword": 1.65,
	"heal": 1.070,
	"hp": 1.50,
	"monster_health": 1.10,
	"gold": 1.25,
	"damage": 1.09075
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
	var strength = (resources["sword"]); //damage that each attack does

	let monster_health_bar = document.getElementById("monster_health_bar")
	monster_health_bar.value -= strength
	resources["monster_health"] -= strength //updates monster health bar
	if (monster_health_bar.value <= 0) {
		resources["xp"] += (resources["stage"]) //xp gain that scales w/ each stage
		resources["gold"] += (resources["stage"] * growthRate["gold"]) //gold gain that scales w/ each stage

		if (resources["lifesteal"] == 1) {
			lifesteal();
		}
		costs["damage"] *= growthRate["damage"] //increases damage that next monster does
		costs["heal"] *= growthRate["heal"] //increasing heal cost
		resources["stage"] += 1

		if (resources["stage"] == 50) {
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
			growthRate["damage"] -= .025
			let health_bar = document.getElementById("health_bar")
			health_bar.value = health_bar.max
			resources["hp"] = health_bar.max //restoring health
		}
		updateText()

	} // updates to variables after monster is slain

};

function bossAttack() {
	var strength = 1 + (resources["sword"]); //damage that each attack does

	let monster_health_bar = document.getElementById("monster_health_bar")
	monster_health_bar.value -= strength
	resources["monster_health"] -= strength //updates monster health bar
	if (monster_health_bar.value <= 0) {
		resources["xp"] += (resources["stage"]) //xp gain that scales w/ each stage
		resources["gold"] += (resources["stage"] * growthRate["gold"]) //gold gain that scales w/ each stage
		//	costs["damage"] *= growthRate["damage"] //increases damage that next monster does
		costs["heal"] *= growthRate["heal"] //increasing heal cost

		resources["monster_health"] = resources["stage"] + 5
		monster_health_bar.value = resources["monster_health"]
		monster_health_bar.max = resources["monster_health"]

		hideBoss()
		document.getElementById("attack").onclick = function () { attack() }
		alert("The dragon's death infuses you with its power, increasing health and granting magical powers. It also drops a gold charm!");
		document.getElementById("luckCharm").style="inline"
		showMana()
		growthRate["damage"] -= .03
		growthRate["heal"] -= .04
		growthRate["gold"] = 1.50
		resources["stage"] += 1
		resources["gold"] += 250
		let health_bar = document.getElementById("health_bar")
		health_bar.max += 200
		resources["hp"] = health_bar.max
		health_bar.value = resources["hp"]

		document.getElementById("fireball").style = "inline"
		updateText();
	}
}

function lifesteal() {
	let health_bar = document.getElementById("health_bar")
	if ((resources["hp"] += (health_bar.max * 0.050)) <= health_bar.max) { //heal on monster death
		resources["hp"] += (health_bar.max * 0.050)
		health_bar.value = resources["hp"]
	}
	if ((resources["hp"] += (health_bar.max * 0.050)) > health_bar.max) {
		resources["hp"] = health_bar.max
		health_bar.value = resources["hp"]
	}
}

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

function fireball() {
	if (resources["mana"] >= costs["fireball"]) {
		let mana_bar = document.getElementById("mana_bar")
		resources["mana"] -= costs["fireball"]
		mana_bar.value -= costs["fireball"]

		let monster_health_bar = document.getElementById("monster_health_bar")
		var strength = monster_health_bar.max
		monster_health_bar.value -= strength
		if (monster_health_bar.value <= 0) {
			if (resources["lifesteal"] == 1) {
				lifesteal();
			}
			resources["xp"] += (resources["stage"]) //xp gain that scales w/ each stage
			resources["gold"] += (resources["stage"] * growthRate["gold"]) //gold gain that scales w/ each stage
			costs["damage"] *= growthRate["damage"] //increases damage that next monster does
			costs["heal"] *= growthRate["heal"] //increasing heal cost
			resources["stage"] += 1

			resources["monster_health"] = (monster_health_bar.max + 1)
			monster_health_bar.value = (resources["monster_health"])
			monster_health_bar.max = (resources["monster_health"]) //resets monster healthbar with new max
			updateText()

		} // updates to variables after monster is slain
	}

}

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
		if (resources["stage"] < 25)
			health_bar.max += 25
		if (resources["stage"] >= 25 && resources["stage"] <= 50)
			health_bar.max += 50
	
		resources["hp"] += (health_bar.max * 0.5)
		if (resources["hp"] > health_bar.max)
			resources["hp"] = health_bar.max
		health_bar.value = resources["hp"]
		//sets new maximum and updates health bar

		costs["hp"] *= growthRate["hp"]

		updateText()
	}

};


function townSword() //sword damage upgrade
{
	resources["sword"] += 4
	document.getElementById("diamondSword").style.display = "inline"
		updateText()
	leaveTown();

}

function townLife() //max hp upgrade 
{
	let health_bar = document.getElementById("health_bar")
	health_bar.max += 200
	resources["hp"] = health_bar.max
	health_bar.value = resources["hp"]
	updateText()
	leaveTown();

}

function townXP() //xp bonus
{
	resources["xp"] += 250
	leaveTown();
}

function townLifesteal() //damage reduction purchase
{
	if (resources["gold"] >= costs["lifesteal"]) {
		resources["gold"] -= costs["lifesteal"]
		resources["lifesteal"] = 1
		growthRate["damage"] -= .010
		updateText()
	}
}

function townArmor() //damage reduction purchase
{
	if (resources["gold"] >= costs["armor"]) {
		resources["gold"] -= costs["armor"]
		growthRate["damage"] -= .020
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
	growthRate["heal"] = 1.070
	document.getElementById("town").style.display = "inline"
	document.getElementById("monster_health").style.display = "none"
	document.getElementById("monster_health_bar").style.display = "none"
	document.getElementById("attack").style.display = "none"
}

function hideTown() {
	document.getElementById("town").style.display = "none"
	document.getElementById("monster_health").style.display = "inline"
	document.getElementById("monster_health_bar").style.display = "inline"
	document.getElementById("attack").style.display = "inline"
}


function showBoss() {
	document.getElementById("boss").style.display = "inline"
	document.getElementById("attack").onclick = function () { bossAttack() }
	let health_bar = document.getElementById("health_bar")

	let monster_health_bar = document.getElementById("monster_health_bar")
	monster_health_bar.value = monster_health_bar.max
	resources["monster_health"] = monster_health_bar.value

	var timeLeft = 30

	var bossTimer = setInterval(function () {
		timeLeft--
		document.getElementById("timer").innerHTML = timeLeft
		if (resources["stage"] == 50) {
			if (timeLeft % 6 == 0) {
				resources["hp"] -= 75
				health_bar.value = resources["hp"]
			}

			if (timeLeft == 0) {
				resources["hp"] = 0
				health_bar.value = resources["hp"]
			}
		}
	}, 1000)
	if (resources["stage"] != 50) {
		clearInterval(bossTimer)
	}

}

function hideBoss() {
	document.getElementById("boss").style.display = "none"

}

function showMana() {
	resources["mana"] = 100
	document.getElementById("mana_bar").style.display = "inline"
	document.getElementById("fireball").style.display = "inline"

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
	if (timer > visualRate && (resources["stage"] != 25)) {
		timer -= visualRate

		let mana_bar = document.getElementById("mana_bar")

				if (resources["mana"] < 100) {
					resources["mana"] += 2
					mana_bar.value += 2
				}
				if (resources["mana"] > 100) {
					resources["mana"] = 100
					mana_bar.value = resources["mana"]
				}

		if (resources["stage"] != 50) {
			let health_bar = document.getElementById("health_bar")
			health_bar.value -= (costs["damage"])
			resources["hp"] -= (costs["damage"])
			//constant damage taken from monster
		}
		updateText()
		if (health_bar.value <= 0 && resources["stage"] <= 50) {
			alert("You lose! High score: Stage " + resources["stage"]);
			location.reload();
		}
		if (health_bar.value <= 0 && resources["stage"] > 50) {
			alert("You've defeated the threat of the dragon, but the monsters never relent. High score: Stage " + resources["stage"]);
			location.reload();
		}

	}


}, tickRate);
