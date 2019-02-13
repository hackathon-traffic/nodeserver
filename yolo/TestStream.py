import cv2

cam = cv2.VideoCapture('rtmp://wzmedia.dot.ca.gov:1935/D4/W80_at_Carlson_Blvd_OFR.stream')
ret, img = cam.read()
count = 0
while True:
    count +=1
    ret, img = cam.read()
    fileName = '/input/location1/', count, '.jpg'
    # cv2.imwrite(fileName, img)
    cv2.imshow('drone', img)
    cv2.waitKey(2000)

    # press esc to exit
    if count == 27: 
        break

# cv2.destroyAllWindows()
# cv2.imwrite('/input/location1/' , img)