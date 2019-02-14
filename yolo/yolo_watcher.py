#!/usr/bin/env python3
from pydarknet import Detector, Image
import argparse
import cv2
import os
import json
import time

from xy_to_latlon import Transformer

YOLO_DIR = './yolo/'
CURR_DIR = './'

class Watcher:

    def run(self):
        event_handler = Handler()
        event_handler.run()


class Handler():

    def run(self):
        print('creating cam')
        camera_data = json.load(open('../cameras.json'))
        streamName = 'rtmp://wzmedia.dot.ca.gov:1935/D4/E580_Lower_Deck_Pier_16.stream'
        cam = cv2.VideoCapture(streamName)
        count = 0
        
        # Default imageProcessing interval in seconds
        imageProcessingInterval = 0.25

        lastProcessed = time.time()

        while True:
            ret, img = cam.read()
            if lastProcessed + imageProcessingInterval < time.time():
                count += 1
                print('Writing image: ', count)
                lastProcessed = time.time()
                filename = 'location2.jpg'
                cv2.imwrite(CURR_DIR + 'output/location2.jpg', img)

        # process_image(filename, img)
        cam.release()

def process_image(filename, img):

    output_img = CURR_DIR + 'output/' + filename
    output_json = CURR_DIR + 'dat/' + filename.split('.')[0] + '.json'
    output_dat = CURR_DIR + 'dat/' + filename.split('.')[0] + '.dat'

    img2 = Image(img)
    height = float(img.shape[0])
    width = float(img.shape[1])

    # Load Camera metadata from JSON file for transform
    index = int(filename.split('.')[0][-1]) - 1
    t = Transformer(index)

    results = net.detect(img2)
    bounding_boxes = [det[2] for det in results]
    data = {'detections': list()}


    output = open(output_dat, 'w')
    # Draw bounding boxes on output image
    for x, y, w, h in bounding_boxes:
        cv2.rectangle(img, (int(x - w / 2), int(y - h / 2)), (int(x + w / 2), int(y + h / 2)), (255, 0, 0), thickness=1)
        cv2.imwrite(output_img, img)
        n, e, lat, lon = t.transform(x, y, width, height)
        
       
        # output.write('%s\t%s\n' % (lat, lon))
        
        data['detections'].append({"screen_x": int(x),
                           "screen_y": int(y),
                           "north_disp": int(n),
                           "east_disp": int(e),
                           "latitude": lat,
                           "longitude": lon})
    print('%s\n' % data)
    
    output = open(output_json, 'w')
    json.dump(data, output, indent=4)
    

    # Write to JSON data file
    # output = open(output_json, 'w')
    # json.dump(data, output, indent=4)

if __name__ == "__main__":
    # config = os.path.join(YOLO_DIR, 'cfg/yolov3.cfg')
    # coco = os.path.join(YOLO_DIR, 'cfg/coco.data')
    # weights = os.path.join(YOLO_DIR, 'yolov3.weights')
    # net = Detector(bytes(config, encoding="utf-8"), bytes(weights, encoding="utf-8"), 0, bytes(coco, encoding="utf-8"))

    os.chdir('./yolo')

    config = os.path.join(CURR_DIR, 'cfg/yolov3.cfg')
    weights = os.path.join(CURR_DIR, 'yolov3.weights')
    coco = os.path.join(CURR_DIR, 'cfg/coco.data')

    net = Detector(bytes(config, encoding="utf-8"), bytes(weights, encoding="utf-8"), 0, bytes(coco, encoding="utf-8"))

    w = Watcher()
    w.run() 
