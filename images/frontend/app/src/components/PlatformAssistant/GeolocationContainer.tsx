import React, { FC, useCallback, useEffect, useState } from 'react'
import Map from './Geolocation/Map'
import { IOrgManaged } from './TableColumns/organizationsManagedColumns';
import { IGroupManaged } from './TableColumns/groupsManagedColumns';
import { IDevice } from './TableColumns/devicesColumns';
import SelectGroupManaged from './SelectGroupManaged';
import { IOrgOfGroupsManaged } from './TableColumns/orgsOfGroupsManagedColumns';
import SelectOrgOfGroupsManaged from './SelectOrgOfGroupsManaged';
import SelectDevice from './SelectDevice';
import { IDigitalTwin } from './TableColumns/digitalTwinsColumns';
import { axiosAuth, getDomainName, axiosInstance } from '../../tools/tools';
import { useAuthDispatch, useAuthState } from '../../contexts/authContext';
import useInterval from '../../tools/useInterval';
import { IBuilding } from './TableColumns/buildingsColumns';
import { IFloor } from './TableColumns/floorsColumns';
import SelectFloor from './SelectFloor';


const objectsEqual = (o1: any, o2: any): boolean => {
    return typeof o1 === 'object' && Object.keys(o1).length > 0
        ? Object.keys(o1).length === Object.keys(o2).length
        && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
        : o1 === o2;
}

const arraysEqual = (a1: any, a2: any) => {
    return a1.length === a2.length && a1.every((o: any, idx: number) => objectsEqual(o, a2[idx]));
}

export const GEOLOCATION_OPTIONS = {
    MAP: "Map",
    SELECT_ORG: "Select org",
    SELECT_FLOOR: "Select floor",
    SELECT_GROUP: "Select group",
    SELECT_DEVICE: "Select device",
    SELECT_DIGITAL_TWIN: "Select digital twin",
}

const domainName = getDomainName();
const urlDigitalTwinsState = `https://${domainName}/admin_api/digital_twins_state/user_managed`;

export interface IDigitalTwinState {
    orgId: number;
    groupId: number;
    deviceId: number;
    digitalTwinId: number;
    state: string;
}

interface GeolocationContainerProps {
    buildings: IBuilding[];
    floors: IFloor[];
    orgsOfGroupsManaged: IOrgOfGroupsManaged[];
    groupsManaged: IGroupManaged[];
    devices: IDevice[];
    digitalTwins: IDigitalTwin[];
    buildingSelected: IBuilding | null;
    selectBuilding: (buildingSelected: IBuilding) => void;
    floorSelected: IFloor | null;
    selectFloor: (floorSelected: IFloor) => void;
    orgSelected: IOrgManaged | null;
    selectOrg: (orgSelected: IOrgManaged) => void;
    groupSelected: IGroupManaged | null;
    selectGroup: (groupSelected: IGroupManaged) => void;
    deviceSelected: IDevice | null;
    selectDevice: (deviceSelected: IDevice) => void;
    digitalTwinSelected: IDigitalTwin | null;
    selectDigitalTwin: (digitalTwinSelected: IDigitalTwin) => void;
    refreshBuildings: () => void;
    refreshFloors: () => void;
    refreshOrgsOfGroupsManaged: () => void;
    refreshGroupsManaged: () => void;
    refreshDevices: () => void;
    refreshDigitalTwins: () => void;
    initialOuterBounds: number[][];
    outerBounds: number[][];
    setNewOuterBounds: (outerBounds: number[][]) => void;
    resetBuildingSelection: () => void;
}

const GeolocationContainer: FC<GeolocationContainerProps> = (
    {
        buildings,
        floors,
        orgsOfGroupsManaged,
        groupsManaged,
        devices,
        digitalTwins,
        buildingSelected,
        selectBuilding,
        floorSelected,
        selectFloor,
        orgSelected,
        selectOrg,
        groupSelected,
        selectGroup,
        deviceSelected,
        selectDevice,
        selectDigitalTwin,
        digitalTwinSelected,
        refreshBuildings,
        refreshFloors,
        refreshOrgsOfGroupsManaged,
        refreshGroupsManaged,
        refreshDevices,
        refreshDigitalTwins,
        initialOuterBounds,
        outerBounds,
        setNewOuterBounds,
        resetBuildingSelection
    }) => {
    const { accessToken, refreshToken } = useAuthState();
    const authDispatch = useAuthDispatch();
    const [geolocationOptionToShow, setGeolocationOptionToShow] = useState(GEOLOCATION_OPTIONS.MAP);
    const [digitalTwinsState, setDigitalTwinsState] = useState<IDigitalTwinState[]>([]);

    useEffect(() => {
        const config = axiosAuth(accessToken);
        axiosInstance(refreshToken, authDispatch)
            .get(urlDigitalTwinsState, config)
            .then((response) => {
                const digitalTwinsState = response.data;
                setDigitalTwinsState(digitalTwinsState);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [accessToken, refreshToken, authDispatch]);

    useInterval(() => {
        const config = axiosAuth(accessToken);
        axiosInstance(refreshToken, authDispatch)
            .get(urlDigitalTwinsState, config)
            .then((response) => {
                const newDigitalTwinsState = response.data;
                if (!arraysEqual(newDigitalTwinsState, digitalTwinsState)) {
                    setDigitalTwinsState(newDigitalTwinsState);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, 10000);

    useCallback(() => {
        setGeolocationOptionToShow(GEOLOCATION_OPTIONS.SELECT_DIGITAL_TWIN);
    }, []);


    const backToMap = useCallback(() => {
        setGeolocationOptionToShow(GEOLOCATION_OPTIONS.MAP);
    }, [])

    const selectOrgOption = useCallback(() => {
        setGeolocationOptionToShow(GEOLOCATION_OPTIONS.SELECT_ORG);
    }, []);

    const selectFloorOption = useCallback(() => {
        setGeolocationOptionToShow(GEOLOCATION_OPTIONS.SELECT_FLOOR);
    }, []);

    const selectGroupOption = useCallback(() => {
        setGeolocationOptionToShow(GEOLOCATION_OPTIONS.SELECT_GROUP);
    }, []);

    const selectDeviceOption = useCallback(() => {
        setGeolocationOptionToShow(GEOLOCATION_OPTIONS.SELECT_DEVICE);
    }, []);

    const selectDigitalTwinOption = useCallback(() => {
        setGeolocationOptionToShow(GEOLOCATION_OPTIONS.SELECT_DIGITAL_TWIN);
    }, []);

    const giveBuildingSelected = useCallback((buildingSelected: IBuilding) => {
        selectBuilding(buildingSelected);
    }, [selectBuilding]);

    const giveOrgOfGroupsManagedSelected = useCallback((orgSelected: IOrgOfGroupsManaged) => {
        selectOrg(orgSelected);
    }, [selectOrg]);

    const giveFloorSelected = useCallback((floorSelected: IFloor) => {
        selectFloor(floorSelected);
    }, [selectFloor]);

    const giveGroupManagedSelected = useCallback((groupSelected: IGroupManaged) => {
        selectGroup(groupSelected);
    }, [selectGroup]);

    const giveDeviceSelected = useCallback((deviceSelected: IDevice) => {
        selectDevice(deviceSelected);
    }, [selectDevice]);

    return (
        <>
            {geolocationOptionToShow === GEOLOCATION_OPTIONS.MAP &&
                <Map
                    buildings={buildings}
                    floors={floors}
                    orgsOfGroupsManaged={orgsOfGroupsManaged}
                    groupsManaged={groupsManaged}
                    devices={devices}
                    digitalTwins={digitalTwins}
                    buildingSelected={buildingSelected}
                    selectBuilding={selectBuilding}
                    floorSelected={floorSelected}
                    selectFloor={selectFloor}
                    orgSelected={orgSelected}
                    selectOrg={selectOrg}
                    groupSelected={groupSelected}
                    selectGroup={selectGroup}
                    deviceSelected={deviceSelected}
                    selectDevice={selectDevice}
                    selectDigitalTwin={selectDigitalTwin}
                    digitalTwinSelected={digitalTwinSelected}
                    refreshOrgsOfGroupsManaged={refreshOrgsOfGroupsManaged}
                    refreshGroupsManaged={refreshGroupsManaged}
                    refreshDevices={refreshDevices}
                    refreshDigitalTwins={refreshDigitalTwins}
                    initialOuterBounds={initialOuterBounds}
                    outerBounds={outerBounds}
                    setNewOuterBounds={setNewOuterBounds}
                    selectFloorOption={selectFloorOption}
                    selectOrgOption={selectOrgOption}
                    selectGroupOption={selectGroupOption}
                    selectDeviceOption={selectDeviceOption}
                    selectDigitalTwinOption={selectDigitalTwinOption}
                    resetBuildingSelection={resetBuildingSelection}
                    digitalTwinsState={digitalTwinsState}
                />
            }
            {geolocationOptionToShow === GEOLOCATION_OPTIONS.SELECT_ORG &&
                <SelectOrgOfGroupsManaged
                    backToMap={backToMap}
                    giveOrgOfGroupsManagedSelected={giveOrgOfGroupsManagedSelected}
                    buildings={buildings}
                    giveBuildingSelected={giveBuildingSelected}
                    floors={floors}
                    giveFloorSelected={giveFloorSelected}
                />
            }
            {geolocationOptionToShow === GEOLOCATION_OPTIONS.SELECT_FLOOR &&
                <SelectFloor
                    buildingId={(buildingSelected as IBuilding).id}
                    backToMap={backToMap}
                    giveFloorSelected={giveFloorSelected}
                />
            }
            {geolocationOptionToShow === GEOLOCATION_OPTIONS.SELECT_GROUP &&
                <SelectGroupManaged
                    orgId={(orgSelected as IOrgManaged).id}
                    backToMap={backToMap}
                    giveGroupManagedSelected={giveGroupManagedSelected}
                />
            }
            {geolocationOptionToShow === GEOLOCATION_OPTIONS.SELECT_DEVICE &&
                <SelectDevice
                    groupId={(groupSelected as IGroupManaged).id}
                    backToMap={backToMap}
                    giveDeviceSelected={giveDeviceSelected}
                />
            }
        </>
    )
}

export default GeolocationContainer;