from numpy import sin, cos, tan, radians
import json

class Transformer:
    def __init__(self, index):
        camera_data = json.load(open('./cameras.json'))[index]

        self.camera_height = camera_data['camera_height']
        self.vfov = radians(camera_data['vertical_fov'])
        self.azimuthal_angle = radians(camera_data['azimuthal_angle'])
        self.down_look_angle = radians(camera_data['down_look_angle'])

    def transform(self, x, y, width, height):
        print('transforming coords')
        # Transform X and Y to [-1,1] scale
        x = (x - width // 2) / (height // 2)
        y = ((height // 2) - y) / (height // 2)

        # Transform X and Y to actual meter away from pole
        tan_vfov = tan(self.vfov / 2)
        x = self.camera_height * (x * tan_vfov) / (
            sin(self.down_look_angle) - y * cos(self.down_look_angle) * tan_vfov)
        y = self.camera_height * (cos(self.down_look_angle) + y * sin(self.down_look_angle)*tan_vfov) / (
            sin(self.down_look_angle) - y * cos(self.down_look_angle) * tan_vfov)

        if(y < 0 or y > 1000):
            (E, N) = (0,0)
        else:
            E = cos(self.azimuthal_angle) * x - sin(self.azimuthal_angle) * y
            N = sin(self.azimuthal_angle) * x + cos(self.azimuthal_angle) * y

        return (E, N)
