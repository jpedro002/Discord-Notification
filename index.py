import os
import random

with open('shablau.txt', 'w') as f:
    f.write(str(random.randint(1, 100)))

os.system('git add shablau.txt')
os.system('git commit -m "Adicionado número aleatório em shablau.txt"')
os.system('git push')