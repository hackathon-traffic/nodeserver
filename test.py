import argparse

ap = argparse.ArgumentParser()
ap.add_argument('-i','--image', required=True, help='')
args = ap.parse_args()
print(args.image)