# 🏃 RuNniNg BlOcK

A simple side-scrolling obstacle-dodging game built with Pygame. Jump over incoming enemies, survive as long as you can, and beat your high score.

## Gameplay

- Press **SPACE** to jump
- Obstacles scroll in from the right at a fixed speed and randomize their position/image each time they reset
- Your score increases the longer you survive
- On game over: press **R** to restart or **M** to return to the menu
- High score persists between sessions (saved to `high_score.txt`)

## Screens

- **Menu** — Start, About, Settings, Quit
- **About** — brief game instructions
- **Settings** — placeholder for future options
- **Playing** — the actual run, with live score display
- **Game Over** — final score, restart/menu prompt

## Requirements

```bash
pip install pygame
```

## Project Structure

```
running-block/
├── main.py
├── high_score.txt          # auto-created on first run
└── grounds/
    ├── font.otf
    ├── user.png             # player sprite
    ├── enem1.png            # enemy sprite variants
    ├── enem2.png
    ├── enem3.png
    ├── back_ground.jpg
    └── ground.jpg
```

> All assets in `grounds/` must be present or the game will fail to load.

## Run It

```bash
python main.py
```

## Architecture

Built around a small class hierarchy rather than one flat script:

- **`GameObject`** — base class handling position, image loading/scaling, and drawing. Position (`x`, `y`) is private with getter/setter access.
- **`Player(GameObject)`** — adds gravity, vertical velocity, jump physics, and ground detection.
- **`Obstacle(GameObject)`** — adds horizontal scroll movement and resets itself (position, sprite, height) once it passes off-screen.
- **`Button`** — reusable clickable UI element with hover state, used across the menu screens.
- **`Game`** — owns the game loop, screen state machine (`menu` / `about` / `settings` / `playing`), collision checks, scoring, and high-score persistence.

## What I Learned Building This

- Structuring a game with **OOP and encapsulation** (private attributes with getters/setters) instead of loose global variables
- Implementing a basic **physics loop** — gravity accumulation, velocity, and ground collision
- Building a **state machine** to manage menu vs. gameplay vs. game-over screens cleanly
- Using `pygame.Rect.colliderect()` for collision detection
- Persisting data between sessions by reading/writing a plain text file (`high_score.txt`)
- Randomizing obstacle position and sprite on reset to keep gameplay varied

## Possible Improvements

- Replace `while True` keypress checks in `handle_game_over_inputs` with event-based input to avoid rapid restart triggering
- Move color/asset paths to a config file instead of hardcoding
- Add difficulty scaling (increasing `OBSTACLE_SPEED` over time)
- Implement the placeholder Settings screen