import cv2
import time
import os
import json
import sys

#Main - Opens camera and writes info into globalFrame forever
if __name__ == "__main__":

    print('Hello world')
    CURR_DIR = './'

    config = os.path.join(CURR_DIR, 'cfg/yolov3.cfg')
    weights = os.path.join(CURR_DIR, 'yolov3.weights')
    coco = os.path.join(CURR_DIR, 'cfg/coco.data')


    camera_data = json.load(open('../cameras.json'))
    cameraJson = camera_data[0]
    #TODO: Use this instead of reading from file
    # cameraJson = json.loads(sys.argv[1])
    # cameraIndex = cameraJson['index']
    cam = cv2.VideoCapture(cameraJson['url'])

    #TODO: Uncomment and test
    # thread = ProcessThread(cameraIndex, "Thread-" + str(cameraIndex), cameraJson)
    # thread.start()

    while True:
        ret, img = cam.read()
        globalFrame = img
        now = int(round(time.time()*1000))
        # cv2.imwrite('./output/' + str(now) + '.jpg', img)
    cam.release()