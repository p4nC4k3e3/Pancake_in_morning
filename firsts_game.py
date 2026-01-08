import pygame
import sys
import random  

pygame.init()

SCREEN_WIDTH = 1000
SCREEN_HEIGHT = 400
GRAVITY = 0.5
JUMP_STRENGTH = -10
OBSTACLE_SPEED = 5

text_font = pygame.font.Font('grounds/font.otf', 50)
small_font = pygame.font.Font('grounds/font.otf', 30)
button_font = pygame.font.Font('grounds/font.otf', 30)

class GameObject:
    def __init__(self, x, y, image_path, scale=(50, 50)):
        self.__x = x 
        self.__y = y  
        self.image = pygame.image.load(image_path).convert_alpha()
        self.image = pygame.transform.scale(self.image, scale)
        self.rect = self.image.get_rect(topleft=(self.__x, self.__y))

    def get_x(self):
        return self.__x

    def get_y(self):
        return self.__y

    def set_x(self, x):
        self.__x = x
        self.rect.topleft = (self.__x, self.__y)

    def set_y(self, y):
        self.__y = y
        self.rect.topleft = (self.__x, self.__y)

    def set_image(self, image_path, scale=(50, 50)):  
        self.image = pygame.image.load(image_path).convert_alpha()
        self.image = pygame.transform.scale(self.image, scale)
        self.rect = self.image.get_rect(topleft=(self.__x, self.__y))

    def draw(self, screen):
        screen.blit(self.image, (self.__x, self.__y))

    def update(self):
        pass  

class Player(GameObject):
    def __init__(self, x, y, image_path):
        super().__init__(x, y, image_path)
        self.__vel_y = 0  
        self.__on_ground = True  

    def get_vel_y(self):
        return self.__vel_y

    def set_vel_y(self, vel_y):
        self.__vel_y = vel_y

    def is_on_ground(self):
        return self.__on_ground

    def set_on_ground(self, on_ground):
        self.__on_ground = on_ground

    def jump(self):
        if self.__on_ground:
            self.__vel_y = JUMP_STRENGTH
            self.__on_ground = False

    def update(self):
        self.__vel_y += GRAVITY
        self.set_y(self.get_y() + self.__vel_y)
        if self.get_y() >= 280:
            self.set_y(280)
            self.__vel_y = 0
            self.__on_ground = True

class Obstacle(GameObject):
    def __init__(self, x, y, image_path):
        super().__init__(x, y, image_path)
        self.__passed = False  
        self.enemy_images = ['grounds/enem1.png', 'grounds/enem2.png', 'grounds/enem3.png']
        self.possible_y = [280, 200]  # Possible y positions for variety

    def is_passed(self):
        return self.__passed

    def set_passed(self, passed):
        self.__passed = passed

    def update(self):
        self.set_x(self.get_x() - OBSTACLE_SPEED)
        if self.get_x() < -50:
            self.set_x(1000)
            self.set_y(random.choice(self.possible_y))  # Randomize y on reset
            self.set_image(random.choice(self.enemy_images))  # Randomize image on reset
            self.__passed = False

class Button:
    def __init__(self, x, y, width, height, text, font, color=(255, 255, 255), hover_color=(200, 200, 200)):
        self.rect = pygame.Rect(x, y, width, height)
        self.text = text
        self.font = font
        self.color = color
        self.hover_color = hover_color
        self.is_hovered = False

    def draw(self, screen):
        color = self.hover_color if self.is_hovered else self.color
        pygame.draw.rect(screen, color, self.rect, border_radius=10)
        text_surf = self.font.render(self.text, True, (0, 0, 0))
        text_rect = text_surf.get_rect(center=self.rect.center)
        screen.blit(text_surf, text_rect)

    def check_hover(self, mouse_pos):
        self.is_hovered = self.rect.collidepoint(mouse_pos)

    def is_clicked(self, mouse_pos, mouse_pressed):
        return self.rect.collidepoint(mouse_pos) and mouse_pressed[0]

class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("RuNniNg BlOcK")
        block_icon = pygame.image.load('grounds/user.png')
        pygame.display.set_icon(block_icon)
        self.clock = pygame.time.Clock()

        self.back_surface = pygame.image.load('grounds/back_ground.jpg').convert()
        self.back_surface = pygame.transform.scale(self.back_surface, (SCREEN_WIDTH, SCREEN_HEIGHT))
        self.ground_surface = pygame.image.load('grounds/ground.jpg').convert()
        self.ground_surface = pygame.transform.scale(self.ground_surface, (SCREEN_WIDTH, 100))
        self.ground1_surface = pygame.image.load('grounds/ground.jpg').convert()
        self.ground1_surface = pygame.transform.scale(self.ground1_surface, (SCREEN_WIDTH, 57))     

        self.player = Player(100, 280, 'grounds/user.png')  
        self.obstacles = [
            Obstacle(1000, 280, random.choice(['grounds/enem1.png', 'grounds/enem2.png', 'grounds/enem3.png'])),  
            Obstacle(600, 200, random.choice(['grounds/enem1.png', 'grounds/enem2.png', 'grounds/enem3.png']))    
        ]

        self.state = 'menu'  
        self.game_over = False
        self.score = 0
        self.high_score = 0
        self.start_time = 0

        # Load high score from file if exists
        try:
            with open('high_score.txt', 'r') as f:
                self.high_score = int(f.read())
        except:
            self.high_score = 0

        self.start_button = Button(400, 150, 200, 50, "Start", button_font)  
        self.about_button = Button(400, 220, 200, 50, "About", button_font)  
        self.settings_button = Button(400, 290, 200, 50, "Settings", button_font)  
        self.quit_button = Button(400, 360, 200, 50, "Quit", button_font)  # New quit button
        self.back_button = Button(400, 320, 200, 50, "Back", button_font) 
        self.menu_button = Button(400, 250, 200, 50, "Menu", button_font)  # For game over

    def handle_events(self):
        mouse_pos = pygame.mouse.get_pos()
        mouse_pressed = pygame.mouse.get_pressed()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.save_high_score()
                pygame.quit()
                sys.exit()

        if self.state == 'menu':
            self.start_button.check_hover(mouse_pos)
            self.about_button.check_hover(mouse_pos)
            self.settings_button.check_hover(mouse_pos)
            self.quit_button.check_hover(mouse_pos)
            if self.start_button.is_clicked(mouse_pos, mouse_pressed):
                self.start_game()
            elif self.about_button.is_clicked(mouse_pos, mouse_pressed):
                self.state = 'about'
            elif self.settings_button.is_clicked(mouse_pos, mouse_pressed):
                self.state = 'settings'
            elif self.quit_button.is_clicked(mouse_pos, mouse_pressed):
                self.save_high_score()
                pygame.quit()
                sys.exit()
        elif self.state in ['about', 'settings']:
            self.back_button.check_hover(mouse_pos)
            if self.back_button.is_clicked(mouse_pos, mouse_pressed):
                self.state = 'menu'
        elif self.state == 'playing':
            if not self.game_over:
                keys = pygame.key.get_pressed()
                if keys[pygame.K_SPACE]:
                    self.player.jump()
            else:
                self.menu_button.check_hover(mouse_pos)
                if self.menu_button.is_clicked(mouse_pos, mouse_pressed):
                    self.state = 'menu'

    def start_game(self):
        self.state = 'playing'
        self.game_over = False
        self.score = 0
        self.start_time = pygame.time.get_ticks()
        self.player.set_y(280)
        self.player.set_vel_y(0)
        self.player.set_on_ground(True)
        for obstacle in self.obstacles:
            obstacle.set_passed(False)
            obstacle.set_image(random.choice(obstacle.enemy_images)) 
            obstacle.set_y(random.choice(obstacle.possible_y))
        self.obstacles[0].set_x(1000)
        self.obstacles[1].set_x(600)

    def update(self):
        if self.state == 'playing' and not self.game_over:
            self.player.update()
            for obstacle in self.obstacles:
                obstacle.update()
            for obstacle in self.obstacles:
                if self.player.rect.colliderect(obstacle.rect):
                    self.game_over = True
                    if self.score > self.high_score:
                        self.high_score = self.score
                        self.save_high_score()
            self.score = (pygame.time.get_ticks() - self.start_time) // 1000

    def draw(self):
        self.screen.blit(self.back_surface, (0, 0))
        self.screen.blit(self.ground_surface, (0, 330))
        self.screen.blit(self.ground1_surface, (0, 0))

        if self.state == 'menu':
            title_surf = text_font.render("RuNniNg BlOcK", True, (255, 255, 255))
            title_rect = title_surf.get_rect(center=(SCREEN_WIDTH // 2, 50))  
            self.screen.blit(title_surf, title_rect)
            high_score_text = small_font.render(f'High Score: {self.high_score}', True, (255, 255, 255))
            self.screen.blit(high_score_text, (10, 10))
            self.start_button.draw(self.screen)
            self.about_button.draw(self.screen)
            self.settings_button.draw(self.screen)
            self.quit_button.draw(self.screen)
        elif self.state == 'about':
            about_text = [
                "About:",
                "This is a simple running game.",
                "Jump over obstacles with SPACE.",
                "Score is based on time survived."
            ]
            for i, line in enumerate(about_text):
                text = small_font.render(line, True, (255, 255, 255))
                self.screen.blit(text, (200, 100 + i * 40))
            self.back_button.draw(self.screen)
        elif self.state == 'settings':
            settings_text = small_font.render("Settings: (Placeholder)", True, (255, 255, 255))
            self.screen.blit(settings_text, (300, 150))
            self.back_button.draw(self.screen)
        elif self.state == 'playing':
            self.player.draw(self.screen)
            score_text = small_font.render(f'Score: {self.score}', False, (255, 255, 255))
            self.screen.blit(score_text, (10, 10))

            if not self.game_over:
                for obstacle in self.obstacles:
                    obstacle.draw(self.screen)
            else:
                self.screen.blit(text_font.render('Game Over', False, (255, 0, 0)), (400, 150))
                self.screen.blit(small_font.render('Press R to Restart or M to Menu', False, (255, 255, 255)), (300, 200))
                self.menu_button.draw(self.screen)

    def handle_game_over_inputs(self):
        if self.state == 'playing' and self.game_over:
            keys = pygame.key.get_pressed()
            if keys[pygame.K_r]:
                self.start_game()
            elif keys[pygame.K_m]:
                self.state = 'menu'

    def save_high_score(self):
        with open('high_score.txt', 'w') as f:
            f.write(str(self.high_score))

    def run(self):
        while True:
            self.handle_events()
            self.update()
            self.draw()
            self.handle_game_over_inputs()
            pygame.display.update()
            self.clock.tick(60)

if __name__ == "__main__":
    game = Game()
    game.run()
