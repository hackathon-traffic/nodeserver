#!/usr/bin/env python3
from pydarknet import Detector, Image
import argparse
import cv2
import os
import json
import time
import threading

from xy_to_latlon import Transformer

YOLO_DIR = './yolo/'
CURR_DIR = './'

globalFrames =[None, None, None, None]

class Watcher:

    def run(self):
        print('creating cam')
        camera_data = json.load(open('../cameras.json'))

        cams = []
        for camera in camera_data:
            cams.append(cv2.VideoCapture(camera['url']))


        for i in range(0, len(cams)):
            thread = myThread(i, "Thread-" + str(i), i)
            thread.start()

        while True:  
            #Go through cams and read frames        
            for i in range(0, len(cams)):
                ret, img = cams[i].read()
                globalFrames[i] = img
                    # cv2.imwrite(CURR_DIR + 'output/' + fileName, img)

        cam.release()

#Thread that is passed the cam and shares the a
class myThread (threading.Thread):
   def __init__(self, threadID, name, counter):
      threading.Thread.__init__(self)
      self.threadID = threadID
      self.name = name
      self.counter = counter

      
   def run(self):
    print('Hello World from ', self.name)
    time.sleep(0.1)

    while True:
        img = globalFrames[self.counter]
        fileName = 'location' + str(self.counter + 1) + '.jpg'
        process_image(fileName, img)
         
         

def process_image(filename, img):

    output_img = CURR_DIR + 'output/' + filename
    output_json = CURR_DIR + 'dat/' + filename.split('.')[0] + '.json'

    img2 = Image(img)
    height = float(img.shape[0])
    width = float(img.shape[1])

    # Load Camera metadata from JSON file for transform
    index = int(filename.split('.')[0][-1]) - 1
    t = Transformer(index)

    results = net.detect(img2)
    bounding_boxes = [det[2] for det in results]
    data = {'detections': list()}


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

    os.chdir('./yolo')

    config = os.path.join(CURR_DIR, 'cfg/yolov3.cfg')
    weights = os.path.join(CURR_DIR, 'yolov3.weights')
    coco = os.path.join(CURR_DIR, 'cfg/coco.data')

    net = Detector(bytes(config, encoding="utf-8"), bytes(weights, encoding="utf-8"), 0, bytes(coco, encoding="utf-8"))

    w = Watcher()
    w.run() 
