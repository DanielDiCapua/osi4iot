import { FC, useState, useEffect } from 'react';
import { Column } from 'react-table';
import { toast } from 'react-toastify';
import { axiosAuth, getDomainName } from '../../../tools/tools';
import { useAuthState } from '../../../contexts/authContext';
import axios from 'axios';
import EditIcon from '../EditIcon';
import DeleteIcon from '../DeleteIcon';
import DeleteModal from '../../Tools/DeleteModal';
import { GROUPS_OPTIONS } from '../platformAssistantOptions';
import { setGroupIdToEdit, setGroupsOptionToShow, useGroupsDispatch } from '../../../contexts/groups';

export interface IGroup {
    orgId: number;
    id: number;
    name: string;
    acronym: string;
    folderPermission: string;
    groupUid: string;
    telegramInvitationLink: string;
    telegramChatId: string;
    isOrgDefaultGroup: boolean;
    edit: string;
    delete: string;
}

interface DeleteGroupModalProps {
    rowIndex: number;
    orgId: number;
    groupId: number;
    refreshGroups: () => void;
}

const domainName = getDomainName();

const DeleteGroupModal: FC<DeleteGroupModalProps> = ({ rowIndex, orgId, groupId, refreshGroups }) => {
    const [isGroupDeleted, setIsGroupDeleted] = useState(false);
    const component = "group";
    const consequences = "All teams, folders, devices and its measurements belonging to this group are going to be lost.";
    const { accessToken } = useAuthState();

    useEffect(() => {
        if (isGroupDeleted) {
            refreshGroups();
        }
    }, [isGroupDeleted, refreshGroups]);
    
    const action = (hideModal: () => void) => {
        const url = `https://${domainName}/admin_api/group/${orgId}/id/${groupId}`;
        const config = axiosAuth(accessToken);
        axios
            .delete(url, config)
            .then((response) => {
                setIsGroupDeleted(true);
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


    const [showModal] = DeleteModal(component, consequences, action);

    return (
        <DeleteIcon action={showModal} rowIndex={rowIndex} />
    )
}

interface EditGroupProps {
    rowIndex: number;
    groupId: number;
}

const EditGroup: FC<EditGroupProps> = ({ rowIndex, groupId }) => {
    const groupsDispatch = useGroupsDispatch()

    const handleClick = () => {
        const groupIdToEdit = { groupIdToEdit: groupId };
        setGroupIdToEdit(groupsDispatch , groupIdToEdit);

        const groupsOptionToShow = { groupsOptionToShow: GROUPS_OPTIONS.EDIT_GROUP };
        setGroupsOptionToShow(groupsDispatch, groupsOptionToShow);
    };

    return (
        <span onClick={handleClick}>
            <EditIcon rowIndex={rowIndex} />
        </span>
    )
}

export const Create_GROUPS_COLUMNS = (refreshGroups: () => void): Column<IGroup>[] => {
    return [
        {
            Header: "OrgId",
            accessor: "orgId",
            filter: 'equals'
        },
        {
            Header: "GroupId",
            accessor: "id",
            filter: 'equals'
        },
        {
            Header: "Name",
            accessor: "name"
        },
        {
            Header: "Acronym",
            accessor: "acronym"
        },
        {
            Header: () => <div style={{ backgroundColor: '#202226' }}>Folder<br />permission</div>,
            accessor: "folderPermission",
            disableFilters: true
        },
        {
            Header: "Group Hash",
            accessor: "groupUid",
            disableFilters: true
        },
        {
            Header: "Telegram Invitation Link",
            accessor: "telegramInvitationLink",
            disableFilters: true
        },
        {
            Header: "ChatId",
            accessor: "telegramChatId",
            disableFilters: true
        },
        {
            Header: "Type",
            accessor: "isOrgDefaultGroup",
            disableFilters: true
        },
        {
            Header: "",
            accessor: "edit",
            disableFilters: true,
            disableSortBy: true,
            Cell: props => {
                // const orgpId = props.rows[props.row.id as unknown as number]?.cells[0]?.value;
                const groupId = props.rows[props.row.id as unknown as number]?.cells[1]?.value;
                const rowIndex = props.rows[props.row.id as unknown as number]?.cells[0]?.row?.id;
                return <EditGroup groupId={groupId} rowIndex={parseInt(rowIndex)} />
            }
        },
        {
            Header: "",
            accessor: "delete",
            disableFilters: true,
            disableSortBy: true,
            Cell: props => {
                const orgpId = props.rows[props.row.id as unknown as number]?.cells[0]?.value;
                const groupId = props.rows[props.row.id as unknown as number]?.cells[1]?.value;
                const rowIndex = props.rows[props.row.id as unknown as number]?.cells[0]?.row?.id;
                return <DeleteGroupModal orgId={orgpId} groupId={groupId} rowIndex={parseInt(rowIndex)} refreshGroups={refreshGroups} />
            }
        }
    ]
}
