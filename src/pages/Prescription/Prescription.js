import config from "../../config/config.json";
import React, { useEffect, useState } from 'react'
import getPrescriptionById from '../../api/Prescription_Api/getPrescriptionById'
import DescriptionModal from "../../component/Modal/InstructionModal/DescriptionModal";
import "./prescription.css"
import updateExerciseTrack from "../../api/Exercise_Api/updateExerciseTrack";
import { format } from "date-fns";

export default function Prescription() {
    const [isLoading, setisLoading] = useState(true)
    const [prescriptionData, setprescriptionData] = useState([])
    const [adjunctData, setadjunctData] = useState([])
    const [patientData, setpatientData] = useState({})
    const [exerciseData, setexerciseData] = useState([])
    const [descriptionModalData, setdescriptionModalData] = useState([])
    const [descriptionLang, setdescriptionLang] = useState("")
    const [showDescriptionModal, setshowDescriptionModal] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setisLoading(true)
            const url = new URL(window.location.href);

            let params = new URLSearchParams(url.search)
            console.log("params", parseInt(params.get("prescription_id"), 10));
            let prescription = await getPrescriptionById({ id: parseInt(params.get("prescription_id")) })
            console.log("prescription", prescription.data[0]);
            if (prescription.status) {
                setprescriptionData(prescription.data[0])
                if (prescription.data[0].adjunct) {
                    let adjunct = JSON.parse(prescription.data[0].adjunct)
                    let adjunctArr = Object.values(adjunct);
                    setadjunctData(adjunctArr)
                }
                if (prescription.data[0].exercise_arr) {
                    let exercise = JSON.parse(prescription.data[0].exercise_arr)
                    let exerciseArr = Object.values(exercise);
                    console.log("exerciseArr", exerciseArr);
                    setexerciseData(exerciseArr)
                }

                if (prescription.data[0].patient_obj) {
                    let patientObj = JSON.parse(prescription.data[0].patient_obj)
                    setpatientData(patientObj)
                }

            }

            setisLoading(false)
        }
        fetchData();
    }, [])


    const convertDescObj = async (instObj) => {
        let instData = JSON.parse(instObj)
        return Object.values(instData)
    }
    async function viewDescriptionModal(instObj, language) {
        if (instObj) {
            let descriptionData = await convertDescObj(instObj)
            setdescriptionModalData(descriptionData)
        } else {
            setdescriptionModalData([])
        }
        setdescriptionLang(language)
        setshowDescriptionModal(true)

    }

    async function updateExercise(exe, index) {
        if (!exerciseData[index].isCompleted) {
            // console.log("i am heree", exerciseData[index], exe);
            const url = new URL(window.location.href);
            let params = new URLSearchParams(url.search)
            let ExerciseTrackReq = {
                prescription_id: parseInt(params.get("prescription_id")),
                exercise_name: exe.exercise_name,
                exercise_date: format(new Date(), "yyyy-MM-dd")
            }
            setexerciseData((exerciseData) => {
                exerciseData[index].isCompleted = 1
                return [...exerciseData]
            })
            updateExerciseTrack(ExerciseTrackReq)
        }
        else {
            return true
        }
    }

    async function toggleVideoDemo(exe, index) {
        setexerciseData((exerciseData) => {
            if (!exerciseData[index].showVideo) {
                exerciseData[index].showVideo = true
            } else {
                exerciseData[index].showVideo = false
            }
            return [...exerciseData]
        })
    }



    return (
        <>
            {/* Description Modal */}
            {showDescriptionModal &&
                <DescriptionModal
                    descriptionLang={descriptionLang}
                    descriptionModalData={descriptionModalData}
                    setshowDescriptionModal={setshowDescriptionModal}
                    showDescriptionModal={showDescriptionModal}
                />
            }
            {/* Description Modal */}
            <div className='emailTemplate'>
                <div class="flexClass templateHead">
                    <img src="/images/logo.png" id="doctor_logo" />
                    <h5 id="poweredText">Powered By WorkFitt</h5>
                </div>
                <div class="prescriptionBody">
                    <div class="bodyElement">
                        <p>Name - {patientData.patient_name}</p>
                        <p> {patientData.patient_age}/{patientData.patient_gender}</p>
                        <p>C/O - {prescriptionData.prescription_c_o}</p>
                    </div>

                    <div class="bodyElement">
                        <p>Advice - {prescriptionData.doctor_advice}</p>
                    </div>

                    <div class="bodyElement">
                        <p>Instructions - {prescriptionData.instruction_note}</p>
                    </div>

                    <div class="bodyElement">
                        <div class="adjunct">
                            <p>Adjunct -</p>
                            <ul>
                                {adjunctData.map((adj) => {
                                    return (
                                        <li class="adjunct_li flexClass"> <div className="liElement">{adj.adjunct_name} {adj.adjunct_time ? " - " + adj.adjunct_time : ""}{" "}</div>
                                            <div className="liElement">
                                                <span className="instructionSpace" onClick={() => { viewDescriptionModal(adj.instruction_description_english, "English") }}>[Instruction English]</span>{" "}
                                                <span className="instructionSpace" onClick={() => { viewDescriptionModal(adj.instruction_description_hindi, "Hindi") }}>[Instruction Hindi]</span>
                                            </div>
                                        </li>
                                    )
                                }

                                )}
                            </ul>
                        </div>
                    </div>

                    <div class="bodyElement">
                        <h2 id="exerciseHead">Exercise Prescription</h2>
                        {exerciseData.map((exercise, key) => {
                            console.log("exercise", config.backend_url + exercise.audioFilePath)
                            let audioPath = config.backend_url + exercise.audioFilePath
                            {/* audioPath = "/akshaynarkar31@gmail_com_push-ups_June_25_2022_audio.mp3" */}

                            return (
                                <div className="exercise" key={key}>
                                    {exercise.showVideo ?
                                        <div className="exercise_video" dangerouslySetInnerHTML={{ __html: exercise.videoObj.video_iframe }} style={{ position: "relative" }}></div>
                                        : null
                                    }
                                    <div className="flexClass exercise_heading">
                                        <h5> {key + 1}{") "} {exercise.exercise_name}</h5> {" "}
                                        <div className="instContainer">
                                            <span className="instructionSpace" onClick={() => { toggleVideoDemo(exercise, key) }}>[Demo Movement]</span> {" "}
                                            <span className="instructionSpace" onClick={() => { viewDescriptionModal(exercise.instructionObj.instruction_description_english, "English") }}>[Instruction English]</span> {" "}
                                            <span className="instructionSpace" onClick={() => { viewDescriptionModal(exercise.instructionObj.instruction_description_hindi, "Hindi") }}>[Instruction Hindi]</span>
                                        </div>
                                    </div>
                                    <audio controls onPlay={() => { updateExercise(exercise, key) }}>
                                        <source src={audioPath} type="audio/mp3" />
                                    </audio>
                                </div>
                            )
                        })}

                    </div>
                    <div class="bodyElement">
                        <p>Please Fill Out The form available on the link below after 5 and 15 days and send the reports to the
                            therapist. Thankyou</p>
                        <a href="http://"> abcd@gamail.com</a>
                    </div>

                    <div class="footer">
                    <div></div>
                    <div>
                        <img src="/images/signature.jpg" alt="Sign" id="sign" />
                        <h3 id="doctorName">Dr. Vedang Vaidya</h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
