import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonInput, IonPage, IonTitle, IonToolbar, } from "@ionic/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { toast } from "../toast";
import { useForm } from "react-hook-form";
import doctorLogin from "../api/doctor_login";
import { Storage } from '@capacitor/storage';



function Login(props) {
    const [errorMsg, seterrorMsg] = useState("")
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = async (data: any) => {
        
        let loginResp = await doctorLogin(data)
        // console.log("resp", loginResp);
        if (loginResp?.status && loginResp?.data && loginResp?.data?.length) {
            seterrorMsg("")
            props.setisAuthed(true)
            localStorage.setItem('userInfo', JSON.stringify(loginResp.data[0]))
            await Storage.set({
                key: 'userInfo',
                value: JSON.stringify(loginResp.data[0]),
            });


            if (window.location.href.includes("/login")) {
                console.log("insidee iff");

                window.location.href = `${window.location.origin}`
            } else {
                console.log("insidee else");
                window.location.reload()
            }
        } else {
            seterrorMsg("Oop's Something Went Wrong")
        }

    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <IonItem>
                        <IonLabel position="floating"> Username</IonLabel>
                        <IonInput {...register("doctor_username", { required: true })} />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="floating"> Password</IonLabel>
                        <IonInput type="password" {...register("doctor_password", { required: true })} />
                    </IonItem>

                    <IonButton color="danger" type="submit">Login</IonButton>
                    <Link to="/register" >
                        <IonButton color="primary" >Register</IonButton>
                    </Link>
                </form>
                {/* <Link to="/lostpassword" ><p >Lost your password?</p></Link> */}
            </IonContent>
        </IonPage>
    );
};

export default Login;