console.log("App running!")

const generateHp = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const generateLog = (
  action,
  from,
  amount,
  target = undefined,
  type = undefined
) => {
  let message = ""
  switch (action) {
    case "attack":
      message = `${from} hits ${target} with a ${type} attack dealing ${amount} point${
        amount > 1 ? "s" : ""
      } of damage`
      break
    case "heal":
      message = `${from} heal ${
        from === "hero" ? "himself" : "itself"
      } with ${amount} health point${amount > 1 ? "s" : ""}`
      break
  }
  return { character: from, message }
}

new Vue({
  el: `#app`,
  data: {
    new_game: false,
    hero: { hp: 100 },
    monster: { hp: 100 },
    logs: []
  },
  computed: {
    heroLifeStatus: function() {
      return {
        backgroundColor: "#00a300",
        height: "inherit",
        width: this.hero.hp + "%"
      }
    },
    monsterLifeStatus: function() {
      return {
        backgroundColor: "#00a300",
        height: "inherit",
        width: this.monster.hp + "%"
      }
    }
  },
  methods: {
    setGame: function() {
      this.new_game = !this.new_game
      this.hero.hp = 100
      this.monster.hp = 100
      this.logs = []
    },
    round: function(action) {
      if (this.hero.hp > 0) {
        switch (action) {
          case "attack":
            this.attack("hero", "monster", "normal", 1, 10)
            break
          case "special_attack":
            this.attack("hero", "monster", "special", 10, 20)
            break
          case "heal":
            this.heal("hero")
        }
      } else {
        this.new_game = false
        alert("You Lost ...")
      }

      if (this.monster.hp > 0) {
        if (action === "special_attack")
          this.attack("monster", "hero", "normal", 1, 10)
        this.monster.hp < 30
          ? this.heal("monster")
          : this.attack("monster", "hero", "normal", 1, 10)
      } else {
        this.new_game = false
        alert("You Won!")
      }
    },
    attack: function(from, target, type, min_dam, max_dam) {
      const damage = generateHp(min_dam, max_dam)
      if (this[target].hp <= damage) {
        this[target].hp = 0
      } else {
        this[target].hp -= damage
      }
      this.logs.push(generateLog("attack", from, damage, target, type))
    },
    heal: function(from) {
      const healedHp = generateHp(5, 10)
      if (this[from].hp + healedHp <= 100) {
        this[from].hp += healedHp
      } else {
        this[from].hp = 100
      }
      this.logs.push(generateLog("heal", from, healedHp))
    }
  }
})
