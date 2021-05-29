import { FC, useState, SyntheticEvent } from 'react';
import styled from "styled-components";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { axiosAuth, getDomainName } from "../../tools/tools";
import { useAuthState } from "../../contexts/authContext";
import { toast } from "react-toastify";
import FormikControl from "../Tools/FormikControl";
import FormButtonsProps from "../Tools/FormButtons";
import FormTitle from "../Tools/FormTitle";
import { setOrgsOptionToShow, useOrgsDispatch } from '../../contexts/orgs';
import { ORGS_OPTIONS } from './platformAssistantOptions';

const FormContainer = styled.div`
	font-size: 12px;
    padding: 30px 10px 30px 20px;
    border: 3px solid #3274d9;
    border-radius: 20px;
    width: 400px;
    height: calc(100vh - 290px);

    form > div:nth-child(2) {
        margin-right: 10px;
    }
`;

const ControlsContainer = styled.div`
    height: calc(100vh - 420px);
    width: 100%;
    padding: 0px 5px;
    overflow-y: auto;
    /* width */
    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #202226;
        border-radius: 5px;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #2c3235; 
        border-radius: 5px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background-color: #343840;
    }

    div:first-child {
        margin-top: 0;
    }
`;


const domainName = getDomainName();

interface CreateOrganizationProps {
    backToTable: () => void;
    refreshOrgs: () => void;
}

const CreateOrganization: FC<CreateOrganizationProps> = ({ backToTable, refreshOrgs }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { accessToken } = useAuthState();
    const orgsDispatch = useOrgsDispatch();
    const initialOrgData = {
        name: "",
        acronym: "",
        address: "",
        city: "",
        zipCode: "",
        state: "",
        country: "",
        longitude: 0,
        latitude: 0,
        telegramInvitationLink: "",
        telegramChatId: "",
        orgAdminArray: [
            {
                firstName: "",
                surname: "",
                email: "",
                login: "",
                password: ""
            }
        ]
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(190,"The maximum number of characters allowed is 190").required('Required'),
        acronym: Yup.string().max(20,"The maximum number of characters allowed is 20").required('Required'),
        address: Yup.string().max(255,"The maximum number of characters allowed is 255").required('Required'),
        city: Yup.string().max(255,"The maximum number of characters allowed is 255").required('Required'),
        zipCode: Yup.string().max(50,"The maximum number of characters allowed is 50").required('Required'),
        state: Yup.string().max(255,"The maximum number of characters allowed is 255").required('Required'),
        country: Yup.string().max(255,"The maximum number of characters allowed is 255").required('Required'),
        longitude: Yup.number().moreThan(-180, "The minimum value of longitude is -180").lessThan(180, "The maximum value of longitude is 180").required('Required'),
        latitude: Yup.number().moreThan(-90, "The minimum value of latitude is -90").lessThan(90, "The maximum value of latitude is 90").required('Required'),
        telegramInvitationLink: Yup.string().url("Enter a valid url").max(60,"The maximum number of characters allowed is 60").required('Required'),
        telegramChatId: Yup.string().max(15,"The maximum number of characters allowed is 15").required('Required'),
        orgAdminArray: Yup.array()
            .of(
                Yup.object().shape({
                    firstName: Yup.string().max(127,"The maximum number of characters allowed is 127").required('Required'),
                    surname: Yup.string().max(127,"The maximum number of characters allowed is 127").required('Required'),
                    email: Yup.string().email("Enter a valid email").max(190, "The maximum number of characters allowed is 190").required('Required'),
                    login: Yup.string().max(190, "The maximum number of characters allowed is 190"),
                    password: Yup.string().max(255,"The maximum number of characters allowed is 255"),
                })
            )
            .required('Must have org admin') // these constraints are shown if and only if inner constraints are satisfied
            .min(1, 'Must be at least one org amdin')
    });

    const onSubmit = (values: {}, actions: any) => {
        const url = `https://${domainName}/admin_api/organization`;
        const config = axiosAuth(accessToken);
        setIsSubmitting(true);
        axios
            .post(url, values, config)
            .then((response) => {
                const data = response.data;
                toast.success(data.message);
                const orgsOptionToShow = { orgsOptionToShow: ORGS_OPTIONS.TABLE };
                setIsSubmitting(false);
                setOrgsOptionToShow(orgsDispatch, orgsOptionToShow);
                refreshOrgs();
            })
            .catch((error) => {
                const errorMessage = error.response.data.message;
                toast.error(errorMessage);
                backToTable();
            })
    }

    const onCancel = (e: SyntheticEvent) => {
        e.preventDefault();
        backToTable();
    };

    return (
        <>
            <FormTitle isSubmitting={isSubmitting } >Create org</FormTitle>
            <FormContainer>
                <Formik initialValues={initialOrgData} validationSchema={validationSchema} onSubmit={onSubmit} >
                    {
                        formik => (
                            <Form>
                                <ControlsContainer>
                                    <FormikControl
                                        control='input'
                                        label='Org name'
                                        name='name'
                                        type='text'
                                    />
                                    <FormikControl
                                        control='input'
                                        label='Org acronym'
                                        name='acronym'
                                        type='text'
                                    />
                                    <FormikControl
                                        control='input'
                                        label='Address'
                                        name='address'
                                        type='text'
                                    />
                                    <FormikControl
                                        control='input'
                                        label='City'
                                        name='city'
                                        type='text'
                                    />
                                    <FormikControl
                                        control='input'
                                        label='Zip code'
                                        name='zipCode'
                                        type='text'
                                    />
                                    <FormikControl
                                        control='input'
                                        label='State'
                                        name='state'
                                        type='text'
                                    />
                                    <FormikControl
                                        control='input'
                                        label='Country'
                                        name='country'
                                        type='text'
                                    />
                                    <FormikControl
                                        control='input'
                                        label='Longitude'
                                        name='longitude'
                                        type='text'
                                    />
                                    <FormikControl
                                        control='input'
                                        label='Latitude'
                                        name='latitude'
                                        type='text'
                                    />
                                    <FormikControl
                                        control='input'
                                        label='Telegram invitation link'
                                        name='telegramInvitationLink'
                                        type='text'
                                    />
                                    <FormikControl
                                        control='input'
                                        label='Telegram chat id'
                                        name='telegramChatId'
                                        type='text'
                                    />
                                    <FormikControl
                                        control='inputArray'
                                        label='Organization admins'
                                        name='orgAdminArray'
                                        labelArray={['First name *', 'Surname *', 'Email *', 'Username', 'Password']}
                                        nameArray={['firstName', 'surname', 'email', 'login', 'password']}
                                        typeArray={['text', 'text', 'email', 'text', 'password']}
                                        addLabel="org admim"
                                    />
                                </ControlsContainer>
                                <FormButtonsProps onCancel={onCancel} isValid={formik.isValid} isSubmitting={formik.isSubmitting} />
                            </Form>
                        )
                    }
                </Formik>
            </FormContainer>
        </>
    )
}

export default CreateOrganization;