import { FC, useEffect, useRef } from "react";
import { SVGOverlay, Circle } from 'react-leaflet';
import { StyledTooltip as Tooltip } from './Tooltip';
import { LatLngTuple } from 'leaflet';
import { IDevice } from '../TableColumns/devicesColumns';
// import { geoJsonGroupText } from "./geoJsonGroupText";

const STATUS_OK = "#555555";
const STATUS_ALERT = "#ff4040";
const SELECTED = "#3274d9";
const NON_SELECTED = "#9c9a9a";

const setDeviceStyle = (deviceStatus: string, isSelected: boolean) => {
    if (deviceStatus !== "OK") {
        return {
            stroke: true,
            color: isSelected ? SELECTED : NON_SELECTED,
            weight: isSelected ? 3 : 2,
            opacity: 1,
            fill: true,
            fillColor: STATUS_ALERT,
            fillOpacity: 0.2
        }

    } else {
        return {
            stroke: true,
            color: isSelected ? SELECTED : NON_SELECTED,
            weight: isSelected ? 3 : 2,
            opacity: 1,
            fill: true,
            fillColor: STATUS_OK,
            fillOpacity: 0.2
        }
    }
}


interface GeoDeviceProps {
    deviceData: IDevice;
    deviceSelected: IDevice | null;
    selectDevice: (deviceSelected: IDevice) => void;
}

const setDeviceCircleColor = (deviceId: number, deviceSelected: IDevice | null): string => {
    let color = NON_SELECTED;
    if (deviceSelected && deviceId === deviceSelected.id) {
        return SELECTED;
    }
    return color;
}


const GeoDevice: FC<GeoDeviceProps> = ({ deviceData, deviceSelected, selectDevice }) => {
    const geoJsonLayer = useRef(null);
    const deviceSize = 0.00002;
    const bounds = [
        [deviceData.latitude - deviceSize * 0.5, deviceData.longitude - deviceSize * 0.5],
        [deviceData.latitude + deviceSize * 0.5, deviceData.longitude + deviceSize * 0.5],
    ]

    const clickHandler = () => {
        selectDevice(deviceData);
    }

    // const styleGeoJson = (geoJsonFeature: any) => {
    //     const isSelected = deviceData.id === deviceSelected;
    //     return setDeviceStyle("OK", isSelected);
    // }


    useEffect(() => {
        const currenGeoJsonLayer = geoJsonLayer.current;
        const isSelected = deviceSelected?.id === deviceData.id ;
        if (currenGeoJsonLayer) {
            (currenGeoJsonLayer as any)
                .clearLayers()
                .setStyle(setDeviceStyle("OK", isSelected));
        }
    }, [deviceData, deviceSelected]);

    return (
        <Circle
            center={[deviceData.latitude, deviceData.longitude]}
            pathOptions={{ color: setDeviceCircleColor(deviceData.id, deviceSelected ), fillColor: "#555555" }}
            radius={2}
            eventHandlers={{ click: clickHandler }}
        >
            <SVGOverlay attributes={{ viewBox: "0 0 512 512", fill: "#62f700" }} bounds={bounds as LatLngTuple[]}>
                <path d="M311.4 32.82C279.9 53.58 259 89.29 259 129.8c0 39.9 20.3 75.2 51.1 96.1l8.1-16.2c-25-17.8-41.2-46.9-41.2-79.9 0-33.59 16.8-63.17 42.5-80.82l-8.1-16.16zm127.2 0l-8.1 16.16C456.2 66.63 473 96.21 473 129.8c0 33-16.2 62.1-41.2 79.9l8.1 16.2c30.8-20.9 51.1-56.2 51.1-96.1 0-40.51-20.9-76.22-52.4-96.98zm-110 34.35C309.4 81.41 297 104.2 297 129.8c0 25 11.9 47.3 30.3 61.6l8.2-16.4c-12.6-11-20.5-27.1-20.5-45.2 0-18.7 8.5-35.3 21.8-46.29l-8.2-16.34zm92.8 0l-8.2 16.34C426.5 94.5 435 111.1 435 129.8c0 18.1-7.9 34.2-20.5 45.2l8.2 16.4c18.4-14.3 30.3-36.6 30.3-61.6 0-25.6-12.4-48.39-31.6-62.63zm-75.3 35.03c-6.9 7.2-11.2 16.9-11.2 27.6 0 10.1 3.8 19.3 10 26.4l9.4-18.7c-.9-2.4-1.4-5-1.4-7.7 0-3.5.8-6.7 2.2-9.6l-9-18zm57.8 0l-9 18c1.4 2.9 2.2 6.1 2.2 9.6 0 2.7-.5 5.3-1.4 7.7l9.4 18.7c6.2-7.1 10-16.3 10-26.4 0-10.7-4.3-20.4-11.2-27.6zM366 144v183h18V144h-18zM25 345v110h462V345H25zm55 39a16 16 0 0 1 16 16 16 16 0 0 1-16 16 16 16 0 0 1-16-16 16 16 0 0 1 16-16zm48 0a16 16 0 0 1 16 16 16 16 0 0 1-16 16 16 16 0 0 1-16-16 16 16 0 0 1 16-16zm48 0a16 16 0 0 1 16 16 16 16 0 0 1-16 16 16 16 0 0 1-16-16 16 16 0 0 1 16-16zM73 473v16h46v-16H73zm320 0v16h46v-16h-46z" />
            </SVGOverlay>
            <Tooltip sticky>Device: {deviceData.name}<br />Description: {deviceData.description}</Tooltip>
        </Circle >
    )
}

export default GeoDevice;