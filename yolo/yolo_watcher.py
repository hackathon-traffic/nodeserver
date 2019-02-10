#!/usr/bin/env python3
from pydarknet import Detector, Image
import argparse
import cv2
import os

import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

from xy_to_latlon import Transformer

class Watcher:
    def __init__(self):
        self.DIRECTORY_TO_WATCH = './yolo/input'
        print('Watching \'%s\' directory for images' % self.DIRECTORY_TO_WATCH)
        self.observer = Observer()

    def run(self):
        event_handler = Handler()
        self.observer.schedule(event_handler, self.DIRECTORY_TO_WATCH, recursive=True)
        self.observer.start()
        try:
            while True:
                time.sleep(5)
        except:
            self.observer.stop()
            print("Error")

        self.observer.join()

class Handler(FileSystemEventHandler):
    @staticmethod
    def on_modified(event):
        if(event.src_path.endswith(('.png', '.jpg', '.jpeg'))):
            # print("Updated image file %s" % event.src_path)
            process_image(event.src_path)

def process_image(image_path):
    output_dat = './yolo/dat/' + image_path.split('/')[-1].split('.')[0] + '.dat'
    output_img = './yolo/output/' + image_path.split('/')[-1]

    img = cv2.imread(image_path)
    img2 = Image(img)
    img_height = float(img.shape[0])
    img_width = float(img.shape[1])

    t = Transformer(img_width, img_height)

    results = net.detect(img2)
    output = open(output_dat, 'w')
    output.write("%d\t%d\n" % (img_width, img_height))
    output.write("\n")
    for cat, score, bounds in results:
        x, y, w, h = bounds

        output.write("%8d%8d\n" % (x, y))
        output.write("%8d%8d\n\n" % t.transform(x, y))
        cv2.rectangle(img, (int(x - w / 2), int(y - h / 2)), (int(x + w / 2), int(y + h / 2)), (255, 0, 0), thickness=2)
        cv2.imwrite(output_img, img)

    # print('%d Detections logged in %s' % (len(results), output_dat))

if __name__ == "__main__":
    darknet_path = os.environ['DARKNET_HOME']
    config = os.path.join(darknet_path, 'cfg/yolov3.cfg')
    weights = os.path.join(darknet_path, 'yolov3.weights')
    coco = os.path.join(darknet_path, 'cfg/coco.data')

    net = Detector(bytes(config, encoding="utf-8"), bytes(weights, encoding="utf-8"), 0, bytes(coco, encoding="utf-8"))

    w = Watcher()
    w.run() 
