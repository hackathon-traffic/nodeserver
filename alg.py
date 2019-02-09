import math
import argparse

ap = argparse.ArgumentParser()
ap.add_argument('-f', '--file', required=True,
                help = 'path to input file')
args = ap.parse_args()

camera_height = 10
vfov = 70 * math.pi/180
rotation_angle = -15 * math.pi/180
down_angle = 30 * math.pi/180

def alg():
    f = open(args.file, "r")

    first_line = f.readline()
    hrez_half, vrez_half = first_line.split()
   
    hrez_half = int(hrez_half) // 2
    vrez_half = int(vrez_half) // 2
    
    for line in f:
        _h, _v = line.split()
        _h = int(_h)
        _v = int(_v)

        _x = (_h - hrez_half) / vrez_half
        _y = (vrez_half - _v) / vrez_half

        getCoordinate(_x, _y)


def getCoordinate(x_s, y_s):
    
    E = camera_height * ((x_s * math.tan(vfov / 2) * math.cos(rotation_angle)) - ( math.cos(down_angle) + y_s * math.sin(down_angle) * math.tan(vfov / 2) * math.sin(rotation_angle) )) / (math.sin(down_angle) - y_s * math.cos(down_angle) * math.tan(vfov / 2) )

    N = camera_height * ((x_s * math.tan(vfov / 2) * math.sin(rotation_angle)) + ( math.cos(down_angle) + y_s * math.sin(down_angle) * math.tan(vfov / 2) * math.cos(rotation_angle) )) / (math.sin(down_angle) - y_s * math.cos(down_angle) * math.tan(vfov / 2) )

    print(E, N)


if __name__ == "__main__":
    alg()