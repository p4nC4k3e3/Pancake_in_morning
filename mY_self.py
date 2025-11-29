import os
os.system("cls")

class Me:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def me2(self):
        info = f"my name is {self.name}\nmy age is {self.age}"
        print(info.strip().title())

p1 = Me("jonvee santos", 19)
p1.me2()
