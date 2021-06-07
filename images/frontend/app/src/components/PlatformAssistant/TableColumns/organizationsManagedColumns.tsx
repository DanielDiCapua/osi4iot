import { FC, useState, useEffect } from 'react';
import { Column } from 'react-table';
import AddUsersIcon from '../AddUsersIcon';
import RemoveUsersIcon from '../RemoveUsersIcon';
import { ORGS_MANAGED_OPTIONS } from '../platformAssistantOptions';
import { useOrgsManagedDispatch, setOrgManagedIdToCreateOrgUsers, setOrgManagedRowIndex, setOrgsManagedOptionToShow } from '../../../contexts/orgsManagedOptions';
import { toast } from 'react-toastify';
import { axiosAuth, getDomainName } from '../../../tools/tools';
import { useAuthState } from '../../../contexts/authContext';
import axios from 'axios';
import DeleteModalWithSelect from '../../Tools/DeleteModalWithSelect';

interface AddOrgUsersProps {
    rowIndex: number;
    orgManagedId: number;
}


const AddOrgUsers: FC<AddOrgUsersProps> = ({ rowIndex, orgManagedId }) => {
    const orgsManagedDispatch = useOrgsManagedDispatch()

    const handleClick = () => {
        const orgManagedIdToCreateOrgUsers = { orgManagedIdToCreateOrgUsers: orgManagedId };
        setOrgManagedIdToCreateOrgUsers(orgsManagedDispatch, orgManagedIdToCreateOrgUsers);

        const orgManagedRowIndex = { orgManagedRowIndex: rowIndex };
        setOrgManagedRowIndex(orgsManagedDispatch, orgManagedRowIndex);

        const orgsManagedOptionToShow = { orgsManagedOptionToShow: ORGS_MANAGED_OPTIONS.CREATE_ORG_USERS };
        setOrgsManagedOptionToShow(orgsManagedDispatch, orgsManagedOptionToShow);
    };

    return (
        <span onClick={handleClick}>
            <AddUsersIcon rowIndex={rowIndex} />
        </span>
    )
}

interface RemoveAllOrgUsersModalProps {
    rowIndex: number;
    orgId: number;
    refreshOrgUsers: () => void;
}

const domainName = getDomainName();

const RemoveAllOrgUsersModal: FC<RemoveAllOrgUsersModalProps> = ({ rowIndex, orgId, refreshOrgUsers }) => {
    const [isGroupMembersRemoved, setIsGroupMembersRemoved] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const title = "REMOVE ALL ORG USERS";
    const consequences = "Depending of the chosen option are going to be removed of the org: all non group admin users, all non org admin users or simply all users of the org.";
    const question = "Choose what users to remove of the org:";
    const options = [
        { value: 'allNotGroupsAdminUsers', label: 'All not group admin users' },
        { value: 'allNotOrgAdminUsers', label: 'All not org admin users' },
        { value: 'allUsers', label: 'All users' },
    ];
    const width = 380;
    const height = 390;
    const { accessToken } = useAuthState();

    const showLoader = () => {
        setIsSubmitting(true);
    }

    useEffect(() => {
        if (isGroupMembersRemoved) {
            refreshOrgUsers();
        }
    }, [isGroupMembersRemoved, refreshOrgUsers]);

    const action = (hideModal: () => void, whoToRemove: string) => {
        const url = `https://${domainName}/admin_api/organization/${orgId}/users/${whoToRemove}`;
        const config = axiosAuth(accessToken);
        axios
            .delete(url, config)
            .then((response) => {
                setIsGroupMembersRemoved(true);
                setIsSubmitting(false);
                const data = response.data;
                toast.success(data.message);
                hideModal();
            })
            .catch((error) => {
                const errorMessage = error.response.data.message;
                toast.error(errorMessage);
                hideModal();
            })
    }

    const [showModal] =
        DeleteModalWithSelect(
            title,
            question,
            consequences,
            action,
            isSubmitting,
            showLoader,
            options,
            width,
            height
        );

    return (
        <RemoveUsersIcon action={showModal} rowIndex={rowIndex} />
    )
}

export interface IOrgManaged {
    id: number;
    name: string;
    acronym: string;
    address: string;
    city: string;
    zipCode: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
}

interface IOrgManagedColumn extends IOrgManaged {
    addOrgUsers: string;
    removeAllOrgUsers: string;
}

export const CREATE_ORGS_MANAGED_COLUMNS = (refreshOrgUsers: () => void): Column<IOrgManagedColumn>[] => {
    return [
        {
            Header: "Id",
            accessor: "id",
            filter: 'equals'
        },
        {
            Header: "Name",
            accessor: "name",
        },
        {
            Header: "Acronym",
            accessor: "acronym"
        },
        {
            Header: "Address",
            accessor: "address",
            disableFilters: true,
        },
        {
            Header: "City",
            accessor: "city",
            disableFilters: true,
        },
        {
            Header: "Zip code",
            accessor: "zipCode",
            disableFilters: true,
        },
        {
            Header: "State",
            accessor: "state",
            disableFilters: true
        },
        {
            Header: "Country",
            accessor: "country",
            disableFilters: true
        },
        {
            Header: "Longitude",
            accessor: "longitude",
            disableFilters: true
        },
        {
            Header: "Latitude",
            accessor: "latitude",
            disableFilters: true
        },
        {
            Header: () => <div style={{ backgroundColor: '#202226' }}>Add<br />users</div>,
            accessor: "addOrgUsers",
            disableFilters: true,
            disableSortBy: true,
            Cell: props => {
                const orgManagedId = props.rows[props.row.id as unknown as number]?.cells[0]?.value;
                const rowIndex = props.rows[props.row.id as unknown as number]?.cells[0]?.row?.id;
                return <AddOrgUsers rowIndex={parseInt(rowIndex, 10)} orgManagedId={parseInt(orgManagedId, 10)} />
            }
        },
        {
            Header: () => <div style={{ backgroundColor: '#202226' }}>Remove<br />all users</div>,
            accessor: "removeAllOrgUsers",
            disableFilters: true,
            disableSortBy: true,
            Cell: props => {
                const orgId = props.rows[props.row.id as unknown as number]?.cells[0]?.value;
                const rowIndex = props.rows[props.row.id as unknown as number]?.cells[0]?.row?.id;
                return <RemoveAllOrgUsersModal orgId={orgId} rowIndex={parseInt(rowIndex, 10)} refreshOrgUsers={refreshOrgUsers} />
            }
        }
    ]
}