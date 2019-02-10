import subprocess
import datetime
import sched, time

timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
script = 'ffmpeg -y -i rtmp://wzmedia.dot.ca.gov:1935/D4/E4_at_Port_Chicago_Hwy.stream -vframes 1 ' + 'input/' + timestamp + '.jpg'
print(script)
subprocess.call(script, shell=True)

# s = sched.scheduler(time.time, time.sleep)
# def getImage(sc): 
#     timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
#     script = 'ffmpeg -y -i rtmp://wzmedia.dot.ca.gov:1935/D4/E4_at_Port_Chicago_Hwy.stream -vframes 1 ' + 'input/' + timestamp + '.jpg'
#     print(script)
# #     # script = 'ffmpeg -y -i rtmp://wzmedia.dot.ca.gov:1935/D4/E4_at_Port_Chicago_Hwy.stream -vframes 1 ../yolo/input/location1.jpg'
#     subprocess.call(script, shell=True)
#     s.enter(1, 1, getImage, (sc,))

# s.enter(1, 1, getImage, (s,))
# s.run()



