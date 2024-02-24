import bus from "../../../../assets/svgs/bus.svg";
import Colors from "../../../../assets/constants/Colors";

export const icons = ({
    color = Colors.buslab,
    width,
    height,
    horizontal = 55,
    vertical = 55,
    rotation = 0,
}) => {
    return {
        busDirection: {
            path:
                "M0 120.995H242M121.005 0L121.005 242M193 121C193 160.765 160.765 193 121 193C81.2355 193 49 160.765 49 121C49 81.2355 81.2355 49 121 49C160.765 49 193 81.2355 193 121ZM105.099 40.5H136.901C138.367 40.5 139.335 38.9751 138.711 37.6486L122.81 3.84697C122.089 2.31546 119.911 2.31546 119.19 3.84697L103.289 37.6486C102.665 38.9751 103.633 40.5 105.099 40.5Z",
            fillColor: color,
            fillOpacity: 0.98,
            scale: (width / 120, height / 120), // scaled size
            anchor: new window.google.maps.Point(120, 120), // anchor},
            labelOrigin: new window.google.maps.Point(horizontal + 65, vertical + 65),
            strokeOpacity: 0,
            rotation,
        },

        build: {
            path:
                "M436 480h-20V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v456H12c-6.627 0-12 5.373-12 12v20h448v-20c0-6.627-5.373-12-12-12zM128 76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76zm0 96c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40zm52 148h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40c0 6.627-5.373 12-12 12zm76 160h-64v-84c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v84zm64-172c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12v-40c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40zm0-96c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V76c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v40z",
            fillColor: color,
            fillOpacity: 1,
            scale: (width / 100, height / 100), // scaled size
            anchor: new window.google.maps.Point(20, 20), // anchor},
            labelOrigin: new window.google.maps.Point(horizontal, vertical),
        },
        point: {
            path:
                "M0.5 57.5C0.5 88.9802 26.0198 114.5 57.5 114.5C88.9802 114.5 114.5 88.9802 114.5 57.5C114.5 26.0198 88.9802 0.5 57.5 0.5C26.0198 0.5 0.5 26.0198 0.5 57.5Z",
            fillColor: color,
            fillOpacity: 0.98,
            scale: (width / 100, height / 100), // scaled size
            anchor: new window.google.maps.Point(60, 60), // anchor},
            labelOrigin: new window.google.maps.Point(horizontal, vertical),
            strokeOpacity: 0,
        },

        bus: {
            url: bus, // url
            scaledSize: new window.google.maps.Size(width, height), // scaled size
            origin: new window.google.maps.Point(0, 0), // origin
            anchor: new window.google.maps.Point(0, 0), // anchor
        },
    };
};
