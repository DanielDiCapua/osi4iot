import { FC, useEffect } from "react";
import { useMap, LayerGroup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import GeoOrg from './GeoOrg';
import { IOrgManaged } from "../TableColumns/organizationsManagedColumns";
import { IGroupManaged } from "../TableColumns/groupsManagedColumns";


interface GeoOrgsProps {
    outerBounds: number[][];
    orgDataArray: IOrgManaged[];
    orgSelected: IOrgManaged | null;
    selectOrg: (orgSelected: IOrgManaged) => void;
    groupSelected: IGroupManaged | null;
}

const GeoOrgs: FC<GeoOrgsProps> = ({ outerBounds, orgDataArray, orgSelected, selectOrg, groupSelected }) => {
    const map = useMap();

    useEffect(() => {
        map.fitBounds(outerBounds as LatLngTuple[]);
    }, [map, outerBounds])

    return (
        <LayerGroup>
            {
                orgDataArray.map(orgData =>
                    <GeoOrg key={orgData.id} orgData={orgData} orgSelected={orgSelected} selectOrg={selectOrg} groupSelected={groupSelected} />
                )

            }
        </LayerGroup>
    )
}

export default GeoOrgs;