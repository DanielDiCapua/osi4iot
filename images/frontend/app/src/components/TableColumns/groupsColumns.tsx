import { Column } from 'react-table';
import EditIcon from '../EditIcon';
import DeleteIcon from '../DeleteIcon';

export interface IGroup {
    id: number;
    name: string;
    acronym: string;
    orgId: number;
    folderPermission: string;
    groupUid: string;
    telegramInvitationLink: string;
    telegramChatId: string;
    isOrgDefaultGroup: boolean;
    edit: string;
    delete: string;
}

export const GROUPS_COLUMNS: Column<IGroup>[] = [
    {
        Header: "Id",
        accessor: "id"
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
        Header: "OrgId",
        accessor: "orgId"
    },
    {
        Header: () => <div style={{backgroundColor: '#202226'}}>Folder<br/>permission</div>,
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
        Header: () => <div style={{backgroundColor: '#202226'}}>Telegram<br/>chatId</div>,
        accessor: "telegramChatId",
        disableFilters: true
    },
    {
        Header: () => <div style={{backgroundColor: '#202226'}}>Is org<br/>default?</div>,
        accessor: "isOrgDefaultGroup",
        disableFilters: true
    },
    {
        Header: "",
        accessor: "edit",
        disableFilters: true,
        disableSortBy: true,
        Cell: props => {
            const groupId = props.rows[props.row.id as unknown as number]?.cells[0].value;
            return <EditIcon id={groupId} />
        }
    },
    {
        Header: "",
        accessor: "delete",
        disableFilters: true,
        disableSortBy: true,
        Cell: props => {
            const groupId = props.rows[props.row.id as unknown as number]?.cells[0].value;
            return <DeleteIcon id={groupId} />
        }
    }
]