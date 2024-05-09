import os
import random

while(True):
    i =  input('digite *push* para fazer um push de tudo ou *mdpush* ou *parar*')
    
    if i == "parar": break
    elif i == "push": 
        os.system('git add .')
        os.system('git commit -m "push"')
        os.system('git push')
    elif i == "mdpush":
        with open('shablau.txt', 'w') as f:
            f.write(str(random.randint(1, 100)))
            os.system('git add shablau.txt')
            os.system('git commit -m "Adicionado número aleatório em shablau.txt"')
            os.system('git push')