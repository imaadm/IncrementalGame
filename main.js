var timer = 256
var tickRate = 16
var visualRate = 256
var resources = { "gold": 0, "sword": 0, "monster_health": 5, "level": 1, "hp": 100 }
var costs = {
	"sword": 10,
	"guard": 10,
	"heal": 5,
	"hp": 20,
	"damage": 1 //used to scale damage taken
}
var growthRate = {
	"sword": 1.5,
	"guard": 1.25,
	"heal": 1.5,
	"monster_health": 1.1,
	"gold": 1.5,
	"damage": 1.1,
	"hp": 1.5
}

var increments = [{
	"input": ["guard", "level", "hp"],
	"output": "gold"
}]

var unlocks = {
	"sword": { "gold": 10 },
	"guard": { "gold": 20 },
	"heal": { "gold": 5 },
	"hp": { "gold": 20 }
}



function attack(num) {
	var damage = 1 + (resources["sword"]);
	let monster_health_bar = document.getElementById("monster_health_bar")
	monster_health_bar.value -= damage
	if (monster_health_bar.value <= 0) {
		resources["gold"] += (num * resources["level"])
		resources["level"] += 1
		resources["monster_health"] += 1
		costs["damage"] *= growthRate["damage"]
		monster_health_bar.value = (resources["monster_health"])
		monster_health_bar.max = (resources["monster_health"])
	}
	updateText()
};



function heal(num) {
	if (resources["gold"] >= costs["heal"] * num) {
		resources["gold"] -= num * costs["heal"]

		let health_bar = document.getElementById("health_bar")
		health_bar.value = health_bar.max
		resources["hp"] = health_bar.max

		costs["heal"] *= growthRate["heal"]

		updateText()
	}
};

function upgradesword(num) {
	if (resources["gold"] >= costs["sword"] * num) {
		resources["sword"] += num
		resources["gold"] -= num * costs["sword"]

		costs["sword"] *= growthRate["sword"]

		updateText()
	}
};
function upgradehp(num) { 
	if (resources["gold"] >= costs["hp"] * num) {
		resources["gold"] -= num * costs["hp"]
		let health_bar = document.getElementById("health_bar")
		health_bar.max += 10
		resources["hp"] = health_bar.max
		health_bar.value = resources["hp"]
		costs["hp"] *= growthRate["hp"]

		updateText()
	}

};



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
	timer += tickRate


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

	if (timer > visualRate) {
		timer -= visualRate
		let health_bar = document.getElementById("health_bar")
		health_bar.value -= (costs["damage"])
		resources["hp"] -= (costs["damage"])
		updateText()
		if (health_bar.value <= 0) {
			alert("You lose!");
			location.reload();
		}

	}


}, tickRate);
