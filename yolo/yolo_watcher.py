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
        filename = os.path.basename(event.src_path)
        if(filename.endswith(('.png', '.jpg', '.jpeg'))):
            process_image(filename)

def process_image(filename):
    input_img = './yolo/input/' + filename
    output_img = './yolo/output/' + filename
    output_dat = './yolo/dat/' + filename.split('.')[0] + '.dat'

    img = cv2.imread(input_img)
    img2 = Image(img)
    height = float(img.shape[0])
    width = float(img.shape[1])

    # Load Camera metadata from JSON file for transform
    index = int(filename.split('.')[0][-1]) - 1
    t = Transformer(index)

    results = net.detect(img2)
    output = open(output_dat, 'w')
    for cat, score, bounds in results:
        x, y, w, h = bounds

        cv2.rectangle(img, (int(x - w / 2), int(y - h / 2)), (int(x + w / 2), int(y + h / 2)), (255, 0, 0), thickness=2)
        cv2.imwrite(output_img, img)
        output.write("%8d%8d\n" % (x, y))
        output.write("%8d%8d\n\n" % t.transform(x, y, width, height))

if __name__ == "__main__":
    darknet_path = os.environ['DARKNET_HOME']
    config = os.path.join(darknet_path, 'cfg/yolov3.cfg')
    weights = os.path.join(darknet_path, 'yolov3.weights')
    coco = os.path.join(darknet_path, 'cfg/coco.data')

    net = Detector(bytes(config, encoding="utf-8"), bytes(weights, encoding="utf-8"), 0, bytes(coco, encoding="utf-8"))

    w = Watcher()
    w.run() 
