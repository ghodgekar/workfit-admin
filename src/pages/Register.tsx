import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import doctorRegister from "../api/doctor_register";
import "../css/register.css"

function Register(props) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = async (data: any) => {
    const formData = new FormData();
    // data.doctor_mob=7208470446;
    formData.append("doctor_mob", "7208470446");
    formData.append("doctor_logo", data.doctor_logo[0]);
    formData.append("doctor_sign", data.doctor_sign[0]);
    formData.append("doctor_name", data.doctor_name);
    formData.append("doctor_username", data.doctor_username);
    formData.append("doctor_password", data.doctor_password);
    formData.append("doctor_email", data.doctor_email);
    formData.append("doctor_degree", data.doctor_degree);
    formData.append("specialisation", data.specialisation);
    formData.append("subscription_type", data.subscription);
    formData.append("subscription_start_date", "2022-10-14");
    formData.append("subscription_end_date", "2022-10-14");
    formData.append("isActive", "1")
    let registerResponse = await doctorRegister(formData)
    // console.log("registerResponse", registerResponse);
    if (registerResponse.status) {
      props.history.push('/login');
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem className="register_element">
            <IonLabel position="floating" className="register_input">Your Name</IonLabel>
            <IonInput {...register("doctor_name", { required: true })} />
            {errors.doctor_name && <IonText color="danger">Name is required</IonText>}
          </IonItem>

          <IonItem className="register_element">
            <IonLabel position="floating" className="register_input">Username</IonLabel>
            <IonInput {...register("doctor_username", { required: true })} />
            {errors.doctor_username && <IonText color="danger">Username is required</IonText>}
          </IonItem>

          <IonItem className="register_element">
            <IonLabel position="floating" className="register_input"> Password</IonLabel>
            <IonInput type="password" {...register("doctor_password", { required: true, minLength: 8 })} />
            {errors?.doctor_password?.type == "required" && <IonText color="danger">Password is required</IonText>}
            {errors?.doctor_password?.type == "minLength" && <IonText color="danger">Password must be atleast 8 character long</IonText>}
          </IonItem>

          <IonItem className="register_element">
            <IonLabel position="floating" className="register_input"> Email Address</IonLabel>
            <IonInput  {...register("doctor_email", { required: true, })} />
            {errors.doctor_email && <IonText color="danger">Email Address is required</IonText>}
          </IonItem>

          <IonItem className="register_element">
            <IonLabel position="floating" className="register_input"> Education Degree</IonLabel>
            <IonInput  {...register("doctor_degree", { required: true, })} />
            {errors.doctor_degree && <IonText color="danger">Education Degree is required</IonText>}
          </IonItem>

          <IonItem className="register_element">
            <IonLabel position="floating" className="register_input"> Specialization</IonLabel>
            <IonInput {...register("specialisation", { required: true })} />
            {errors.specialisation && <IonText color="danger">Specialization is required</IonText>}
          </IonItem>

          <IonItem className="register_element">
            <IonLabel position="fixed" className="register_input">Your Sign</IonLabel>
            <input type='file' accept="image/*" {...register("doctor_sign", { required: true })} />
            {errors.doctor_sign && <IonText color="danger">please upload a sign</IonText>}
          </IonItem>

          <IonItem className="register_element">
            <IonLabel position="fixed" color="#39f139" className="register_input">Your Logo</IonLabel>
            <input type='file' accept="image/*" {...register("doctor_logo", { required: true })} />
            {errors.doctor_logo && <IonText color="danger">Please upload a logo</IonText>}

          </IonItem>

          <IonItem className="register_element">
            <IonLabel position="floating" className="register_input"> Subscription</IonLabel>
            <IonSelect {...register("subscription", { required: true })}>
              <IonSelectOption value="3-month">3 months - 699</IonSelectOption>
              <IonSelectOption value="6-month">6 months - 999</IonSelectOption>
              <IonSelectOption value="12-month">12 months - 1299</IonSelectOption>
            </IonSelect>
            {errors.subscription && <IonText color="danger">Subscription is required</IonText>}
          </IonItem>

          <IonButton type="submit" expand="block" id="register_button">Register</IonButton>
        </form>

      </IonContent>
    </IonPage>
  );
};

export default Register;
