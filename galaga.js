const scoreEl = document.querySelector("#scoreEl")
const canvas = document.querySelector("canvas")
ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


var enemy = new Image();

var playerLaser = new Image();

var width = canvas.width;
var height = canvas.height;
var shipWidth = this.width;
var shipHeight = this.height;
var shipx = (canvas.width - shipWidth) / 2;
var shipy = canvas.height - shipHeight - 20;
let rightPressed = false;
let leftPressed = false;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const enemyRowCount = 3;
const enemyColumnCount = 19;
const enemyPadding = 40;
const enemyOffsetTop = 30;
const enemyOffsetLeft = 50;
const enemys = [];
var enemyWidth = enemy.naturalWidth / 2.5;
var enemyHeight = enemy.naturalHeight / 2.5;

class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0
        this.opacity = 1


        var ship = new Image();
        ship.src = "galaga/SpaceInvader/PNG/playerShip2_blue.png"
        ship.onload = () => {
            const scale = 0.5
            this.image = ship
            this.width = 100 * scale
            this.height = 100 * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity
        ctx.translate(player.position.x + player.width / 2, player.position.y + player.height / 2);
        ctx.rotate(this.rotation)

        ctx.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2);

        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        ctx.restore();
    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
        }
    }

}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;

        this.radius = 4;
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'blue'
        ctx.fill()
        ctx.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle {
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position;
        this.velocity = velocity;

        this.radius = radius;
        this.color = color
        this.opacity = 1
        this.fades = fades
    }
    draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.fades)
            this.opacity -= 0.01
    }
}

class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;

        this.width = 3
        this.height = 10
    }
    draw() {
        ctx.fillStyle = 'white'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 5,
            y: 0
        }

        this.invaders = []

        const columns = Math.floor(Math.random() * 10 + 8)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 30
        for (let x = 0; x < columns; x++) {

            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({
                    position: {
                        x: x * 30,
                        y: y * 30
                    }
                }))
            }
        }
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }


    }
}

class Invader {
    constructor({ position }) {

        this.velocity = {
            x: 0,
            y: 0
        }
        var ship = new Image();
        ship.src = "galaga/SpaceInvader/PNG/Enemies/enemyBlack1.png"
        ship.onload = () => {
            const scale = 0.4
            this.image = ship
            this.width = 100 * scale
            this.height = 100 * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }
    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)

    }

    update({ velocity }) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))

    }

}



const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = {
    over: false,
    active: true
}
let score = 0

for (let i = 0; i < 100; i++) {
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },

        velocity: {
            x: 0,
            y: 0.5
        },
        radius: Math.random() * 2,
        color: 'white',

    }))
}

function createParticles({ object, color, fades }) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },

            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 4,
            color: color || 'purple',
            fades

        }))
    }
}

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)

        } else {
            particle.update()
        }
    })
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else {
            invaderProjectile.update()
        }

        // Projectile hits player
        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width) {
            console.log('you lose')
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                game.over = true
            }, 0)

            setTimeout(() => {
                game.active = false
            }, 1000)

            createParticles({
                object: player,
                color: 'blue',
                fades: true
            })
        }
        invaderProjectile.update()
    })


    projectiles.forEach((projectile, index) => {

        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)

        } else {
            projectile.update()
        }

    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        // spawn projectiles
        if (frames % 100 == 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }

        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })

            //projectiles hit enemy
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <=
                    invader.position.y + invader.height && projectile.position.x + projectile.radius >=
                    invader.position.x && projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y) {


                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(invader2 => invader2 == invader)
                        const projectileFound = projectiles.find(
                            projectile2 => projectile2 == projectile)
                        y
                        // remove invader and projectiles and create explosions
                        if (invaderFound && projectileFound) {
                            score += 100
                            scoreEl.innerHTML = score
                            createParticles({
                                object: invader,
                                fades: true
                            })

                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                                grid.position.x = firstInvader.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }

                    }, 0)
                }
            })
        })
    })

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -7;
        player.rotation = -0.15;
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7;
        player.rotation = 0.15;

    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }

    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + 500)
        frames = 0
    }



    frames++;
}

animate()

addEventListener('keydown', (event) => {
    if (game.over) return
    switch (event.key) {
        case 'a':
            console.log('left');
            keys.a.pressed = true;
            break;
        case 'd':
            console.log('right');
            keys.d.pressed = true;
            break;
        case ' ':
            event.preventDefault(); // Prevents the default behavior of the spacebar (scrolling)
            console.log('space');
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }));
            break;
    }
});

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            console.log('left');

            keys.a.pressed = false;
            break;
        case 'd':
            console.log('right')
            keys.d.pressed = false;
            break;
        case ' ':
            console.log('space')
            break;
    }
})


