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
    orgsOfGroupsManaged: IOrgOfGroupsManaged[];
    groupsManaged: IGroupManaged[];
    devices: IDevice[];
    digitalTwins: IDigitalTwin[];
    orgSelected: IOrgManaged | null;
    selectOrg: (orgSelected: IOrgManaged) => void;
    groupSelected: IGroupManaged | null;
    selectGroup: (groupSelected: IGroupManaged) => void;
    deviceSelected: IDevice | null;
    selectDevice: (deviceSelected: IDevice) => void;
    digitalTwinSelected: IDigitalTwin | null;
    selectDigitalTwin: (digitalTwinSelected: IDigitalTwin) => void;
    refreshOrgsOfGroupsManaged: () => void;
    refreshGroupsManaged: () => void;
    refreshDevices: () => void;
    refreshDigitalTwins: () => void;
    initialOuterBounds: number[][];
    outerBounds: number[][];
    setNewOuterBounds: (outerBounds: number[][]) => void;
    resetOrgSelection: () => void;
}

const GeolocationContainer: FC<GeolocationContainerProps> = (
    {
        orgsOfGroupsManaged,
        groupsManaged,
        devices,
        digitalTwins,
        orgSelected,
        selectOrg,
        groupSelected,
        selectGroup,
        deviceSelected,
        selectDevice,
        selectDigitalTwin,
        digitalTwinSelected,
        refreshOrgsOfGroupsManaged,
        refreshGroupsManaged,
        refreshDevices,
        refreshDigitalTwins,
        initialOuterBounds,
        outerBounds,
        setNewOuterBounds,
        resetOrgSelection
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

    console.log("Paso por aqui...")

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


    const selectGroupOption = useCallback(() => {
        setGeolocationOptionToShow(GEOLOCATION_OPTIONS.SELECT_GROUP);
    }, []);

    const selectDeviceOption = useCallback(() => {
        setGeolocationOptionToShow(GEOLOCATION_OPTIONS.SELECT_DEVICE);
    }, []);

    const selectDigitalTwinOption = useCallback(() => {
        setGeolocationOptionToShow(GEOLOCATION_OPTIONS.SELECT_DIGITAL_TWIN);
    }, []);


    const giveOrgOfGroupsManagedSelected = useCallback((orgSelected: IOrgOfGroupsManaged) => {
        selectOrg(orgSelected);
    }, [selectOrg]);

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
                    orgsOfGroupsManaged={orgsOfGroupsManaged}
                    groupsManaged={groupsManaged}
                    devices={devices}
                    digitalTwins={digitalTwins}
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
                    selectOrgOption={selectOrgOption}
                    selectGroupOption={selectGroupOption}
                    selectDeviceOption={selectDeviceOption}
                    selectDigitalTwinOption={selectDigitalTwinOption}
                    resetOrgSelection={resetOrgSelection}
                    digitalTwinsState={digitalTwinsState}
                />
            }
            {geolocationOptionToShow === GEOLOCATION_OPTIONS.SELECT_ORG &&
                <SelectOrgOfGroupsManaged
                    backToMap={backToMap}
                    giveOrgOfGroupsManagedSelected={giveOrgOfGroupsManagedSelected}
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