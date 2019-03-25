#!/usr/bin/env python3
from pydarknet import Detector, Image
import argparse
import cv2
import os
import json
import time
import threading
import base64
import sys
from xy_to_latlon import Transformer

YOLO_DIR = './yolo/'
CURR_DIR = './'

globalFrame = None

#Thread that Process the image from globalFrame
class ProcessThread (threading.Thread):
   def __init__(self, threadID, name, cameraJson):
      threading.Thread.__init__(self)
      self.threadID = threadID
      self.name = name
      self.cameraJson = cameraJson

      
   def run(self):
    # print('Hello World from ', self.name)


    time.sleep(0.1)
    counter = 0

    while True:

        img = globalFrame

        if img is None:
            # print('Img is none, so skip')
            time.sleep(0.25)
            continue

        #Possible error trying to converrt to rgb
        try:
            #TODO// UNCOMMENT TO PROCESS THE IMAGE
            img2 = Image(img)
            height = float(img.shape[0])
            width = float(img.shape[1])

            # Load Camera metadata from JSON file for transform
            t = Transformer(self.cameraJson)

            results = net.detect(img2)
            bounding_boxes = [det[2] for det in results]
            returnData = {}
            returnData['detections'] = list()


            # Draw bounding boxes on output image
            for x, y, w, h in bounding_boxes:
                cv2.rectangle(img, (int(x - w / 2), int(y - h / 2)), (int(x + w / 2), int(y + h / 2)), (255, 0, 0), thickness=1)
                n, e, lat, lon = t.transform(x, y, width, height)
                    
                returnData['detections'].append({"screen_x": x,
                    "screen_y": y,
                    "width":w,
                    "height":h,
                    "north_disp": n,
                    "east_disp": e,
                    "latitude": lat,
                    "longitude": lon}
                )

            json_data = json.dumps(returnData)
            print(json_data)
            retval, buffer = cv2.imencode('.jpg', img)
            base64_bytes = base64.b64encode(buffer)
            jpg_as_text = base64_bytes.decode('utf-8')
            print(jpg_as_text)
            
        except Exception as e:
            print('Exceptions in thread ' + str(self.cameraJson['index']) + ', ' + str(e))
             #do nothing
         

#Main - Opens camera and writes info into globalFrame forever
if __name__ == "__main__":

    print('Hello world')
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

    #TODO: Use this instead of reading from file
    cameraJson = json.loads(sys.argv[1])
    cameraIndex = cameraJson['index']

    cam = cv2.VideoCapture(cameraJson['url'])

    #TODO: Uncomment and test
    thread = ProcessThread(cameraIndex, "Thread-" + str(cameraIndex), cameraJson)
    thread.start()

    while True:
        ret, img = cam.read()
        globalFrame = img
        
    cam.release()