import { IonButton, IonChip, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useForm } from "react-hook-form";
import { format, isBefore, parseISO } from "date-fns";
import { useEffect, useReducer, useState } from 'react';
import "../css/prescription.css"
import { arrowBackCircleOutline, arrowForwardCircleOutline, closeCircle } from 'ionicons/icons';
import addPrescription from "../api/addPrescription";
import HumanBody from '../components/HumanBody';

const EXERCISE_ACTION = {
  ADD: "add",
  CHANGE_REPS: "change-reps",
  CHANGE_SETS: "change-sets",
  CHANGE_HOLDS: "change-holds",
  CHANGE_RESTS: "change-rests",
  CHANGE_START_DATE: "change-start-date",
  CHANGE_END_DATE: "change-end-date",
  REMOVE: "remove"
}



const reducer = (selectedExerciseArr: any, action: any) => {
  let result = []
  switch (action.type) {
    case EXERCISE_ACTION.ADD:
      result = action.payload.value;
      break;

    case EXERCISE_ACTION.CHANGE_REPS:
      action.payload.setexerciseArr(exerciseArr => {
        return exerciseArr.map((exercise) => {
          if (exercise.exercise_name == action.payload.exercise_name) {
            return { ...exercise, reps: action.payload.value }
          }
          return exercise;
        })
      })

      result = selectedExerciseArr.map((exercise) => {
        if (exercise.exercise_name == action.payload.exercise_name) {
          return { ...exercise, reps: action.payload.value }
        }
        return exercise;
      })
      break;

    case EXERCISE_ACTION.CHANGE_SETS:
      action.payload.setexerciseArr(exerciseArr => {
        return exerciseArr.map((exercise) => {
          if (exercise.exercise_name == action.payload.exercise_name) {
            return { ...exercise, sets: action.payload.value }
          }
          return exercise;
        })
      });

      result = selectedExerciseArr.map((exercise) => {
        if (exercise.exercise_name == action.payload.exercise_name) {
          return { ...exercise, sets: action.payload.value }
        }
        return exercise;
      })
      break;

    case EXERCISE_ACTION.CHANGE_HOLDS:
      action.payload.setexerciseArr(exerciseArr => {
        return exerciseArr.map((exercise) => {
          if (exercise.exercise_name == action.payload.exercise_name) {
            return { ...exercise, hold: action.payload.value }
          }
          return exercise;
        })
      });

      result = selectedExerciseArr.map((exercise) => {
        if (exercise.exercise_name == action.payload.exercise_name) {
          return { ...exercise, hold: action.payload.value }
        }
        return exercise;
      })
      break;

      case EXERCISE_ACTION.CHANGE_RESTS:
      action.payload.setexerciseArr(exerciseArr => {
        return exerciseArr.map((exercise) => {
          if (exercise.exercise_name == action.payload.exercise_name) {
            return { ...exercise, rest: action.payload.value }
          }
          return exercise;
        })
      });

      result = selectedExerciseArr.map((exercise) => {
        if (exercise.exercise_name == action.payload.exercise_name) {
          return { ...exercise, rest: action.payload.value }
        }
        return exercise;
      })
      break;

    case EXERCISE_ACTION.CHANGE_START_DATE:
      action.payload.setexerciseArr(exerciseArr => {
        return exerciseArr.map((exercise) => {
          if (exercise.exercise_name == action.payload.exercise_name) {
            return { ...exercise, start_date: action.payload.value }
          }
          return exercise;
        })
      })
      result = selectedExerciseArr.map((exercise) => {
        if (exercise.exercise_name == action.payload.exercise_name) {
          return { ...exercise, start_date: action.payload.value }
        }
        return exercise;
      })
      break;

    case EXERCISE_ACTION.CHANGE_END_DATE:
      action.payload.setexerciseArr(exerciseArr => {
        return exerciseArr.map((exercise) => {
          if (exercise.exercise_name == action.payload.exercise_name) {
            return { ...exercise, end_date: action.payload.value }
          }
          return exercise;
        })
      })
      result = selectedExerciseArr.map((exercise) => {
        if (exercise.exercise_name == action.payload.exercise_name) {
          return { ...exercise, end_date: action.payload.value }
        }
        return exercise;
      })
      break;

    case EXERCISE_ACTION.REMOVE:
      result = selectedExerciseArr.filter((exercise) => {
        return exercise.exercise_name !== action.payload.exercise_name
      })
      break;


    default:
      result = selectedExerciseArr
      break;
  }

  return result
}

const Prescription: React.FC = () => {
  const [bodyPart, setbodyPart] = useState([])
  const [exerciseArr, setexerciseArr] = useState([])
  const [formStep, setformStep] = useState(0)

  type Exercise = typeof exerciseArr[number];
  const compareWith = (o1: Exercise, o2: Exercise) => {
    return o1 && o2 ? o1.exercise_name === o2.exercise_name : o1 === o2;
  };
  const { watch, register, handleSubmit,reset, formState: { errors, isValid } } = useForm({ mode: "all" });
  // const [selectedExerciseArr, setselectedExerciseArr] = useState<Exercise[]>([]);
  const [selectedExerciseArr, dispatch] = useReducer(reducer, [])
  const onSubmit = async (data) => {
    let value = localStorage.getItem("userInfo")
    // let { value } = await Storage.get({ key: 'userInfo' });
    let val = JSON.parse(value)
    if (val && val !== {}) {
      data.doctor_id = val.doctor_Id
    }
    data.exercise_Arr = exerciseArr;
    console.log("i am heree", data);
    let addPrescriptionResp = await addPrescription(data)
    console.log("addPrescriptionResp", addPrescriptionResp);
    if (addPrescriptionResp.status) {
      console.log("success");
      reset()
      setexerciseArr([])
      setformStep(0)
      // window.location.reload();
    }

  }

  useEffect(() => {
    setexerciseArr(
      [
        {
          "exercise_name": "push-ups",
          "reps": 1,
          "sets": 1,
          "hold": 0,
          "rest":0,
          "start_date": format(new Date(), "yyyy-MM-dd"),
          "end_date": format(new Date(), "yyyy-MM-dd"),
          "video_link": "https://www.youtube.com/watch?v=6RrEQJNZwPQ",
        },
        {
          "exercise_name": "pull-ups",
          "start_date": format(new Date(), "yyyy-MM-dd"),
          "end_date": format(new Date(), "yyyy-MM-dd"),
          "video_link": "https://www.youtube.com/watch?v=6RrEQJNZwPQ",
          "reps": 10,
          "sets": 2,
          "hold": 5,
          "rest":0
        },
        {
          "exercise_name": "squats",
          "start_date": format(new Date(), "yyyy-MM-dd"),
          "end_date": format(new Date(), "yyyy-MM-dd"),
          "video_link": "https://www.youtube.com/watch?v=6RrEQJNZwPQ",
          "reps": 10,
          "sets": 2,
          "hold": 5,
          "rest":0
        },
        {
          "exercise_name": "jumping-jacks",
          "start_date": format(new Date(), "yyyy-MM-dd"),
          "end_date": format(new Date(), "yyyy-MM-dd"),
          "video_link": "https://www.youtube.com/watch?v=6RrEQJNZwPQ",
          "reps": 10,
          "sets": 2,
          "hold": 5,
          "rest":0
        }
      ]
    )


  }, [])

  const isBeforetoday = (date) => {
    // console.log("new Date(date)",new Date(date));

    // console.log("new Date()",`${todayDate}T00:00:00`);
    let todayDate = format(new Date(), "yyyy-MM-dd")
    if (isBefore(new Date(date), new Date(`${todayDate}T00:00:00`))) {
      return false
    } else {
      return true
    }
  }

  useEffect(() => {
    console.log("errors", errors);
  }, [errors])

  const part_clicked = (val) => {
    console.log(bodyPart.includes(val.target.getAttribute('id')));
    if (val.target.getAttribute('id')!==null&&!bodyPart.includes(val.target.getAttribute('id'))) {
      setbodyPart((bodyPart) => { return [...bodyPart, val.target.getAttribute('id')] });
    }

    console.log(val.target.getAttribute('id'))
  }

  const removeBodyPart=(part)=>{
    let filteredArray=bodyPart.filter((ele)=>{
      return ele!==part
    })
    setbodyPart(filteredArray)
  }


  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Prescription</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen>

        <form onSubmit={handleSubmit(onSubmit)}>
          {formStep >= 0 &&
            <section className={formStep == 0 ? "showSection" : "hideSection"}>
              <h1>Add Prescription</h1>
              <IonItem className="prescription_input">
                <IonLabel position="floating">Name</IonLabel>
                <IonInput {...register("patient_name", { required: true })} />
              </IonItem>
              {errors.patient_name && <IonText color="danger">Patient Name is required</IonText>}

              <IonItem className="prescription_input">
                <IonLabel position="floating">Email Id</IonLabel>
                <IonInput {...register("patient_email", { required: true, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/ })} />
              </IonItem>
              {errors.patient_email?.type == "required" && <IonText color="danger">Patient Email is required</IonText>}
              {errors.patient_email?.type == "pattern" && errors.patient_email?.type !== "required" && <IonText color="danger">Please Enter Valid Email</IonText>}

              <IonItem className="prescription_input">
                <IonLabel position="floating">Age</IonLabel>
                <IonInput type="number" {...register("patient_age", { required: true, min: 0 })} />
              </IonItem>
              {errors.patient_age?.type == "required" && <IonText color="danger">Patient Age is required</IonText>}
              {errors.patient_age?.type == "pattern" && errors.patient_age?.type !== "required" && <IonText color="danger">Please Enter Valid Age</IonText>}

              <IonItem className="prescription_input">
                <IonLabel position="floating" >Gender</IonLabel>
                <IonSelect {...register("patient_gender", { required: true })}>
                  <IonSelectOption value="M">Male</IonSelectOption>
                  <IonSelectOption value="F">Female</IonSelectOption>
                  <IonSelectOption value="O">Others</IonSelectOption>
                </IonSelect>
              </IonItem>
              {/* {errors.patient_gender && <IonText color="danger">Patient gender is required</IonText>} */}

              <IonItem className="prescription_input">
                <IonLabel position="stacked" className='doe'>Date Of Evaluation</IonLabel>
                {/* <IonDatetime  {...register("date_of_evaluation", { required: true })} min={new Date().toISOString()} ></IonDatetime> */}
                <IonInput type="date" {...register("date_of_evaluation", { required: true, validate: isBeforetoday })} />
              </IonItem>
              {errors?.date_of_evaluation?.type == "validate" && <IonText color="danger">Please Enter a Valid Date</IonText>}

              <IonItem className="prescription_input">
                <IonLabel position="floating">C/O</IonLabel>
                <IonInput {...register("prescription_c_o")} />
              </IonItem>

              <IonItem className="prescription_input">
                <IonLabel position="floating">Findings</IonLabel>
                <IonInput {...register("findings")} />
              </IonItem>

              <IonButton
                onClick={() => { setformStep(1) }}
                //  disabled={!isValid}
                shape="round"
                fill="clear"
                className="nextStep"
                size="large" >
                <IonIcon slot="icon-only" icon={arrowForwardCircleOutline} className="nextIcon" />
              </IonButton>
            </section>
          }



          {formStep >= 1 &&
            <section className={formStep == 1 ? "showSection" : "hideSection"}>
              <IonIcon icon={arrowBackCircleOutline} onClick={() => { setformStep(0) }} className="backBtn" />
              <HumanBody
                part_clicked={part_clicked}
              />
              <div>
                {bodyPart.map((ele, id) => {
                  return (
                    <IonChip key={id}>{ele}
                      <IonIcon icon={closeCircle} onClick={() => { removeBodyPart(ele)}} />
                    </IonChip>
                  )
                })}
              </div>

              <IonButton
                onClick={() => { setformStep(2) }}
                shape="round"
                fill="clear"
                // disabled={!isValid} 
                className="nextStep"
                size="large">
                <IonIcon slot="icon-only" icon={arrowForwardCircleOutline} className="nextIcon" />
              </IonButton>
            </section>
          }



          {formStep >= 2 &&
            <section className={formStep == 2 ? "showSection" : "hideSection"}>
              <IonIcon icon={arrowBackCircleOutline} onClick={() => { setformStep(1) }} className="backBtn" />
              <IonItem className="prescription_input doctorAdvice">
                <IonLabel position="floating">Doctor's Advice</IonLabel>
                <IonInput {...register("doctor_advice")} />
              </IonItem>

              <IonItem className="prescription_input">
                <IonLabel position="floating">Instruction Notes</IonLabel>
                <IonInput {...register("instruction_notes")} />
              </IonItem>

              <IonItem className="prescription_input">
                <IonLabel position="floating">Select Exercise</IonLabel>
                <IonSelect value={selectedExerciseArr} compareWith={compareWith} multiple={true} cancelText="Nah" okText="Okay!" onIonChange={e => {
                  dispatch({ type: EXERCISE_ACTION.ADD, payload: { value: e.detail.value } });
                }}>
                  {exerciseArr.map((exercise, key) => (
                    <IonSelectOption key={key} value={exercise}>
                      {exercise.exercise_name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              {selectedExerciseArr.length ?
                selectedExerciseArr.map((exercise, key) => {
                  // console.log("exercise", exercise);
                  return (
                    <div className="exercise">
                      <IonText >
                        <b className="exerciseName">{`${key + 1}) ${exercise.exercise_name}`}</b>
                      </IonText>
                      <div className="removeExercise" onClick={() => { dispatch({ type: EXERCISE_ACTION.REMOVE, payload: { exercise_name: exercise.exercise_name } }); }}>X</div>
                      <div className="exercise_desc">
                        <div className="flexRow">
                          <div className="flexItem">
                            <IonLabel position="floating" >Reps</IonLabel>
                            <IonInput type="number" value={exercise.reps} onIonChange={(e) => { dispatch({ type: EXERCISE_ACTION.CHANGE_REPS, payload: { value: e.detail.value, exercise_name: exercise.exercise_name, exerciseArr, setexerciseArr } }) }} />
                          </div>

                          <div className="flexItem">
                            <IonLabel position="floating">Sets</IonLabel>
                            <IonInput type="number" value={exercise.sets} onIonChange={(e) => { dispatch({ type: EXERCISE_ACTION.CHANGE_SETS, payload: { value: e.detail.value, exercise_name: exercise.exercise_name, exerciseArr, setexerciseArr } }) }} />
                          </div>

                          <div className="flexItem">
                            <IonLabel position="floating">Holds</IonLabel>
                            <IonInput type="number" value={exercise.hold} onIonChange={(e) => { dispatch({ type: EXERCISE_ACTION.CHANGE_HOLDS, payload: { value: e.detail.value, exercise_name: exercise.exercise_name, exerciseArr, setexerciseArr } }) }} />
                          </div>

                          <div className="flexItem">
                            <IonLabel position="floating">Rest</IonLabel>
                            <IonInput type="number" value={exercise.rest} onIonChange={(e) => { dispatch({ type: EXERCISE_ACTION.CHANGE_RESTS, payload: { value: e.detail.value, exercise_name: exercise.exercise_name, exerciseArr, setexerciseArr } }) }} />
                          </div>
                        </div>
                        <div className="flexRow">
                          <div className="flexItem">
                            <IonLabel position="floating" style={{ "paddingLeft": "10px" }}>Start Date</IonLabel>
                            <IonInput type="date" value={exercise.start_date} onIonChange={(e) => { dispatch({ type: EXERCISE_ACTION.CHANGE_START_DATE, payload: { value: e.detail.value, exercise_name: exercise.exercise_name, exerciseArr, setexerciseArr } }) }} />
                          </div>
                          <div className="flexItem">
                            <IonLabel position="floating">End Date</IonLabel>
                            <IonInput type="date" value={exercise.end_date} onIonChange={(e) => { dispatch({ type: EXERCISE_ACTION.CHANGE_END_DATE, payload: { value: e.detail.value, exercise_name: exercise.exercise_name, exerciseArr, setexerciseArr } }) }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }) :
                null
              }

              <IonButton type="submit" expand="block" id="add__button" disabled={!isValid}>Done</IonButton>
            </section>}
        </form>

      </IonContent>
    </IonPage>
  );
};

export default Prescription;
