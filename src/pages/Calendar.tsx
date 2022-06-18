import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';

const Calendar: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calendar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h1>calender heree</h1>
      </IonContent>
    </IonPage>
  );
};

export default Calendar;
