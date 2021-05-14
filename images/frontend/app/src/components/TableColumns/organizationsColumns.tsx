import { Column } from 'react-table';
import EditIcon from '../EditIcon';
import DeleteIcon from '../DeleteIcon';

export interface IOrganization {
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
    edit: string;
    delete: string;
}

export const ORGANIZATIONS_COLUMNS: Column<IOrganization>[] = [
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
        Header: "Address",
        accessor: "address",
        disableFilters: true
    },
    {
        Header: "City",
        accessor: "city",
        disableFilters: true
    },
    {
        Header: "Zip code",
        accessor: "zipCode",
        disableFilters: true
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
        Header: "",
        accessor: "edit",
        disableFilters: true,
        disableSortBy: true,
        Cell: props => {
            const orgId = props.rows[props.row.id as unknown as number]?.cells[0].value;
            return <EditIcon id={orgId} />
        }
    },
    {
        Header: "",
        accessor: "delete",
        disableFilters: true,
        disableSortBy: true,
        Cell: props => {
            const orgId = props.rows[props.row.id as unknown as number]?.cells[0].value;
            return <DeleteIcon id={orgId} />
        }
    }
]