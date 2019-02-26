#!/usr/bin/env python3
from pydarknet import Detector, Image
import argparse
import cv2
import os
import json
import time
import threading
import base64

from xy_to_latlon import Transformer

YOLO_DIR = './yolo/'
CURR_DIR = './'

# globalCams = []
globalFrames =[None, None, None, None]

class Watcher:

    def run(self):
        print('creating cam')
        camera_data = json.load(open('../cameras.json'))

        thread = ReadImageThread(1, "Thread-" + str(1), 1, camera_data[1])
        thread.start()

        # for i in range(0, len(camera_data)):
        #     thread = ReadImageThread(i, "Thread-" + str(i), i, camera_data[i])
        #     thread.start()

#Thread that is passed the cam and shares the a
class ReadImageThread (threading.Thread):
    def __init__(self, threadID, name, counter, cameraJson):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.counter = counter
        self.cameraJson = cameraJson

      
    def run(self):
        # print('Hello World from Camera Thread ', self.name)
        cam = cv2.VideoCapture(self.cameraJson['url'])
        # print('Camera initialized')

        #TODO: Uncomment and test
        thread = ProcessThread(self.counter, "Thread-" + str(self.counter), self.counter)
        thread.start()

        while True:
            ret, img = cam.read()
            globalFrames[self.counter] = img

        cam.release()

#Thread that Process the images from globalFrames
class ProcessThread (threading.Thread):
   def __init__(self, threadID, name, counter):
      threading.Thread.__init__(self)
      self.threadID = threadID
      self.name = name
      self.counter = counter

      
   def run(self):
    # print('Hello World from ', self.name)


    time.sleep(0.1)
    counter = 0

    while True:

        img = globalFrames[self.counter]
        
        if img is None:
            # print('Img is none, so skip')
            time.sleep(0.25)
            continue

        #Possible error trying to converrt to rgb
        try:
            # b,g,r = cv2.split(img)      
            # rgb_img = cv2.merge([r,g,b])
            # image = cv2.imread('./output/location1.jpg', cv2.IMREAD_COLOR)

            returnData = {}
            #TODO// UNCOMMENT TO PROCESS THE IMAGE
            img2 = Image(img)
            height = float(img.shape[0])
            width = float(img.shape[1])

            # Load Camera metadata from JSON file for transform
            index = self.counter
            t = Transformer(index)

            results = net.detect(img2)
            bounding_boxes = [det[2] for det in results]
            returnData['detections'] = list()


            # Draw bounding boxes on output image
            for x, y, w, h in bounding_boxes:
                cv2.rectangle(img, (int(x - w / 2), int(y - h / 2)), (int(x + w / 2), int(y + h / 2)), (255, 0, 0), thickness=1)
                n, e, lat, lon = t.transform(x, y, width, height)
                    
                returnData['detections'].append({"screen_x": int(x),
                    "screen_y": int(y),
                    "north_disp": int(n),
                    "east_disp": int(e),
                    "latitude": lat,
                    "longitude": lon})


            retval, buffer = cv2.imencode('.jpg', img)
            base64_bytes = base64.b64encode(buffer)
            jpg_as_text = base64_bytes.decode('utf-8')

            returnData['index'] = self.counter
            returnData['img64'] = jpg_as_text
            print(json.dumps(returnData))
            

            # process_image(fileName, rgb_img)
        except Exception as e:
            print('Exceptions in thread ' + str(self.counter) + ', ' + str(e))
             #do nothing
         


if __name__ == "__main__":

    # FOR DEBUGGING PURPOSES. When called from server.js, need to switch into
    #Yolo directory. When called from python3, this will throw exception
    try: 
        os.chdir('./yolo') 
    except Exception as e:
        print(e)

    config = os.path.join(CURR_DIR, 'cfg/yolov3.cfg')
    weights = os.path.join(CURR_DIR, 'yolov3.weights')
    coco = os.path.join(CURR_DIR, 'cfg/coco.data')

    net = Detector(bytes(config, encoding="utf-8"), bytes(weights, encoding="utf-8"), 0, bytes(coco, encoding="utf-8"))

    w = Watcher()
    w.run() 
