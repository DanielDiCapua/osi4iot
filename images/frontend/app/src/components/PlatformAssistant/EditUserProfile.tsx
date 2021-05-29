import { FC, useState, useEffect, SyntheticEvent } from "react";
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

const FormContainer = styled.div`
	font-size: 12px;
    padding: 10px 20px 30px 20px;
    width: 300px;
    border: 3px solid #3274d9;
    border-radius: 20px;
`;

interface IUserProfile {
    userId: number;
    name: string;
    firstName: string;
    surname: string;
    login: string;
    email: string;
    telegramId: string;
}

interface EditUserProfileProps {
    userProfileToEdit: IUserProfile;
    refreshUserProfile: () => void;
    backToUserProfile: () => void;
}

const domainName = getDomainName();

const EditUserProfile: FC<EditUserProfileProps> = ({  userProfileToEdit, refreshUserProfile, backToUserProfile }) => {
    const { accessToken } = useAuthState();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userProfileUpdated, setUserProfileUpdated] = useState(false);
    const validationSchema = Yup.object({
        firstName: Yup.string().required('Required'),
        surname: Yup.string().required('Required'),
        login: Yup.string().required('Required'),
        email: Yup.string().email("Enter a valid email").required('Required'),
        telegramId: Yup.string().required('Required'),
    });

    useEffect(() => {
        if(userProfileUpdated) refreshUserProfile();
    }, [userProfileUpdated, refreshUserProfile]);
    
    const onSubmit = (values: {}, actions: any) => {
        const url = `https://${domainName}/admin_api/auth/user_profile`;
        const config = axiosAuth(accessToken);
        setIsSubmitting(true);
        axios
            .patch(url, values, config)
            .then((response) => {
                const data = response.data;
                toast.success(data.message);
                setIsSubmitting(false);
                setUserProfileUpdated(true);
                backToUserProfile();
            })
            .catch((error) => {
                const errorMessage = error.response.data.message;
                toast.error(errorMessage);
                backToUserProfile();
            })
    };

    const onCancel = (e: SyntheticEvent) => {
        e.preventDefault();
        backToUserProfile();
    };

    return (
        <>
            <FormTitle isSubmitting={isSubmitting}>Edit user profile</FormTitle>
            <FormContainer>
                <Formik initialValues={userProfileToEdit} validationSchema={validationSchema} onSubmit={onSubmit} >
                    {
                        formik => (
                            <Form>
                                <FormikControl
                                    control='input'
                                    label='First name'
                                    name='firstName'
                                    type='text'
                                />
                                <FormikControl
                                    control='input'
                                    label='Surname'
                                    name='surname'
                                    type='text'
                                />
                                <FormikControl
                                    control='input'
                                    label='Username'
                                    name='login'
                                    type='text'
                                />
                                <FormikControl
                                    control='input'
                                    label='Email'
                                    name='email'
                                    type='email'
                                />
                                <FormikControl
                                    control='input'
                                    label='TelegramId'
                                    name='telegramId'
                                    type='text'
                                />
                                <FormButtonsProps onCancel={onCancel} isValid={formik.isValid} isSubmitting={formik.isSubmitting} />
                            </Form>
                        )
                    }
                </Formik>
            </FormContainer>
        </>

    )
}

export default EditUserProfile;