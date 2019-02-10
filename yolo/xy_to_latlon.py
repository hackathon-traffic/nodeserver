from numpy import pi, sin, cos, tan

class Transformer:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.camera_height = 10
        self.vfov = 75 * pi/180
        self.rotation_angle = -74 * pi/180
        self.down_angle = 10 * pi/180

    def transform(self, x, y):
        # Transform X and Y to [-1,1] scale
        x = (x - self.width // 2) / (self.height // 2)
        y = ((self.height // 2) - y) / (self.height // 2)


        # Transform X and Y to actual meter away from pole
        tan_vfov = tan(self.vfov / 2)
        x = self.camera_height * (x * tan_vfov) / (
            sin(self.down_angle) - y * cos(self.down_angle) * tan_vfov)
        y = self.camera_height * (cos(self.down_angle) + y * sin(self.down_angle)*tan_vfov) / (
            sin(self.down_angle) - y * cos(self.down_angle) * tan_vfov)

        if(y < 0 or y > 1000):
            (E, N) = (0,0)
        else:
            E = cos(self.rotation_angle) * x - sin(self.rotation_angle) * y
            N = sin(self.rotation_angle) * x + cos(self.rotation_angle) * y

        return (E, N)
